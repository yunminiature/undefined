import { Router } from 'express'
import { z } from 'zod'
import { Reaction } from '../models/Reaction'

const router = Router()

const setSchema = z.object({ type: z.enum(['like', 'dislike', 'laugh', 'angry', 'sad']) })

router.get('/:commentId', async (req, res) => {
  const commentId = Number(req.params.commentId)
  const reactions = await Reaction.findAll({ where: { commentId } as any })
  const aggregates = reactions.reduce<Record<string, number>>((acc, r: any) => {
    acc[r.type] = (acc[r.type] || 0) + 1
    return acc
  }, {})
  res.json({ aggregates, reactions })
})

router.put('/:commentId', async (req, res) => {
  const parsed = setSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid data', details: parsed.error.flatten() })
  const user = res.locals.user
  const commentId = Number(req.params.commentId)
  const [reaction] = await Reaction.findOrCreate({
    where: { commentId, user_id: String(user?.id || user?.user?.id) } as any,
    defaults: { commentId, userId: String(user?.id || user?.user?.id), type: parsed.data.type } as any,
  })
  reaction.type = parsed.data.type as any
  await reaction.save()
  res.json(reaction)
})

router.delete('/:commentId', async (req, res) => {
  const user = res.locals.user
  const commentId = Number(req.params.commentId)
  await Reaction.destroy({ where: { comment_id: commentId, user_id: String(user?.id || user?.user?.id) } as any })
  res.status(204).end()
})

export default router


