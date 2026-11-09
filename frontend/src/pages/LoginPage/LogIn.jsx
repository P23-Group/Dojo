import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Input,
  PasswordInput,
  Checkbox,
  ArrowRightIcon,
  GoogleIcon,
} from '../../components';
import AuthLayout from '../../layouts/AuthLayout/AuthLayout';
import character from '../../assets/characters/character-lvl-5.png';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

// Повертає об'єкт помилок: { поле: 'текст' }. Порожній {} = усе добре.
function validateLogin({ email, password }) {
  const errors = {};

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return errors;
}

const initialValues = { email: '', password: '', remember: false };

export default function LoginPage() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined })); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateLogin(values);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // TODO: підключити запит до бекенду
      console.log('Login:', values);
    }
  };

  return (
    <AuthLayout
      title="Log In"
      subtitle="Welcome back! Continue your habit journey and keep leveling up."
      headline={
        <>
          Small habits.
          <br />
          <span className="auth__accent">A stronger you.</span>
        </>
      }
      description="Turn your goals into daily action. Build better habits, level up, and become your best self with DOJO."
      character={character}
    >
      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@domain.com"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
        />

        <PasswordInput
          label="Password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />

        <div className="auth__row">
          <Checkbox
            name="remember"
            label="Remember me"
            checked={values.remember}
            onChange={handleChange}
          />
          {/* TODO: замінити на <Link to="/forgot-password"> коли буде сторінка */}
          <a href="#" className="auth__link" onClick={(e) => e.preventDefault()}>
            Forgot password?
          </a>
        </div>

        <Button type="submit" fullWidth>
          Log In <ArrowRightIcon />
        </Button>

        <div className="auth__divider">OR</div>

        <Button
          variant="secondary"
          fullWidth
          className="auth__google"
          onClick={() => console.log('Continue with Google')}
        >
          <GoogleIcon /> Continue with Google
        </Button>

        <p className="auth__footer">
          Don’t have an account?{' '}
          <Link to="/register" className="auth__link">
            Create account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
