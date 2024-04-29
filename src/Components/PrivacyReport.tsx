import React from 'react';
import { useStateContext } from '../Contexts/GlobalState';

const PrivacyReport: React.FC = () => {
    const { state } = useStateContext();
    // Assuming privacyReport in your state matches the structure sent from the background script
    const { privacyReport } = state;

    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl mb-4 font-bold">Privacy Report</h2>
            {privacyReport ? (
                <>
                    <p className="mb-4">Safety Status: {privacyReport.safetyStatus}</p>
                    <p className="mb-4">Safety Confidence: {privacyReport.safetyConfidence}</p>
                    <p className="mb-4">Child Safety Confidence: {privacyReport.childSafetyConfidence}</p>
                    <div>
                        <h3 className="font-bold">Reputations:</h3>
                        <ul className="list-disc list-inside">
                            {privacyReport.reputations && privacyReport.reputations.map((rep, index) => (
                                <li key={index}>Reputation: {rep}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold">Categories:</h3>
                        <ul className="list-disc list-inside">
                            {privacyReport.categories && privacyReport.categories.map((category, index) => (
                                <li key={index}>Name: {category.name}, Confidence: {category.confidence}</li>
                            ))}
                        </ul>
                    </div>
                    {/* If there are additional data points you wish to display, add them here following the same pattern */}
                </>
            ) : (
                <p>No data available for this site.</p>
            )}
        </div>
    );
};

export default PrivacyReport;
