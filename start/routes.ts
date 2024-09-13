/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import transmit from '@adonisjs/transmit/services/main'

transmit.registerRoutes()

import env from './env.js'
import { middleware } from './kernel.js'

const healthChecksController = () => import('#controllers/health_checks_controller')

const authController = () => import('#controllers/auth_controller')
const courseController = () => import('#controllers/courses_controller')
const dashboardController = () => import('#controllers/dashboard_controller')
const questionController = () => import('#controllers/questions_controller')
router.on('/').renderInertia('home')

router.get('/health', [healthChecksController]).use(({ request, response }, next) => {
  if (env.get('NODE_ENV') === 'development') return next()

  if (request.header('x-monitoring-secret') === env.get('APP_KEY')) return next()

  response.unauthorized({ message: 'Unauthorized access' })
})

router
  .group(() => {
    router.get('/login', [authController, 'showLogin'])
    router.get('/signup', [authController, 'showSignup'])
    router.post('/auth/signup', [authController, 'signup'])
    router.post('/auth/login', [authController, 'login'])
  })
  .use([middleware.guest()])
router.post('/auth/logout', [authController, 'logout']).use([middleware.auth()])

router.get('/dashboard', [dashboardController, 'index']).use([middleware.auth()])

router.get('/courses', [courseController, 'index']).use([middleware.auth()])
router.get('/courses/create', [courseController, 'create']).use([middleware.auth()])
router.post('/courses', [courseController, 'store']).use([middleware.auth()])
router.get('/courses/:courseId', [courseController, 'show']).use([middleware.auth()])

// router.post('/questions', [questionController, 'store']).use([middleware.auth()])
router.get('/questions/current', [questionController, 'current']).use([middleware.auth()])
router.put('/questions/:id', [questionController, 'update']).use([middleware.auth()])
