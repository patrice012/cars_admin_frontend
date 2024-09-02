import React from "react";

interface SelectableProps {
  title: string;
  selected?: { label: string | number; value: string | number | any };
  items: { label: string | number; value: string | number | any }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Selectable = ({ title, items, onChange, selected }: SelectableProps) => {
  return (
    <div className="form-group mb-4">
      <label htmlFor={"id"}>{title}</label>
      <select
        value={selected?.value ?? ""}
        onChange={onChange}
        className="select select-bordered w-full"
      >
        <option disabled selected={!selected}>
          Choose item
        </option>
        {items.map((item) => (
          <option selected={selected?.value == item.value} value={item.value}>
            {selected?.label ?? item.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Selectable;
