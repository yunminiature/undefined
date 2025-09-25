import { Router } from 'express'
import { z } from 'zod'
import sanitizeHtml from 'sanitize-html'
import { Comment } from '../models/Comment'

const router = Router()

const createSchema = z.object({
  body: z.string().trim().min(1).max(5000),
  parentCommentId: z.number().int().positive().optional(),
})

router.get('/by-topic/:topicId', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100)
  const offset = Number(req.query.offset) || 0
  const topicId = Number(req.params.topicId)
  const comments = await Comment.findAll({ where: { topicId, parent_comment_id: null } as any, limit, offset, order: [['createdAt', 'DESC']] })
  return res.json(comments)
})

router.get('/:commentId/replies', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100)
  const offset = Number(req.query.offset) || 0
  const parentId = Number(req.params.commentId)
  const replies = await Comment.findAll({ where: { parent_comment_id: parentId } as any, limit, offset, order: [['createdAt', 'ASC']] })
  return res.json(replies)
})

router.post('/by-topic/:topicId', async (req, res) => {
  const parsed = createSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid data', details: parsed.error.flatten() })
  const { body, parentCommentId } = parsed.data
  const user = res.locals.user
  const comment = await Comment.create({
    topicId: Number(req.params.topicId),
    parentCommentId: parentCommentId ?? null,
    body: sanitizeHtml(body, { allowedTags: [], allowedAttributes: {} }),
    authorId: String(user?.id || user?.user?.id || 'unknown'),
  } as any)
  return res.status(201).json(comment)
})

router.patch('/:id', async (req, res) => {
  const comment = await Comment.findByPk(Number(req.params.id))
  if (!comment) return res.status(404).json({ error: 'Not found' })
  const user = res.locals.user
  if (String(comment.authorId) !== String(user?.id || user?.user?.id)) return res.status(403).json({ error: 'Forbidden' })
  const data = createSchema.partial().safeParse(req.body)
  if (!data.success) return res.status(400).json({ error: 'Invalid data', details: data.error.flatten() })
  if (data.data.body !== undefined) comment.body = sanitizeHtml(data.data.body, { allowedTags: [], allowedAttributes: {} })
  if (data.data.parentCommentId !== undefined) comment.parentCommentId = data.data.parentCommentId ?? null
  await comment.save()
  return res.json(comment)
})

router.delete('/:id', async (req, res) => {
  const comment = await Comment.findByPk(Number(req.params.id))
  if (!comment) return res.status(404).json({ error: 'Not found' })
  const user = res.locals.user
  if (String(comment.authorId) !== String(user?.id || user?.user?.id)) return res.status(403).json({ error: 'Forbidden' })
  await comment.destroy()
  return res.status(204).end()
})

export default router


