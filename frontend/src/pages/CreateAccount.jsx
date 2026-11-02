import { useState } from 'react'
import '../styles/auth.css'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import Checkbox from '../components/Checkbox.jsx'
import Hero from '../components/Hero.jsx'
import Input from '../components/Input.jsx'
import {
  ArrowRightIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from '../components/icons.jsx'
import './create-account.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function CreateAccount({ onNavigate }) {
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [terms, setTerms] = useState(false)

  const validate = (next) => {
    const nextErrors = {}

    if (!next.fullName.trim()) {
      nextErrors.fullName = 'Enter your name'
    }

    if (!next.email.trim()) {
      nextErrors.email = 'Enter your email'
    } else if (!EMAIL_PATTERN.test(next.email.trim())) {
      nextErrors.email = 'Enter a valid email address'
    }

    if (!next.password) {
      nextErrors.password = 'Create a password'
    } else if (next.password.length < 8) {
      nextErrors.password = 'Use at least 8 characters'
    }

    if (!next.confirmPassword) {
      nextErrors.confirmPassword = 'Confirm your password'
    } else if (next.confirmPassword !== next.password) {
      nextErrors.confirmPassword = 'Passwords do not match'
    }

    if (!next.terms) {
      nextErrors.terms = 'Please accept the Terms of Service and Privacy Policy'
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
      setFieldError(field, validate({ ...next, terms })[field])
    }
  }

  const handleBlur = (field) => () => {
    setFieldError(field, validate({ ...values, terms })[field])
  }

  const handleTermsChange = (event) => {
    const nextTerms = event.target.checked
    setTerms(nextTerms)
    setFieldError(
      'terms',
      validate({ ...values, terms: nextTerms }).terms,
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setErrors(validate({ ...values, terms }))
  }

  return (
    <main className="auth">
      <Hero
        title={
          <>
            Build better days<span className="hero__accent">.</span>
          </>
        }
        description="Small habits. Big progress. Turn your goals into a stronger, healthier you."
      />

      <div className="auth__panel">
        <Card className="auth__card">
          <header className="auth__header">
            <h2 className="auth__title">Create Account</h2>
            <p className="auth__subtitle">
              Start your habit journey and build a better you with DOJO.
            </p>
          </header>

          <form className="auth__form" onSubmit={handleSubmit} noValidate>
            <Input
              id="create-fullname"
              name="fullName"
              type="text"
              label="Full Name"
              placeholder="Alex Chen"
              autoComplete="name"
              required
              icon={<UserIcon />}
              value={values.fullName}
              onChange={handleChange('fullName')}
              onBlur={handleBlur('fullName')}
              error={errors.fullName}
            />

            <Input
              id="create-email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              autoComplete="email"
              required
              icon={<MailIcon />}
              value={values.email}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              error={errors.email}
            />

            <Input
              id="create-password"
              name="password"
              type="password"
              label="Password"
              placeholder="Create a strong password"
              autoComplete="new-password"
              required
              icon={<LockIcon />}
              togglePassword
              value={values.password}
              onChange={handleChange('password')}
              onBlur={handleBlur('password')}
              error={errors.password}
            />

            <Input
              id="create-confirm-password"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
              icon={<LockIcon />}
              togglePassword
              value={values.confirmPassword}
              onChange={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              error={errors.confirmPassword}
            />

            <Checkbox
              id="create-terms"
              className="auth__terms"
              checked={terms}
              onChange={handleTermsChange}
              error={errors.terms}
              label={
                <>
                  I agree to the{' '}
                  <a className="auth__link" href="#">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a className="auth__link" href="#">
                    Privacy Policy
                  </a>
                </>
              }
            />

            <Button type="submit" icon={<ArrowRightIcon />} iconPosition="right">
              Create Account
            </Button>

            <p className="auth__footer">
              Already have an account?{' '}
              <button
                type="button"
                className="auth__link"
                onClick={() => onNavigate('login')}
              >
                Log In
              </button>
            </p>
          </form>
        </Card>
      </div>
    </main>
  )
}
