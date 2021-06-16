import React from "react";


interface InputProps {
  value: string;
  onChange: (value: string, id: string) => void;
  id: string;
  onRemove: (id: string) => void;
  placeholder?: string;
}

const Input = (props: InputProps) => {
  const { value, onChange, id, onRemove, placeholder } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debugger;
    onChange(event.target.value, id);
  };

  const handleRemove = () => {
    onRemove(id);
  };

  return (
    <div>
      <input
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
      <button type="button" onClick={handleRemove}>
        -
      </button>
    </div>
  );
};

export default Input;