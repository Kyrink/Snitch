const { Storage } = require('@google-cloud/storage');
const admin = require('firebase-admin');
const serviceAccount = require('/Users/kyrinkalonji/Snitch_Privacy/Snitch/snitch1-b3eff3a32d29.json');

// Initialize Firebase Admin with your service account
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Initialize Google Cloud Storage
const storage = new Storage();
const bucketName = 'snitch-domain-data';

async function getJsonFiles() {
    const bucket = storage.bucket(bucketName);
    const [files] = await bucket.getFiles();
    const batchSize = 2000; // Adjust batch size as needed
    const jsonFilePromises = [];

    for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize).map(file => {
            if (file.name.endsWith('.json')) {
                return file.download().then(data => {
                    // Check if data is already an object
                    try {
                        return JSON.parse(data.toString());
                    } catch {
                        // Data is already parsed or not valid JSON
                        return data;
                    }
                });
            }
        });
        // Wait for the current batch to finish before starting the next one
        const batchResults = await Promise.all(batch);
        jsonFilePromises.push(...batchResults.filter(Boolean));
    }

    return jsonFilePromises;
}


// Formats the JSON data into the structure you want in Firestore
function formatDataForFirestore(jsonData) {
    // Adapt this function to transform your JSON data into the desired Firestore format.
    // This is a simplistic transformation and should be replaced with your specific needs.
    return {
        domain: jsonData.domain,
        prevalence: jsonData.prevalence,
        fingerprinting: jsonData.fingerprinting,
        cookies: jsonData.cookies,
        resourceTypes: jsonData.types,
        categories: jsonData.categories || [],
        subdomains: jsonData.subdomains,
        nameservers: jsonData.nameservers,
        topInitiators: jsonData.topInitiators.map(initiator => ({
            domain: initiator.domain,
            prevalence: initiator.prevalence
        })),
        resources: jsonData.resources.map(resource => ({
            rule: resource.rule,
            type: resource.type,
            prevalence: resource.prevalence,
            fingerprinting: resource.fingerprinting
        }))
        // Add other fields as needed...
    };
}

// Uploads the formatted data to Firestore
async function uploadDataToFirestore(formattedData) {
    const trackersCollectionRef = db.collection('trackers');

    for (const [domain, trackerData] of Object.entries(formattedData)) {
        await trackersCollectionRef.doc(domain).set(trackerData);
    }
}

async function aggregateData() {
    const jsonFiles = await getJsonFiles();
    const formattedData = {};

    for (const jsonData of jsonFiles) {
        formattedData[jsonData.domain] = formatDataForFirestore(jsonData);
    }

    await uploadDataToFirestore(formattedData);
}

aggregateData()
    .then(() => console.log('Data aggregation complete.'))
    .catch(error => console.error('An error occurred:', error));
