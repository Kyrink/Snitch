import React from 'react';
import { useStateContext } from '../Contexts/GlobalState';

const PrivacyScore: React.FC = () => {
    const { state } = useStateContext();
    const { privacyScore } = state;

    // Determine the color class based on the score, handling null scores safely
    const scoreClass = privacyScore !== null ? (
        privacyScore >= 75 ? 'bg-green-100 text-green-800' :
            privacyScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
    ) : 'bg-gray-100 text-gray-800'; // Default or 'N/A' style

    const displayScore = privacyScore !== null ? privacyScore : 'N/A'; // Display 'N/A' if privacyScore is null

    return (
        <div className="flex items-center mb-4">
            <span className="text-lg font-semibold">Privacy Score:</span>
            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${scoreClass}`}>
                {displayScore}
            </span>
        </div>
    );
};

export default PrivacyScore;

