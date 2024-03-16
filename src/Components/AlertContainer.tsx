import React from 'react';
import PrivacyAlertPopup from './PrivacyAlertPopup';
import { useStateContext } from '../Contexts/GlobalState';

const AlertsContainer: React.FC = () => {
    const { state, dispatch } = useStateContext();

    const handleDismiss = (index: number) => {
        // Example of how you might handle dismissal
        dispatch({
            type: 'REMOVE_PRIVACY_ALERT',
            payload: index
        });
    };

    return (
        <>
            {state.privacyAlerts.map((message, index) => (
                <PrivacyAlertPopup
                    key={index}
                    message={message}
                    onDismiss={() => handleDismiss(index)}
                />
            ))}
        </>
    );
};
export default AlertsContainer;
