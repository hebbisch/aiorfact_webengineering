import PageWrapper from "../components/PageWrapper.jsx";

export default function Impressum() {
    return (
        <PageWrapper>
            <h1 className="text-2xl font-bold mb-4">Impressum</h1>
            <p>
                Angaben gemäß § 5 TMG
                <br />
                Frisabebba Games
                <br />
                Beispielstraße 123
                <br />
                12345 Musterstadt
            </p>

            <p className="mt-4">
                Kontakt:
                <br />
                E-Mail: info@frisabebba.games
            </p>

            {/* Add whatever is legally necessary here for your jurisdiction */}
        </PageWrapper>
    );
}