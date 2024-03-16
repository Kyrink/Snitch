// Popup.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { GlobalState } from './Contexts/GlobalState';
import PrivacyAlertPopup from './Components/PrivacyAlertPopup';
import PrivacyReport from './Components/PrivacyReport';
import PrivacyScore from './Components/PrivacyScore';
import PrivacyTips from './Components/PrivacyTips';
import SettingsDashboard from './Components/SettingsDashboard';
import './App.css';

const Popup: React.FC = () => {
    return (
        <GlobalState>
            <div className="p-4 bg-white rounded-lg shadow-xl max-w-sm">
                {/* Render Privacy Score */}
                <PrivacyScore />

                {/* Render Privacy Alerts */}
                {/* Assuming PrivacyAlertPopup can handle an array of messages */}
                <PrivacyAlertPopup message="Example message" onDismiss={() => console.log('Dismissed')} />

                {/* Render Privacy Report */}
                <PrivacyReport />

                {/* Render Privacy Tips */}
                <PrivacyTips />

                {/* Render Settings Dashboard */}
                <SettingsDashboard />
            </div>
        </GlobalState>
    );
};

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.render(<Popup />, rootElement);
}
