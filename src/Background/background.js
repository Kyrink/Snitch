import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';


let knownTrackers = {};


async function fetchKnownTrackers() {
    const trackersCollectionRef = collection(db, 'Trackers');
    const snapshot = await getDocs(trackersCollectionRef);

    snapshot.docs.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        knownTrackers[data.domain] = {
            prevalence: data.prevalence,
            fingerprinting: data.fingerprinting,
            cookies: data.cookies,
            resourceTypes: data.resourceTypes, // Assuming this is an object
            categories: data.categories, // Assuming this is an array
            topInitiators: (data.topInitiators || []).map(initiator => ({
                domain: initiator.domain,
                prevalence: initiator.prevalence
            })),
            // Add other fields as needed
        };
    });

    console.log('Known trackers updated.');
}

fetchKnownTrackers();

// hold detected tracking requests
let privacyReport = {
    dataUsage: '',
    trackingTechniques: [],
    collectors: [],
};

async function isTracker(url) {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', ''); // Normalizing the domain

    // Construct the document reference from the 'Trackers' collection
    const trackerDocRef = doc(db, 'Trackers', domain);

    try {
        const trackerDocSnap = await getDoc(trackerDocRef);
        if (trackerDocSnap.exists()) {
            console.log(`Tracker found: ${domain}`);
            // Convert the document into a usable JavaScript object
            const trackerData = trackerDocSnap.data();
            return {
                prevalence: trackerData.prevalence,
                fingerprinting: trackerData.fingerprinting,
                // ... and other fields you need
            };
        }
    } catch (error) {
        console.error("Error querying Firestore for domain:", domain, error);
    }
    return false;
}

chrome.webRequest.onBeforeRequest.addListener(
    async (details) => {
        try {
            const url = new URL(details.url);
            const domain = url.hostname;
            const trackerInfo = await isTracker(domain);

            if (trackerInfo) {
                privacyReport.trackingTechniques.push({
                    url: details.url,
                    domain: domain,
                    ...trackerInfo, // Adjust according to how you plan to structure trackerInfo
                });
            }
        } catch (error) {
            console.error("Error processing URL:", error.message);
        }
    },
    { urls: ["<all_urls>"] }
);



// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "getPrivacyReport") {
        sendResponse(privacyReport);
    } else if (request.message === "resetPrivacyReport") {
        // Reset the report, for example, when the user navigates to a new page
        privacyReport = {
            dataUsage: '',
            trackingTechniques: [],
            collectors: [],
        };
        sendResponse({ status: 'Privacy report reset' });
    }
});

// Reset privacy report when a new page is loaded
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
        privacyReport = {
            dataUsage: '',
            trackingTechniques: [],
            collectors: [],
        };
    }
});
