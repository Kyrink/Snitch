import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface StateContextType {
    state: StateType;
    dispatch: React.Dispatch<ActionType>;
}

// Refactored to include new data structure
export interface SiteSafetyInfo {
    safetyStatus: string;
    safetyConfidence: number;
    childSafetyConfidence: number;
    reputations: number[];
    categories: { name: string; confidence: number }[];
}

interface StateType {
    privacyScore: number | null;
    privacyAlerts: string[];
    privacyTips: string[];
    settings: {
        blockTrackers: boolean;
        blockCookies: boolean;
    };
    privacyReport: SiteSafetyInfo; // Updated to use SiteSafetyInfo
}

type ActionType =
    | { type: 'SET_PRIVACY_SCORE'; payload: number }
    | { type: 'ADD_PRIVACY_ALERT'; payload: string }
    | { type: 'SET_PRIVACY_TIPS'; payload: string[] }
    | { type: 'UPDATE_SETTINGS'; payload: { blockTrackers?: boolean; blockCookies?: boolean } }
    | { type: 'REMOVE_PRIVACY_ALERT'; payload: number }
    | { type: 'UPDATE_PRIVACY_REPORT'; payload: SiteSafetyInfo } // Updated action type to handle new structure
    | { type: 'RESET_PRIVACY_REPORT' };

const initialState: StateType = {
    privacyScore: null,
    privacyAlerts: [],
    privacyTips: [],
    settings: {
        blockTrackers: true,
        blockCookies: true,
    },
    privacyReport: {
        safetyStatus: '',
        safetyConfidence: 0,
        childSafetyConfidence: 0,
        reputations: [],
        categories: []
    }
};

const StateContext = createContext<StateContextType | undefined>(undefined);

const reducer = (state: StateType, action: ActionType): StateType => {
    // Inside your reducer function
    switch (action.type) {
        case 'SET_PRIVACY_SCORE':
            return { ...state, privacyScore: action.payload };
        // ... handle the other action types similarly
        // Existing case handlers
        case 'UPDATE_PRIVACY_REPORT':
            return { ...state, privacyReport: action.payload };
        case 'RESET_PRIVACY_REPORT':
            return { ...state, privacyReport: initialState.privacyReport };
        default:
            return state;
    }

};

export const GlobalState: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <StateContext.Provider value={{ state, dispatch }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = (): StateContextType => {
    const context = useContext(StateContext);
    if (context === undefined) {
        throw new Error('useStateContext must be used within a GlobalState');
    }
    return context;
};
