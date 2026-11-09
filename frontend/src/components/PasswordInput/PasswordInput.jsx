import { useState } from 'react';
import Input from '../Input/Input';
import { LockIcon, EyeIcon, EyeOffIcon } from '../icons';
import './PasswordInput.css';

export default function PasswordInput({ icon = <LockIcon />, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      {...props}
      icon={icon}
      type={visible ? 'text' : 'password'}
      endAdornment={
        <button
          type="button"
          className="password-toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
        >
          {visible ? <EyeIcon /> : <EyeOffIcon />}
        </button>
      }
    />
  );
}
