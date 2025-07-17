import { Link } from "react-router-dom";

export default function PageWrapper({ children, className = "" }) {
    return (
        <div className={`min-h-screen flex flex-col items-center justify-between p-4 text-white ${className}`}>
            <div className="flex-grow w-full flex flex-col items-center justify-center overflow-auto">
                {children}
            </div>
            <footer className="w-full text-center text-sm text-gray-400 border-t border-gray-600 pt-2">
                <p>
                    © 2025 by Frisabebba Games —{" "}
                    <Link to="/impressum" className="underline hover:text-white">
                        Impressum
                    </Link>
                </p>
            </footer>
        </div>
    );
}