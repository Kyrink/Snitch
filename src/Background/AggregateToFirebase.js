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
    console.log('Retrieving JSON files from bucket...');
    const bucket = storage.bucket(bucketName);
    const [files] = await bucket.getFiles();
    console.log(`Found ${files.length} files. Processing...`);
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
        console.log(`Processing batch ${i / batchSize + 1} of ${Math.ceil(files.length / batchSize)}`);
        const batchResults = await Promise.all(batch);
        jsonFilePromises.push(...batchResults.filter(Boolean));
    }

    console.log('All files processed.');
    return jsonFilePromises;
}


// Formats the JSON data into the structure you want in Firestore
function formatDataForFirestore(jsonData) {
    // Example of trimming long string fields
    const trimmedSubdomains = jsonData.subdomains?.length > 100 ? jsonData.subdomains.slice(0, 100) : jsonData.subdomains;

    // Example of limiting array lengths
    const topInitiators = jsonData.topInitiators?.slice(0, 10).map(initiator => ({
        domain: initiator.domain,
        prevalence: initiator.prevalence
    })) ?? [];

    const resources = jsonData.resources?.slice(0, 50).map(resource => ({
        rule: resource.rule,
        type: resource.type,
        prevalence: resource.prevalence,
        fingerprinting: resource.fingerprinting
    })) ?? [];

    return {
        domain: jsonData.domain,
        prevalence: jsonData.prevalence,
        fingerprinting: jsonData.fingerprinting,
        cookies: jsonData.cookies,
        resourceTypes: jsonData.types,
        categories: jsonData.categories || [],
        subdomains: trimmedSubdomains,
        nameservers: jsonData.nameservers,
        topInitiators: topInitiators,
        resources: resources
    };
}



// Uploads the formatted data to Firestore
async function uploadDataToFirestore(formattedData) {
    console.log('Uploading data to Firestore...');
    const trackersCollectionRef = db.collection('Trackers');
    let count = 0;

    for (const [domain, trackerData] of Object.entries(formattedData)) {
        await trackersCollectionRef.doc(domain).set(trackerData);
        count++;
    }

    console.log(`Uploaded ${count} documents to Firestore.`);
}

async function aggregateData() {
    console.log('Starting data aggregation...');
    const jsonFiles = await getJsonFiles();
    const formattedData = {};

    console.log('Formatting data for Firestore...');
    for (const jsonData of jsonFiles) {
        if (jsonData.domain) { // Ensuring jsonData has a domain property before proceeding
            formattedData[jsonData.domain] = formatDataForFirestore(jsonData);
        }
    }

    console.log('Data formatted. Beginning upload to Firestore...');
    await uploadDataToFirestore(formattedData);
    console.log('Data aggregation complete.');
}

aggregateData()
    .then(() => console.log('Script completed successfully.'))
    .catch(error => console.error('An error occurred:', error));
