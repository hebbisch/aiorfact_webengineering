import { Link } from "react-router-dom";
export default function PageWrapper({ children }) {
    return (
        <div className="relative min-h-screen flex flex-col items-center p-6 text-white">
            <div className="flex-grow w-full flex flex-col items-center">
                {children}
            </div>
            <footer className="w-full text-center text-sm text-gray-400 mt-12 border-t border-gray-600 pt-4">
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