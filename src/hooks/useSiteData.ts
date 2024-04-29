// src/hooks/useSiteData.ts
import { useEffect, useState } from 'react';
import { SiteData } from '../types/SiteDataTypes';

function useSiteData(): [SiteData | undefined, boolean] {
    const [siteData, setSiteData] = useState<SiteData | undefined>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const url = new URL(tabs[0].url!);
            const hostname = url.hostname;

            chrome.storage.local.get([hostname], (result) => {
                setSiteData(result[hostname]);
                setLoading(false);
            });
        });
    }, []);

    return [siteData, loading];
}

export default useSiteData;
