import PageWrapper from "../components/PageWrapper.jsx";
import CustomButton from "../components/CustomButton";
import { useNavigate } from "react-router-dom";

export default function Impressum() {
    const navigate = useNavigate();

    const donationGoal = 50;
    const currentDonations = 32; // Replace with dynamic data later if needed
    const progressPercent = Math.min((currentDonations / donationGoal) * 100, 100); 


    return (
        <PageWrapper>
            <h1 className="text-2xl font-bold mb-4">Impressum</h1>
            <p>
                Angaben gemäß § 5 TMG
                <br />
                Frisabebba Games
                <br />
                Gänsbergring 23
                <br />
                71083 Herrenberg
            </p>

            <p className="mt-4">
                Kontakt:
                <br />
                E-Mail: info@aiorfact.fun
            </p>
		
	    <div className="w-full max-w-md mt-8 bg-gray-800 p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">🎯 Unterstütze dieses Projekt</h2>
                <div className="w-full bg-gray-600 rounded-full h-5 mb-2">
                    <div
                        className="bg-green-400 h-5 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <p className="text-sm mb-4">
                    {currentDonations} € von {donationGoal} € gesammelt
                </p>
                <a
                    href="https://www.paypal.me/HebbaDiab" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition"
                >
                    Klicke hier, um freiwillig die Weiterentwicklung des Projekts zu unterstützen. (Es handelt sich nicht um eine steuerlich absetzbare Spende.)
                </a>
            </div>

           <div className="mt-8">
	        <CustomButton onClick={() => navigate("/")}>
   		 Zur Startseite
 	        </CustomButton>
	   </div>

        </PageWrapper>
    );
}
