import { useToast } from "../contexts/ToastContext";
import Toast from "./Toast";

const ToastContainer = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div className="flex flex-col space-y-2 pointer-events-auto">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className="transform transition-all duration-300 ease-in-out"
            style={{
              zIndex: 1000 - index, // Higher z-index for newer toasts
            }}
          >
            <Toast toast={toast} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
