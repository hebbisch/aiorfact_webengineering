export default function PageWrapper({ children }) {
    return (
        <div className="relative min-h-screen flex flex-col items-center p-6 text-white">
            {children}
        </div>
    );
}