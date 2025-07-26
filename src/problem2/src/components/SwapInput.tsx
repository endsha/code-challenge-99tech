interface SwapInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  error?: string;
}

const SwapInput = ({
  id,
  value,
  onChange,
  placeholder = "0.00",
  readOnly = false,
}: SwapInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty string
    if (inputValue === "") {
      onChange("");
      return;
    }

    // Allow only numbers and one decimal point
    const regex = /^\d*\.?\d*$/;
    if (regex.test(inputValue)) {
      onChange(inputValue);
    }
  };

  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`flex-1 bg-transparent text-3xl font-bold outline-none placeholder:text-black/40 transition-all duration-300 ease-in-out p-5 h-full ${
        readOnly ? "cursor-not-allowed text-black/50" : "text-black"
      }`}
    />
  );
};

export default SwapInput;
