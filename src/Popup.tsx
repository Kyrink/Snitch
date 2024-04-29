// Popup.tsx
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { GlobalState, useStateContext, SiteSafetyInfo } from './Contexts/GlobalState';
import PrivacyReport from './Components/PrivacyReport';
import PrivacyScore from './Components/PrivacyScore';
import PrivacyTips from './Components/PrivacyTips';
import SettingsDashboard from './Components/SettingsDashboard';
import './App.css';

// Define a type for the message you expect to receive
interface PrivacyReportMessage {
    action: 'UPDATE_PRIVACY_REPORT';
    data: SiteSafetyInfo;
}

const Popup: React.FC = () => {
    const { dispatch } = useStateContext();

    useEffect(() => {
        const handleMessages = (message, sender, sendResponse) => {
            if (message.action === "UPDATE_PRIVACY_REPORT") {
                dispatch({
                    type: 'UPDATE_PRIVACY_REPORT',
                    payload: message.data
                });
            }
        };
    
        chrome.runtime.onMessage.addListener(handleMessages);
    
        return () => {
            chrome.runtime.onMessage.removeListener(handleMessages);
        };
    }, [dispatch]);
    

    return (
        <GlobalState>
            <div className="p-4 bg-white rounded-lg shadow-xl max-w-md">
                <PrivacyScore />
                <PrivacyReport />
                <PrivacyTips />
                <SettingsDashboard />
            </div>
        </GlobalState>
    );
};

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.render(<Popup />, rootElement);
}
