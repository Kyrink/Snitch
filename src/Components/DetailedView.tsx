import { SiteData } from '../types/SiteDataTypes';
import { useState } from 'react';

interface DetailedViewProps {
    siteData: SiteData;
}

const DetailedView: React.FC<DetailedViewProps> = ({ siteData }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div>
            <button onClick={() => setExpanded(!expanded)}>Details</button>
            {expanded && (
                <div>
                    {/* Example detail: Categories */}
                    <h3>Categories</h3>
                    {siteData.categories.map((category, index) => (
                        <p key={index}>{`${category.name} (Confidence: ${category.confidence})`}</p>
                    ))}
                    {/* Include other details similarly */}
                </div>
            )}
        </div>
    );
};

export default DetailedView;
