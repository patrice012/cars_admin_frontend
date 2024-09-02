import React from "react";

interface InputFieldProps {
  id: string;
  type: string;
  placeholder: string;
  label?: string;
  value: any ;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  type,
  placeholder,
  value,
  label,
  onChange,
  required,
}) => {
  return (
    <div className="form-group mb-4">
      <div className="flex items-center">
        <span>{label} </span>
        {required && <span className="text-red-600 text-[22px]">*</span>}
      </div>
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
