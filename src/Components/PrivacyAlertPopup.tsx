import { FaRegBell } from 'react-icons/fa'; // FontAwesome
import { IoMdClose } from 'react-icons/io'; // Ionicons

interface PrivacyAlertPopupProps {
    message: string;
    onDismiss: () => void;
}

const PrivacyAlertPopup: React.FC<PrivacyAlertPopupProps> = ({ message, onDismiss }) => {
    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center" role="alert">
            <FaRegBell className="mr-3" />
            <strong className="font-bold">Warning!</strong>
            <span className="block sm:inline ml-2">{message}</span>
            <button onClick={onDismiss} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <IoMdClose className="fill-current h-6 w-6 text-red-500" />
            </button>
        </div>
    );
};
export default PrivacyAlertPopup;