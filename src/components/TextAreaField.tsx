import React from "react";

interface TextAreaFieldProps {
  id: string;
  placeholder: string;
  value: string;
  label?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  id,
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
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input input-bordered w-full"
      />
    </div>
  );
};

export default TextAreaField;
