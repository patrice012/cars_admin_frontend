import React from "react";

interface SelectableProps {
  title: string;
  items: { label: string; value: string | any }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Selectable = ({ title, items, onChange }: SelectableProps) => {
  return (
    <div className="form-group mb-4">
      <span>{title}</span>
      <select onChange={onChange} className="select select-bordered w-full">
        <option disabled selected>
          Select a brand
        </option>
        {items.map((item) => (
          <option value={item.value}>{item.label}</option>
        ))}
      </select>
    </div>
  );
};

export default Selectable;
