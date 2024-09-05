import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'
import { authenticationValidator } from '#validators/auth_validator'

export default class AuthenticationController {
  async showSignup({ inertia }: HttpContext) {
    return inertia.render('auth/signup')
  }

  async signup({ request, session, response, auth }: HttpContext) {
    const payload = await request.validateUsing(authenticationValidator)

    const userAlreadyExists = await User.findBy('email', payload.email)
    if (userAlreadyExists !== null) {
      session.flash('errors.email', 'Please login to continue.')
      return response.redirect().back()
    }

    const user = await User.create(payload)
    await user.save()

    await auth.use('web').login(user)

    return response.redirect('/dashboard')
  }

  async showLogin({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  async login({ request, auth, response, session }: HttpContext) {
    const { email, password } = await request.validateUsing(authenticationValidator)

    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)

      return response.redirect().toPath('/dashboard')
    } catch {
      session.flash('errors.auth', 'Invalid credentials')
      return response.redirect().toPath('/login')
    }
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()

    return response.redirect().toPath('/login')
  }
}
