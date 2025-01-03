import React from 'react';

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  isVisible: boolean;
  toggleVisibility: () => void;
  name: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder,
  isVisible,
  name,
}) => {
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={isVisible ? 'text' : 'password'}
        name={name}
        onChange={onChange}
        value={value || ''}
        placeholder={placeholder}
      />
    </div>
  );
};

export default PasswordInput;
