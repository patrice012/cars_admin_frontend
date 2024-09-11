import React, { useState, useEffect } from "react";

interface SelectableProps {
  title: string;
  selected?: string | number;
  selectedName?: string;
  items: { label: string | number; value: string | number | any }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onOpen?: () => void; // Prop to trigger data loading when the dropdown opens
}

const Selectable = ({
  title,
  items,
  onChange,
  selected,
  onOpen,
}: SelectableProps) => {
  const [isOpened, setIsOpened] = useState(false);

  const handleFocus = () => {
    if (!isOpened && onOpen) {
      onOpen(); // Load data when the dropdown is first opened
    }
  };

  return (
    <div className="form-group mb-4">
      <label htmlFor={"id"}>{title}</label>
      <select
        value={selected}
        onChange={onChange}
        onFocus={handleFocus} // Trigger data loading when the dropdown is focused
        className="select select-bordered w-full">
        <option disabled value="">
          Choose item
        </option>
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Selectable;
