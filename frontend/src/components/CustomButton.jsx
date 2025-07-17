export default function CustomButton({children, onClick, className = "", disabled = false,}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-42 border-4 text-2xl px-4 py-2 rounded-lg transition-colors duration-200
            ${disabled
                ? "border-gray-500 text-gray-400 bg-gray-700 cursor-not-allowed"
                : "border-blue-500 text-cyan-400 bg-transparent hover:bg-cyan-400 hover:text-black active:bg-cyan-400 active:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            }
            ${className}
            `}
        >
            {children}
        </button>
    );
}