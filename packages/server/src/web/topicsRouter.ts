import { Router } from 'express';
import { z } from 'zod';
import sanitizeHtml from 'sanitize-html';
import { Topic } from '../models/Topic';

const router = Router();

const createSchema = z.object({
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(10000),
});

router.get('/', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const offset = Number(req.query.offset) || 0;
  const query = (req.query.query as string) || '';

  const where: Record<string, unknown> = {};
  if (query) where.title = { $like: `%${query}%` };

  const topics = await Topic.findAll({ where, limit, offset, order: [['createdAt', 'DESC']] });

  // Обогащаем данные информацией об авторах
  const enrichedTopics = await Promise.all(
    topics.map(async (topic) => {
      const topicData = topic.toJSON();

      // Если автор - текущий пользователь, используем данные из res.locals.user
      const currentUser = res.locals.user;
      if (currentUser && String(currentUser.id) === String(topicData.authorId)) {
        const author = {
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

        return {
          ...topicData,
          author,
        };
      }

      // Для других авторов используем fallback (в будущем можно добавить кеш пользователей)
      return {
        ...topicData,
        author: {
          id: topicData.authorId,
          login: `User${topicData.authorId}`,
          display_name: `User ${topicData.authorId}`,
          first_name: 'Unknown',
          second_name: 'User',
          email: '',
        },
      };
    })
  );

  // Возвращаем в формате TopicListResponse
  const response = {
    data: enrichedTopics,
    total: enrichedTopics.length,
    hasMore: enrichedTopics.length === limit,
  };

  res.json(response);
});

router.get('/:id', async (req, res) => {
  const topic = await Topic.findByPk(Number(req.params.id));
  if (!topic) return res.status(404).json({ error: 'Not found' });

  // Обогащаем данные информацией об авторе
  const topicData = topic.toJSON();
  const currentUser = res.locals.user;

  let author;
  if (currentUser && String(currentUser.id) === String(topicData.authorId)) {
    // Используем данные текущего пользователя
    author = {
      id: currentUser.id,
      login: currentUser.login || currentUser.display_name || String(currentUser.id),
      display_name:
        currentUser.display_name || currentUser.login || `${currentUser.first_name} ${currentUser.second_name}`.trim(),
      first_name: currentUser.first_name || '',
      second_name: currentUser.second_name || '',
      email: currentUser.email || '',
    };
  } else {
    // Fallback для других пользователей
    author = {
      id: topicData.authorId,
      login: `User${topicData.authorId}`,
      display_name: `User ${topicData.authorId}`,
      first_name: 'Unknown',
      second_name: 'User',
      email: '',
    };
  }

  const enrichedTopic = {
    ...topicData,
    author,
  };

  res.json(enrichedTopic);
});

router.post('/', async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid data', details: parsed.error.flatten() });
  const { title, body } = parsed.data;
  const sanitized = sanitizeHtml(body, { allowedTags: [], allowedAttributes: {} });
  const user = res.locals.user;
  const topic = await Topic.create({
    title,
    body: sanitized,
    authorId: String(user?.id || user?.user?.id || 'unknown'),
  });
  res.status(201).json(topic);
});

router.patch('/:id', async (req, res) => {
  const topic = await Topic.findByPk(Number(req.params.id));
  if (!topic) return res.status(404).json({ error: 'Not found' });
  const user = res.locals.user;
  if (String(topic.authorId) !== String(user?.id || user?.user?.id))
    return res.status(403).json({ error: 'Forbidden' });

  const data = createSchema.partial().safeParse(req.body);
  if (!data.success) return res.status(400).json({ error: 'Invalid data', details: data.error.flatten() });

  if (data.data.title !== undefined) topic.title = data.data.title;
  if (data.data.body !== undefined)
    topic.body = sanitizeHtml(data.data.body, { allowedTags: [], allowedAttributes: {} });
  await topic.save();
  res.json(topic);
});

router.delete('/:id', async (req, res) => {
  const topic = await Topic.findByPk(Number(req.params.id));
  if (!topic) return res.status(404).json({ error: 'Not found' });
  const user = res.locals.user;
  if (String(topic.authorId) !== String(user?.id || user?.user?.id))
    return res.status(403).json({ error: 'Forbidden' });
  await topic.destroy();
  res.status(204).end();
});

export default router;
