interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  type?: React.HTMLInputTypeAttribute;
}

export default function TextInput({ label, name, type, ...rest }: InputProps) {
  return (
    <div className={"flex flex-col"}>
      <label className="p-2 text-sm" htmlFor={name}>
        {label}
      </label>
      <input
        className="rounded bg-primary p-2 text-neutral"
        type={type || "text"}
        name={name}
        {...rest}
      />
    </div>
  );
}
