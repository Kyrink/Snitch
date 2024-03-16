import React from 'react';
import { useStateContext } from '../Contexts/GlobalState';

// each setting is represented as an object with 'name' and 'value'
interface Setting {
    name: string;
    value: boolean;
}

const SettingsDashboard: React.FC = () => {
    const { state, dispatch } = useStateContext();
    const settingsArray: Setting[] = Object.entries(state.settings).map(([name, value]) => ({
        name,
        value
    }));

    const onSave = (name: string, newValue: boolean) => {
        dispatch({
            type: 'UPDATE_SETTINGS',
            payload: { [name]: newValue },
        });
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Privacy Settings</h3>
            {settingsArray.map((setting, index) => (
                <div key={index} className="mb-4">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            className="form-checkbox text-indigo-600"
                            checked={setting.value}
                            onChange={() => onSave(setting.name, !setting.value)}
                        />
                        <span className="ml-2">{setting.name}</span>
                    </label>
                </div>
            ))}
        </div>
    );
};

export default SettingsDashboard;
