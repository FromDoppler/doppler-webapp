import React, {useMemo, useCallback} from "react";


interface InputProps {
  value: string;
  onChange: (value: string, id: string) => void;
  id: string;
  onRemove: (id: string) => void;
  onAdd: (id: string) => void;
  placeholder?: string;
  className?: string;
  errorMessage?: string;
}

const Input = (props: InputProps) => {
  const { value, onChange, id, onRemove, placeholder, className, errorMessage } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value, id);
  };

  const handleRemove = useCallback(()=>{
    onRemove(id);
  },[id, onRemove]);

  const ButtonRemove = useMemo(()=> {
    if (className==='style_not_empty'){
      return <button type="button" onClick={handleRemove} > - </button>
    }
  },[className, handleRemove]);

  return (
    <li className={errorMessage!==''?"field-item dp-error error":"field-item"} >
         <input
            type="email"
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            className={className}
            disabled={className==='style_not_empty'?true:false}
          />
          <div className="wrapper-errors dp-message dp-error-form">
            <p>{errorMessage}</p>
          </div>
          {ButtonRemove}         
    </li>
  );
};

export default Input;