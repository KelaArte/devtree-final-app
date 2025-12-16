import { Request, Response } from 'express'
import User from '../models/User'
import Visit from '../models/Visit'
import mongoose from 'mongoose'

// POST /user/:handle/visit   (pública)
export const trackVisit = async (req: Request, res: Response) => {
  try {
    const { handle } = req.params
    const user = await User.findOne({ handle })
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const userAgent = String(req.headers['user-agent'] || '')

    const visit = new Visit({ user: user._id, ip, userAgent })
    await visit.save()

    return res.json({ message: 'Visita registrada' })
  } catch (e: any) {
    console.error(e)
    return res.status(500).json({ error: e.message || 'Error registrando visita' })
  }
}

// GET /user/:handle/stats   (pública): estadísticas públicas del perfil
export const getStatsByHandle = async (req: Request, res: Response) => {
  try {
    const { handle } = req.params
    const user = await User.findOne({ handle })
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

    const userId = user._id as mongoose.Types.ObjectId

    // total
    const totalVisits = await Visit.countDocuments({ user: userId })

    // últimas 24h
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const last24Hours = await Visit.countDocuments({ user: userId, createdAt: { $gte: since24h } })

    // últimos 7 días
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const last7Days = await Visit.countDocuments({ user: userId, createdAt: { $gte: since7d } })

    // últimos 30 días
    const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const last30Days = await Visit.countDocuments({ user: userId, createdAt: { $gte: since30d } })

    return res.json({
      stats: {
        totalVisits,
        last24Hours,
        last7Days,
        last30Days
      }
    })
  } catch (e: any) {
    console.error(e)
    return res.status(500).json({ error: e.message || 'Error obteniendo stats' })
  }
}

// GET /user/my-stats   (auth) -> estadísticas detalladas del usuario autenticado
export const getMyStats = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'No autorizado' })
    const userId = req.user._id

    const totalVisits = await Visit.countDocuments({ user: userId })

    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const last24Hours = await Visit.countDocuments({ user: userId, createdAt: { $gte: since24h } })

    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const last7Days = await Visit.countDocuments({ user: userId, createdAt: { $gte: since7d } })

    const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const last30Days = await Visit.countDocuments({ user: userId, createdAt: { $gte: since30d } })

    return res.json({
      stats: {
        totalVisits,
        last24Hours,
        last7Days,
        last30Days
      }
    })
  } catch (e: any) {
    console.error(e)
    return res.status(500).json({ error: e.message || 'Error obteniendo mis stats' })
  }
}