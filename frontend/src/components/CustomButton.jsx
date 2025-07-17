export default function CustomButton({ children, onClick, className = "" }) {
    return (
        <button
            onClick={onClick}
            className={`w-42 border-4 border-blue-500 text-cyan-400 text-2xl px-4 py-2 hover:bg-cyan-400 hover:text-black transition-colors duration-200 rounded-lg ${className}`}
        >
            {children}
        </button>
    );
}