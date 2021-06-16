import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import Input from './Input';

type InputConfig = {
  value: string;
  id: string;
};

const uniqueId = function (name: String) {
  return (
    name +
    '-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    })
  );
};

const emptyInput = (): InputConfig => ({
  id: uniqueId('input'),
  value: '',
});

const generateInputConfig = (values: string[]): InputConfig[] => {
  return values.map((value) => {
    return {
      id: uniqueId('input'),
      value,
    };
  });
};

interface MultiInputProps {
  values?: string[];
  onChange: (newValues: string[]) => void;
}

const MultiInput = (props: MultiInputProps) => {
  const { values, onChange } = props;
  const [inputConfigs, setInputConfigs] = useState<InputConfig[]>([]);

  const intl = useIntl();
  const _ = (id: string, values: any) => intl.formatMessage({ id: id }, values);

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
      debugger;
    const newInputs = inputConfigs?.filter((input) => input.id !== id);

    setInputConfigs(newInputs);
  };

  const handleAdd = () => {
    setInputConfigs([...inputConfigs, emptyInput()]);
  };

  const renderInput = (input: InputConfig) => {
    return (
      <Input
        key={input.id}
        value={input.value}
        id={input.id}
        onChange={handleChange}
        onRemove={handleRemove}
        placeholder={_('big_query.plus_input_place_holder', '')}
      />
    );
  };

  return (
    <div>
      <div>
        <button type="button" onClick={handleAdd}>
          +
        </button>
      </div>
      {inputConfigs?.map(renderInput)}
    </div>
  );
};

export default MultiInput;
