import { useState } from 'react'
import '../styles/auth.css'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import Checkbox from '../components/Checkbox.jsx'
import Hero from '../components/Hero.jsx'
import Input from '../components/Input.jsx'
import {
  ArrowRightIcon,
  GoogleIcon,
  LockIcon,
  MailIcon,
} from '../components/icons.jsx'
import './login.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login({ onNavigate }) {
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [remember, setRemember] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  const validate = (next) => {
    const nextErrors = {}

    if (!next.email.trim()) {
      nextErrors.email = 'Enter your email'
    } else if (!EMAIL_PATTERN.test(next.email.trim())) {
      nextErrors.email = 'Enter a valid email address'
    }

    if (!next.password) {
      nextErrors.password = 'Enter your password'
    }

    return nextErrors
  }

  const setFieldError = (field, message) => {
    setErrors((prev) => {
      const next = { ...prev }
      if (message) {
        next[field] = message
      } else {
        delete next[field]
      }
      return next
    })
  }

  const handleChange = (field) => (event) => {
    const next = { ...values, [field]: event.target.value }
    setValues(next)
    if (errors[field]) {
      setFieldError(field, validate(next)[field])
    }
  }

  const handleBlur = (field) => () => {
    setFieldError(field, validate(values)[field])
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    setServerError('')

    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email.trim(),
          password: values.password,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token)
        if (remember) {
          localStorage.setItem('remember', 'true')
        }
        window.location.href = '/today'
        return
      }

      if (response.status === 404) {
        setServerError('Користувача не знайдено')
        setErrors((prev) => ({ ...prev, email: 'Користувача не знайдено' }))
      } else if (response.status === 401) {
        setServerError('Невірний email або пароль')
        setErrors((prev) => ({ ...prev, password: 'Невірний email або пароль' }))
      } else {
        setServerError(data.error || 'Не вдалося увійти')
      }
    } catch (error) {
      setServerError('Сервер недоступний. Спробуйте пізніше.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth">
      <Hero
        size="lg"
        title={
          <>
            Small habits.
            <br />
            <span className="hero__accent">A stronger you.</span>
          </>
        }
        description="Turn your goals into daily action. Build better habits, level up, and become your best self with DOJO."
      />

      <div className="auth__panel">
        <Card className="auth__card">
          <header className="auth__header">
            <h2 className="auth__title">Log In</h2>
            <p className="auth__subtitle">
              Welcome back! Continue your habit journey and keep leveling up.
            </p>
          </header>

          <form className="auth__form" onSubmit={handleSubmit} noValidate>
            <Input
              id="login-email"
              name="email"
              type="email"
              label="Email"
              placeholder="you@domain.com"
              autoComplete="email"
              required
              icon={<MailIcon />}
              value={values.email}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              error={errors.email}
            />

            <Input
              id="login-password"
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              icon={<LockIcon />}
              togglePassword
              value={values.password}
              onChange={handleChange('password')}
              onBlur={handleBlur('password')}
              error={errors.password}
            />

            <div className="auth__row">
              <Checkbox
                id="login-remember"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                label="Remember me"
              />
              <button type="button" className="auth__link">
                Forgot password?
              </button>
            </div>

            {serverError && (
              <p className="field__message field__message--error" role="alert">
                {serverError}
              </p>
            )}

            <Button
              type="submit"
              className="btn--icon-end"
              icon={<ArrowRightIcon />}
              iconPosition="right"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </Button>

            <div className="auth__divider">
              <span>OR</span>
            </div>

            <Button
              variant="secondary"
              icon={<GoogleIcon />}
              iconPosition="left"
            >
              Continue with Google
            </Button>

            <p className="auth__footer">
              Don&rsquo;t have an account?{' '}
              <button
                type="button"
                className="auth__link"
                onClick={() => onNavigate('create')}
              >
                Create account
              </button>
            </p>
          </form>
        </Card>
      </div>
    </main>
  )
}
