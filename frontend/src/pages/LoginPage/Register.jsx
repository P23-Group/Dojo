import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Input,
  PasswordInput,
  Checkbox,
  UserIcon,
  MailIcon,
  ArrowRightIcon,
} from '../../components';
import AuthLayout from '../../layouts/AuthLayout/AuthLayout';
import character from '../../assets/characters/character-lvl-4.png';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

// Повертає об'єкт помилок: { поле: 'текст' }. Порожній {} = усе добре.
function validateRegister({ fullName, email, password, confirmPassword, agree }) {
  const errors = {};

  if (!fullName.trim()) errors.fullName = 'Full name is required';

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!password) errors.password = 'Password is required';

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!agree) {
    errors.agree = 'You must agree to the Terms of Service and Privacy Policy';
  }

  return errors;
}

const initialValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agree: false,
};

export default function RegisterPage() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateRegister(values);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // TODO: підключити запит до бекенду (confirmPassword і agree на сервер не відправляємо)
      const { fullName, email, password } = values;
      console.log('Register:', { fullName, email, password });
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Start your habit journey and build a better you with DOJO."
      headline={
        <>
          Build better days<span className="auth__accent">.</span>
        </>
      }
      description="Small habits. Big progress. Turn your goals into a stronger, healthier you."
      character={character}
    >
      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        <Input
          label="Full Name"
          name="fullName"
          autoComplete="name"
          placeholder="Alex Chen"
          icon={<UserIcon />}
          value={values.fullName}
          onChange={handleChange}
          error={errors.fullName}
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<MailIcon />}
          value={values.email}
          onChange={handleChange}
          error={errors.email}
        />

        <PasswordInput
          label="Password"
          name="password"
          autoComplete="new-password"
          placeholder="Create a strong password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />

        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Confirm your password"
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <Checkbox
          name="agree"
          checked={values.agree}
          onChange={handleChange}
          error={errors.agree}
          label={
            <>
              I agree to the <a href="#">Terms of Service</a> and{' '}
              <a href="#">Privacy Policy</a>
            </>
          }
        />

        <Button type="submit" fullWidth>
          Create Account <ArrowRightIcon />
        </Button>

        <p className="auth__footer">
          Already have an account?{' '}
          <Link to="/login" className="auth__link">
            Log In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
