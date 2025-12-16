import { Request, Response, NextFunction } from 'express'
import { param, validationResult } from 'express-validator'

/**
 * Validaciones para el parámetro handle en las rutas de visitas
 * Asegura que el handle sea válido antes de procesar la solicitud
 */
export const validateHandle = [
    param('handle')
        .notEmpty()
        .withMessage('El handle es requerido')
        .isString()
        .withMessage('El handle debe ser un texto')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('El handle debe tener entre 3 y 30 caracteres')
        .matches(/^[a-z0-9_-]+$/)
        .withMessage('El handle solo puede contener letras minúsculas, números, guiones y guiones bajos'),

    // Middleware para manejar errores de validación
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        next()
    }
]
