import ReactSelect from 'react-select';
import { SelectOption } from '../utils/types';

interface SelectProps {
  label?: string;
  value: string | null;
  options: SelectOption[];
  onChange: (value: string) => void;
}

export default function Select({
  label,
  value,
  onChange,
  options,
}: SelectProps) {
  const selectedOption =
    options.find((option) => option.value === value) || null;
  return (
    <>
      <label>{label}</label>
      <ReactSelect
        value={selectedOption}
        onChange={(e) => onChange(e?.value || '')}
        options={options}
        className="w-24"
      />
    </>
  );
}
