'use client';
import { useTranslation } from 'app/i18n/client';
import React, { useState } from 'react';
import Eye from 'assets/svg/eye.svg';
import EyeOff from 'assets/svg/eye-off.svg';
import './style.scss';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hasError?: boolean;
  errorMessage?: string;
  leadingIcon?: React.ReactNode;
  helpIcon?: React.ReactNode;
}

const TextInput = (props: TextInputProps) => {
  const {
    label,
    hasError,
    errorMessage,
    leadingIcon,
    helpIcon,
    className,
    ...rest
  } = props;
  const [show, setShow] = useState(false);
  const { t } = useTranslation();
  return (
    <div
      className={`input-container ${className ?? ''}  ${
        hasError ? 'has-error' : ''
      }`}
    >
      {label != null && (
        <label className="input-label" htmlFor="">
          {t(label!)}
        </label>
      )}
      <div className="input-section">
        {props.leadingIcon && <div className="leading-icon">{leadingIcon}</div>}
        <input
          {...rest}
          value={rest.value ?? ''}
          type={props.type === 'password' && show ? 'text' : props.type}
        />
        {props.helpIcon && <div className="help-icon">{helpIcon}</div>}
        {props.type === 'password' && (
          <div
            className="help-icon cursor-pointer"
            onClick={() => setShow(!show)}
          >
            {show ? <EyeOff /> : <Eye />}
          </div>
        )}
      </div>
      {props.hasError && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default TextInput;
