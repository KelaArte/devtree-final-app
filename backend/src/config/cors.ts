import { CorsOptions } from 'cors'

// lee la variable (puedes poner varias separadas por coma si quieres)
const FRONTEND = process.env.FRONTEND_URL // ejemplo: http://localhost:5173

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    // debug: ver qué origin está llegando (borra luego)
    console.log('CORS origin:', origin)

    // permitir requests sin origin (Postman, curl, tests) -> origin === undefined
    if (!origin) {
      return callback(null, true)
    }

    // Construir whitelist dinámicamente aceptando algunas variantes comunes
    const whiteList = new Set<string>([
      FRONTEND ?? '',
      // acepta también 127.0.0.1 en caso se abra con esa IP
      (FRONTEND ? FRONTEND.replace('localhost', '127.0.0.1') : ''),
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000'
    ].filter(Boolean)) // eliminar strings vacíos

    // Si llamas al server con --api (modo test), podrías querer permitir origin undefined
    if (process.argv[2] === '--api') {
      return callback(null, true)
    }

    if (whiteList.has(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Error de CORS: origen no permitido - ' + origin))
    }
  },
  credentials: true,
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
}
