import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface StateContextType {
    state: StateType;
    dispatch: React.Dispatch<ActionType>;
}

interface StateType {
    privacyScore: number | null;
    privacyAlerts: string[];
    privacyTips: string[];
    settings: {
        blockTrackers: boolean;
        blockCookies: boolean;
    };
    privacyReport: {
        trackingTechniques: string[];
        dataUsage: string;
        collectors: string[];
    };
}

type ActionType =
    | { type: 'SET_PRIVACY_SCORE'; payload: number }
    | { type: 'ADD_PRIVACY_ALERT'; payload: string }
    | { type: 'SET_PRIVACY_TIPS'; payload: string[] }
    | { type: 'UPDATE_SETTINGS'; payload: { blockTrackers?: boolean; blockCookies?: boolean } }
    | { type: 'REMOVE_PRIVACY_ALERT'; payload: number };


const initialState: StateType = {
    privacyScore: null,
    privacyAlerts: [],
    privacyTips: [],
    settings: {
        blockTrackers: true,
        blockCookies: true,
    },
    privacyReport: {
        trackingTechniques: [],
        dataUsage: '',
        collectors: []
    }
};

const StateContext = createContext<StateContextType | undefined>(undefined);

const reducer = (state: StateType, action: ActionType): StateType => {
    switch (action.type) {
        case 'SET_PRIVACY_SCORE':
            return { ...state, privacyScore: action.payload };
        case 'ADD_PRIVACY_ALERT':
            return { ...state, privacyAlerts: [...state.privacyAlerts, action.payload] };
        case 'SET_PRIVACY_TIPS':
            return { ...state, privacyTips: action.payload };
        case 'UPDATE_SETTINGS':
            return { ...state, settings: { ...state.settings, ...action.payload } };
        case 'REMOVE_PRIVACY_ALERT':
            const updatedAlerts = state.privacyAlerts.filter((_, index) => index !== action.payload);
            return { ...state, privacyAlerts: updatedAlerts };
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
