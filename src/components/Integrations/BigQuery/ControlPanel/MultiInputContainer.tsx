import React, { useEffect, useState, useCallback } from 'react';
import { useIntl } from 'react-intl';
import Input from './Input';

type InputConfig = {
  value: string;
  id: string;
  className?: string;
  errorMessage?: string;
};

const uniqueId = function (name: String) {
  return (
    name +
    '-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    })
  );
};

const emptyInput = (): InputConfig => ({
  id: uniqueId('input'),
  value: '',
  className: 'style_empty',
  errorMessage: '',
});

const generateInputConfig = (values: string[]): InputConfig[] => {
  return values.map((value) => {
    return {
      id: uniqueId('input'),
      value,
      className: value !== '' ? 'style_not_empty' : 'style_empty',
    };
  });
};

interface MultiInputProps {
  values?: string[];
  onChange: (newValues: string[]) => void;
  onRemove: (btn: string) => void;
  onAdd: (btn: string) => void;
}

const MultiInput = (props: MultiInputProps) => {
  const intl = useIntl();
  const i18 = useCallback(
    (id: string, values?: any) => {
      return intl.formatMessage({ id: id }, values);
    },
    [intl],
  );

  const { values, onChange, onRemove, onAdd } = props;
  const [inputConfigs, setInputConfigs] = useState<InputConfig[]>([]);

  useEffect(() => {
    if (inputConfigs.length) return;

    let initialInputs: InputConfig[];
    if (!values || !values.length) {
      initialInputs = [emptyInput()];
    } else {
      initialInputs = generateInputConfig(values);
    }

    setInputConfigs(initialInputs);
  }, [values, inputConfigs]);

  const handleChange = (value: string, id: string) => {
    const newValues: string[] = [];
    const newInputs = inputConfigs?.map((input) => {
      newValues.push(input.value);
      if (input.id !== id) return input;
      return { ...input, value };
    });

    onChange(newValues);
    setInputConfigs(newInputs);
  };

  const handleRemove = (id: string) => {
    const newInputs = inputConfigs?.filter((input) => input.id !== id);
    setInputConfigs(newInputs);
    onRemove('-');
  };

  const handleAdd = () => {
    let hasError = false;
    const newInputs = inputConfigs?.map((input) => {
      if (input.value === '') {
        input.errorMessage = i18('big_query.plus_error_message_empty');
        hasError = true;
      } else if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(input.value)) {
        input.errorMessage = i18('big_query.plus_error_message_not_email');
        hasError = true;
      } else {
        input.className = 'style_not_empty';
        input.errorMessage = '';
      }

      return input;
    });

    if (hasError) {
      setInputConfigs([...newInputs]);
    } else {
      setInputConfigs([emptyInput(), ...newInputs]);
      onAdd('+');
    }
  };

  const renderInput = (input: InputConfig) => {
    return (
      <Input
        key={input.id}
        value={input.value}
        id={input.id}
        onChange={handleChange}
        onRemove={handleRemove}
        onAdd={handleAdd}
        placeholder={i18('big_query.plus_input_place_holder', '')}
        className={input.className}
        errorMessage={input.errorMessage}
      />
    );
  };

  return (
    <div>
      <div>
        <button type="button" onClick={handleAdd}>
          {' '}
          +{' '}
        </button>
      </div>
      {inputConfigs?.map(renderInput)}
    </div>
  );
};

export default MultiInput;
