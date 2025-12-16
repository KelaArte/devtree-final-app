import { Router } from 'express'
import { body } from 'express-validator' //body permite validar el req.body
import User from './models/User'
import { createAccount, getUser, login, updateProfile, uploadImage } from './handlers'
import { trackVisit, getVisitStats, getMyStats } from './handlers/profileVisit'
import { handleInputErrors } from './middleware/validation'
import { authenticate } from './middleware/auth'
import { validateHandle } from './middleware/visitValidation'
import { checkHandleAvailability } from './handlers/index'



//Permite configurar un objeto con todas las rutas que después podemos agregar a la app principal server.ts

const router = Router()

/* Autenticación y Registro*/
router.post('/auth/register',

  body('handle').notEmpty().withMessage('El handle no puede ir vacío'),
  body('name').notEmpty().withMessage('El nombre no puede ir vacío'),
  body('email').isEmail().withMessage('Email no válido'),
  body('password').isLength({ min: 8 }).withMessage('El password es muy corto, mínimo 8 caracteres'),
  handleInputErrors,
  createAccount)

router.post('/auth/login',

  body('email').isEmail().withMessage('Email no válido'),
  body('password').notEmpty().withMessage('El password es muy corto, mínimo 8 caracteres'),

  login
)

router.get('/user', authenticate, getUser)

//actualizar un registro en la BD: put y patch
//put: crea un nuevo elemento o reemplaza una representación del elemento de destino con los datos de la petición
//patch: aplica modificaciones parciales a un recurso (sería mejor porque solo vamos a cambiar el handle y su descripción)

//para modificar un usuario necesitamos que esté autenticado por eso el autehtnciate.
router.patch('/user',
  authenticate, // primero autenticar
  body('handle').notEmpty().withMessage('El handle no puede ir vacio'),
  handleInputErrors,
  updateProfile
)

router.post('/user/image', authenticate, uploadImage)

/* Rutas para contador de visitas al perfil */
// Registrar una visita al perfil (pública)
router.post('/user/:handle/visit', validateHandle, trackVisit)

// Obtener estadísticas de visitas de un usuario (pública)
router.get('/user/:handle/stats', validateHandle, getVisitStats)

// Obtener estadísticas detalladas del usuario autenticado (privada)
router.get('/user/my-stats', authenticate, getMyStats)

router.get('/auth/check-handle', checkHandleAvailability)
export default router