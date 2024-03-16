import React from 'react';
import { useStateContext } from '../Contexts/GlobalState';

const PrivacyReport: React.FC = () => {
    const { state } = useStateContext();
    const { privacyReport } = state;

    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl mb-4 font-bold">Privacy Report</h2>
            <p className="mb-4">Here's what we found about this site's privacy practices:</p>
            <ul className="list-disc list-inside">
                <li className="mb-2">Data Usage: {privacyReport.dataUsage}</li>
                <li className="mb-2">Tracking Techniques:</li>
                {privacyReport.trackingTechniques.map((technique, index) => (
                    <li key={index} className="ml-4">{technique}</li>
                ))}
                {/* Similar mapping for collectors */}
            </ul>
        </div>
    );
};

export default PrivacyReport;
