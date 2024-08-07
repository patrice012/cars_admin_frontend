import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: (e: any) => void;
}

const Button: React.FC<ButtonProps> = ({ children, disabled, onClick }) => {
  return (
    <button
      disabled={disabled}
      className="btn btn-primary w-full"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
