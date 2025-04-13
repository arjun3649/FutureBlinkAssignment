import ReactDOM from 'react-dom';

const PortalModal = ({ isOpen, children, onClose }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-2">
      <div className="relative w-full max-w-md md:max-w-lg mx-auto bg-white p-4 md:p-6 rounded-2xl shadow-lg overflow-y-auto max-h-[90vh]">
        {/* Close Cross */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-xl text-gray-500 hover:text-red-500"
        >
          &times;
        </button>

        {children}
      </div>
    </div>,
    document.body
  );
};

export default PortalModal;
