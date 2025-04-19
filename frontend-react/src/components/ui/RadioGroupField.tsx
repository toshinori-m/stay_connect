interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupFieldProps {
  name: string;
  options: RadioOption[];
  selected: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

export default function RadioGroupField({
  name, options, selected, onChange, label
}: RadioGroupFieldProps) {
  return (
    <div className="w-full md:flex md:px-8 items-center">
      <label className="w-40 md:-ml-3 pl-2 pb-3 md:pb-0 tracking-tighter text-sm">{label}</label>
      <div className="w-full ml-1">
        {options.map((option) => (
            <label key={option.value} className="w-full py-3 px-3 my-2 mx-1">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected === option.value}
                onChange={onChange}
                className="mr-1"
              />
              {option.label}
            </label>
        ))}
      </div>
    </div>
  )
}
