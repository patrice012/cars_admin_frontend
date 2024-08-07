import React from "react";

interface InputFieldProps {
  id: string;
  type: string;
  placeholder: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  type,
  placeholder,
  value,
  label,
  onChange,
}) => {
  return (
    <div className="form-group mb-4">
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input input-bordered w-full"
      />
    </div>
  );
};

export default InputField;
