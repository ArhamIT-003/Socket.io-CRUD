import "./input.css";

type InputProps = {
  type: string;
  name: string;
  placeholder: string;
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

export default function Input({
  type,
  name,
  placeholder,
  onChangeHandler,
  value,
}: InputProps) {
  return (
    <div className="input-container">
      <input
        type={type}
        className="input"
        name={name}
        placeholder={placeholder}
        onChange={onChangeHandler}
        value={value}
      />
    </div>
  );
}
