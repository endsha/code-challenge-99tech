interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
}

const LoadingSpinner = ({ size = "medium" }: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: "w-5 h-5",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div
      className={`inline-flex items-center justify-center ${sizeClasses[size]}`}
    >
      <div className="w-full h-full border-3 border-white/30 border-t-white rounded-full animate-spin transition-all duration-300"></div>
    </div>
  );
};

export default LoadingSpinner;
