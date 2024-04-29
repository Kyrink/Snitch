const userId = '8986619'; // Replace with your actual WOT User ID
const apiKey = '814448b67590c365aee1302e68b7fbf52588b1eb';

console.log('Background script has been loaded.');

function fetchAndProcessData(urlToCheck) {
    fetch(`https://scorecard.api.mywot.com/v3/targets?t=${urlToCheck}`, {
        method: 'GET',
        headers: {
            'x-user-id': userId,
            'x-api-key': apiKey
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const processedData = data.map(siteData => ({
                target: siteData.target,
                safetyStatus: siteData.safety?.status,
                safetyReputation: siteData.safety?.reputation,
                safetyConfidence: siteData.safety?.confidence,
                childSafetyReputation: siteData.childSafety?.reputation,
                childSafetyConfidence: siteData.childSafety?.confidence,
                categories: siteData.categories?.map(category => ({
                    id: category.id,
                    name: category.name,
                    confidence: category.confidence
                })) || [],
                blackList: siteData.blackList || []
            }));

            // Store the processed data in local storage
            chrome.storage.local.set({ [urlToCheck]: processedData }, () => {
                console.log(`Data stored for ${urlToCheck}`);
            });
            // Send the processed data to the popup or content script
            chrome.runtime.sendMessage({ action: "UPDATE_PRIVACY_REPORT", data: processedData });
        })
        .catch(error => {
            console.error('WOT API Error:', error);
        });
}

// Listener for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Check that the tab's URL is valid and is not an internal chrome page
    if (changeInfo.status === 'complete' && tab.active && tab.url && /^(https?:\/\/)/.test(tab.url)) {
        const urlToCheck = new URL(tab.url).hostname;
        fetchAndProcessData(urlToCheck);
    }
});

// Listener for the active tab when the extension is first loaded
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].url && /^(https?:\/\/)/.test(tabs[0].url)) {
        const urlToCheck = new URL(tabs[0].url).hostname;
        fetchAndProcessData(urlToCheck);
    }
});

