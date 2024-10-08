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
      <span>{label}</span>
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input input-bordered w-full py-[7px]"
      />
    </div>
  );
};

export default TextAreaField;
