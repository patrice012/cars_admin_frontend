import React from "react";

interface SelectableProps {
  title: string;
  selected?: { label: string; value: string | any };
  items: { label: string; value: string | any }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Selectable = ({ title, items, onChange, selected }: SelectableProps) => {
  return (
    <div className="form-group mb-4">
      <label className="label" htmlFor={"id"}>
        {title}
      </label>
      <select
        value={selected?.value ?? ""}
        onChange={onChange}
        className="select select-bordered w-full"
      >
        <option disabled selected={!selected}>
          Select a brand
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
