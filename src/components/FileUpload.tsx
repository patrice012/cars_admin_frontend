import React from "react";

interface FileUploadProps {
  id: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ id, label, onChange }) => {
  return (
    <div className="form-group mb-4">
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <input
        type="file"
        id={id}
        onChange={onChange}
        className="file-input file-input-bordered w-full"
        multiple
      />
    </div>
  );
};

export default FileUpload;
