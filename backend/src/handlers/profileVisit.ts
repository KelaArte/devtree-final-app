import { Request, Response } from 'express'
import User from '../models/User'
import ProfileVisit from '../models/ProfileVisit'

/**
 * Registra una visita al perfil de un usuario
 * Implementa rate limiting básico: 1 visita por IP por perfil por hora
 */
export const trackVisit = async (req: Request, res: Response) => {
    try {
        const { handle } = req.params

        // Buscar el usuario por su handle
        const user = await User.findOne({ handle })

        if (!user) {
            const error = new Error('Usuario no encontrado')
            return res.status(404).json({ error: error.message })
        }

        // Obtener IP del visitante
        const visitorIp = req.ip || req.socket.remoteAddress || 'unknown'
        const userAgent = req.get('user-agent') || 'unknown'

        // Rate limiting: verificar si ya existe una visita de esta IP en la última hora
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
        const recentVisit = await ProfileVisit.findOne({
            userId: user._id,
            visitorIp,
            visitedAt: { $gte: oneHourAgo }
        })

        // Si ya visitó recientemente, no contar la visita pero retornar éxito
        if (recentVisit) {
            return res.status(200).json({
                message: 'Visita ya registrada recientemente',
                counted: false
            })
        }

        // Registrar la nueva visita
        const visit = new ProfileVisit({
            userId: user._id,
            visitorIp,
            userAgent,
            visitedAt: new Date()
        })

        await visit.save()

        res.status(201).json({
            message: 'Visita registrada correctamente',
            counted: true
        })

    } catch (error) {
        console.error('Error al registrar visita:', error)
        const err = new Error('Error al registrar la visita')
        return res.status(500).json({ error: err.message })
    }
}

/**
 * Obtiene las estadísticas de visitas de un usuario por su handle
 * Información pública disponible para cualquiera
 */
export const getVisitStats = async (req: Request, res: Response) => {
    try {
        const { handle } = req.params

        // Buscar el usuario por su handle
        const user = await User.findOne({ handle })

        if (!user) {
            const error = new Error('Usuario no encontrado')
            return res.status(404).json({ error: error.message })
        }

        // Contar total de visitas
        const totalVisits = await ProfileVisit.countDocuments({ userId: user._id })

        // Contar visitas de los últimos 30 días
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        const recentVisits = await ProfileVisit.countDocuments({
            userId: user._id,
            visitedAt: { $gte: thirtyDaysAgo }
        })

        // Contar visitas de los últimos 7 días
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        const weeklyVisits = await ProfileVisit.countDocuments({
            userId: user._id,
            visitedAt: { $gte: sevenDaysAgo }
        })

        res.json({
            handle: user.handle,
            name: user.name,
            stats: {
                totalVisits,
                last30Days: recentVisits,
                last7Days: weeklyVisits
            }
        })

    } catch (error) {
        console.error('Error al obtener estadísticas:', error)
        const err = new Error('Error al obtener estadísticas')
        return res.status(500).json({ error: err.message })
    }
}

/**
 * Obtiene estadísticas detalladas del usuario autenticado
 * Incluye información adicional solo disponible para el dueño del perfil
 */
export const getMyStats = async (req: Request, res: Response) => {
    try {
        // req.user viene del middleware de autenticación
        const userId = req.user._id

        // Contar total de visitas
        const totalVisits = await ProfileVisit.countDocuments({ userId })

        // Visitas por período
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

        const [last30Days, last7Days, last24Hours] = await Promise.all([
            ProfileVisit.countDocuments({ userId, visitedAt: { $gte: thirtyDaysAgo } }),
            ProfileVisit.countDocuments({ userId, visitedAt: { $gte: sevenDaysAgo } }),
            ProfileVisit.countDocuments({ userId, visitedAt: { $gte: oneDayAgo } })
        ])

        // Obtener las últimas 10 visitas con detalles
        const recentVisits = await ProfileVisit.find({ userId })
            .sort({ visitedAt: -1 })
            .limit(10)
            .select('visitedAt userAgent -_id')

        res.json({
            stats: {
                totalVisits,
                last30Days,
                last7Days,
                last24Hours
            },
            recentVisits
        })

    } catch (error) {
        console.error('Error al obtener mis estadísticas:', error)
        const err = new Error('Error al obtener estadísticas')
        return res.status(500).json({ error: err.message })
    }
}
