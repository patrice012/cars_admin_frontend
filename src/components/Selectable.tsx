import React, { useState } from "react";

interface SelectableProps {
  title: string;
  selected?: string | number;
  items: { label: string | number; value: string | number | any }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onOpen?: () => void; // Add the onOpen prop
}

const Selectable = ({
  title,
  items,
  onChange,
  selected,
  onOpen,
}: SelectableProps) => {
  const [click, setClick] = useState(false);
  const handleClick = () => {};
  return (
    <div className="form-group mb-4">
      <label htmlFor={"id"}>{title}</label>
      <select
        value={selected}
        onChange={onChange}
        onFocus={onOpen} // Trigger onOpen when the dropdown is focused
        className="select select-bordered w-full">
        <option disabled selected={!selected}>
          Choose item
        </option>
        {items.map((item) => (
          <option
            key={item.value}
            selected={selected === item.value}
            value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Selectable;
