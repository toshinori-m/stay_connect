import { useId } from "react"

interface RadioOption {
  title: string;
  value: string;
}

interface RadioGroupFieldProps {
  name: string;
  options: RadioOption[];
  selected: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
}

export default function RadioGroupField({
  name, options, selected, onChange, title
}: RadioGroupFieldProps) {
  const id = useId()

  return (
    <div className="w-full md:flex md:px-8 items-center">
      <label
        htmlFor={id}
        className="w-40 md:-ml-3 pl-2 tracking-tighter text-sm"
      >
        {title}
      </label>
      <div className="w-full ml-1">
        {options.map((option) => (
            <label key={option.value} className="w-full py-3 px-3 my-2 mx-1">
              <input
                id={id}
                type="radio"
                name={name}
                value={option.value}
                checked={selected === option.value}
                onChange={onChange}
                className="mr-1"
              />
              {option.title}
            </label>
        ))}
      </div>
    </div>
  )
}
