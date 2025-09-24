import { Router } from 'express'
import { z } from 'zod'
import sanitizeHtml from 'sanitize-html'
import { Topic } from '../models/Topic'

const router = Router()

const createSchema = z.object({
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(10000),
})

router.get('/', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100)
  const offset = Number(req.query.offset) || 0
  const query = (req.query.query as string) || ''

  const where: any = {}
  if (query) where.title = { $like: `%${query}%` }

  const topics = await Topic.findAll({ where, limit, offset, order: [['createdAt', 'DESC']] })
  res.json(topics)
})

router.get('/:id', async (req, res) => {
  const topic = await Topic.findByPk(Number(req.params.id))
  if (!topic) return res.status(404).json({ error: 'Not found' })
  res.json(topic)
})

router.post('/', async (req, res) => {
  const parsed = createSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid data', details: parsed.error.flatten() })
  const { title, body } = parsed.data
  const sanitized = sanitizeHtml(body, { allowedTags: [], allowedAttributes: {} })
  const user = res.locals.user
  const topic = await Topic.create({ title, body: sanitized, authorId: String(user?.id || user?.user?.id || 'unknown') })
  res.status(201).json(topic)
})

router.patch('/:id', async (req, res) => {
  const topic = await Topic.findByPk(Number(req.params.id))
  if (!topic) return res.status(404).json({ error: 'Not found' })
  const user = res.locals.user
  if (String(topic.authorId) !== String(user?.id || user?.user?.id)) return res.status(403).json({ error: 'Forbidden' })

  const data = createSchema.partial().safeParse(req.body)
  if (!data.success) return res.status(400).json({ error: 'Invalid data', details: data.error.flatten() })

  if (data.data.title !== undefined) topic.title = data.data.title
  if (data.data.body !== undefined) topic.body = sanitizeHtml(data.data.body, { allowedTags: [], allowedAttributes: {} })
  await topic.save()
  res.json(topic)
})

router.delete('/:id', async (req, res) => {
  const topic = await Topic.findByPk(Number(req.params.id))
  if (!topic) return res.status(404).json({ error: 'Not found' })
  const user = res.locals.user
  if (String(topic.authorId) !== String(user?.id || user?.user?.id)) return res.status(403).json({ error: 'Forbidden' })
  await topic.destroy()
  res.status(204).end()
})

export default router


