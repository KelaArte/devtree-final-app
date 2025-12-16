import mongoose, { Document, Schema, Types } from 'mongoose'

/**
 * Interface para el modelo de visitas al perfil
 * Registra cada visita a un perfil de usuario con información de análisis
 */
export interface IProfileVisit extends Document {
    userId: Types.ObjectId  // Usuario cuyo perfil fue visitado
    visitorIp?: string      // IP del visitante (opcional, para prevenir spam)
    visitedAt: Date         // Fecha y hora de la visita
    userAgent?: string      // Información del navegador/dispositivo
}

/**
 * Schema de Mongoose para las visitas al perfil
 * Incluye índices para optimizar consultas de estadísticas
 */
const profileVisitSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true  // Índice para búsquedas rápidas por usuario
    },
    visitorIp: {
        type: String,
        trim: true
    },
    visitedAt: {
        type: Date,
        default: Date.now,
        index: true  // Índice para consultas por fecha
    },
    userAgent: {
        type: String,
        trim: true
    }
})

// Índice compuesto para búsquedas eficientes de visitas por usuario y fecha
profileVisitSchema.index({ userId: 1, visitedAt: -1 })

// Crear el modelo
const ProfileVisitModel = mongoose.model<IProfileVisit>('ProfileVisit', profileVisitSchema)
export default ProfileVisitModel
