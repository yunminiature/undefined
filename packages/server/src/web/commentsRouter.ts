import { Router } from 'express';
import { z } from 'zod';
import sanitizeHtml from 'sanitize-html';
import { Comment } from '../models/Comment';

const router = Router();

const createSchema = z.object({
  body: z.string().trim().min(1).max(5000),
  parentCommentId: z.number().int().positive().optional(),
});

router.get('/by-topic/:topicId', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const offset = Number(req.query.offset) || 0;
  const topicId = Number(req.params.topicId);

  // Count total root-level comments for the topic
  const total = await Comment.count({ where: { topicId, parentCommentId: null } as unknown });

  // Fetch page
  const comments = await Comment.findAll({
    where: { topicId, parentCommentId: null } as unknown,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  // Обогащаем данные информацией об авторах
  const currentUser = res.locals.user;
  const enrichedComments = comments.map((comment) => {
    const commentData = comment.toJSON();

    let author;
    if (currentUser && String(currentUser.id) === String(commentData.authorId)) {
      // Используем данные текущего пользователя
      author = {
        id: currentUser.id,
        login: currentUser.login || currentUser.display_name || String(currentUser.id),
        display_name:
          currentUser.display_name ||
          currentUser.login ||
          `${currentUser.first_name} ${currentUser.second_name}`.trim(),
        first_name: currentUser.first_name || '',
        second_name: currentUser.second_name || '',
        email: currentUser.email || '',
      };
    } else {
      // Fallback для других пользователей
      author = {
        id: commentData.authorId,
        login: `User${commentData.authorId}`,
        display_name: `User ${commentData.authorId}`,
        first_name: 'Unknown',
        second_name: 'User',
        email: '',
      };
    }

    return {
      ...commentData,
      author,
    };
  });

  // Возвращаем в формате CommentListResponse
  const response = {
    data: enrichedComments,
    total,
    hasMore: offset + enrichedComments.length < total,
  };

  return res.json(response);
});

router.get('/:commentId/replies', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const offset = Number(req.query.offset) || 0;
  const parentId = Number(req.params.commentId);
  const replies = await Comment.findAll({
    where: { parent_comment_id: parentId },
    limit,
    offset,
    order: [['createdAt', 'ASC']],
  });

  // Обогащаем данные информацией об авторах
  const currentUser = res.locals.user;
  const enrichedReplies = replies.map((reply) => {
    const replyData = reply.toJSON();

    let author;
    if (currentUser && String(currentUser.id) === String(replyData.authorId)) {
      // Используем данные текущего пользователя
      author = {
        id: currentUser.id,
        login: currentUser.login || currentUser.display_name || String(currentUser.id),
        display_name:
          currentUser.display_name ||
          currentUser.login ||
          `${currentUser.first_name} ${currentUser.second_name}`.trim(),
        first_name: currentUser.first_name || '',
        second_name: currentUser.second_name || '',
        email: currentUser.email || '',
      };
    } else {
      // Fallback для других пользователей
      author = {
        id: replyData.authorId,
        login: `User${replyData.authorId}`,
        display_name: `User ${replyData.authorId}`,
        first_name: 'Unknown',
        second_name: 'User',
        email: '',
      };
    }

    return {
      ...replyData,
      author,
    };
  });

  // Возвращаем в формате CommentListResponse
  const response = {
    data: enrichedReplies,
    total: enrichedReplies.length,
    hasMore: enrichedReplies.length === limit,
  };

  return res.json(response);
});

router.post('/by-topic/:topicId', async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid data', details: parsed.error.flatten() });
  const { body, parentCommentId } = parsed.data;
  const user = res.locals.user;
  const comment = await Comment.create({
    topicId: Number(req.params.topicId),
    parentCommentId: parentCommentId ?? null,
    body: sanitizeHtml(body, { allowedTags: [], allowedAttributes: {} }),
    authorId: String(user?.id || user?.user?.id || 'unknown'),
  });
  return res.status(201).json(comment);
});

router.patch('/:id', async (req, res) => {
  const comment = await Comment.findByPk(Number(req.params.id));
  if (!comment) return res.status(404).json({ error: 'Not found' });
  const user = res.locals.user;
  if (String(comment.authorId) !== String(user?.id || user?.user?.id))
    return res.status(403).json({ error: 'Forbidden' });
  const data = createSchema.partial().safeParse(req.body);
  if (!data.success) return res.status(400).json({ error: 'Invalid data', details: data.error.flatten() });
  if (data.data.body !== undefined)
    comment.body = sanitizeHtml(data.data.body, { allowedTags: [], allowedAttributes: {} });
  if (data.data.parentCommentId !== undefined) comment.parentCommentId = data.data.parentCommentId ?? null;
  await comment.save();
  return res.json(comment);
});

router.delete('/:id', async (req, res) => {
  const comment = await Comment.findByPk(Number(req.params.id));
  if (!comment) return res.status(404).json({ error: 'Not found' });
  const user = res.locals.user;
  if (String(comment.authorId) !== String(user?.id || user?.user?.id))
    return res.status(403).json({ error: 'Forbidden' });
  await comment.destroy();
  return res.status(204).end();
});

export default router;
