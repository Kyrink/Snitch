import React from 'react';
import { useStateContext } from '../Contexts/GlobalState';

const PrivacyTips: React.FC = () => {
    const { state } = useStateContext();
    const { privacyTips } = state;

    return (
        <div className="p-4 bg-blue-50 rounded-lg shadow">
            <h4 className="font-bold text-lg mb-3">Privacy Tips</h4>
            <ul className="list-disc list-inside">
                {privacyTips.map((tip, index) => (
                    <li key={index} className="text-sm mb-2">{tip}</li>
                ))}
            </ul>
        </div>
    );
};

export default PrivacyTips;
