// Import the Google Cloud client library
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');

// Creates a client from a Google service account key
const storage = new Storage({ keyFilename: '/Users/kyrinkalonji/Snitch_Privacy/Snitch/snitch1-4c4b87041f8e.json' });
const bucketName = 'snitch-domain-data';

async function uploadMissingFiles(localDir, gcsDir) {
    gcsDir = gcsDir.endsWith('/') ? gcsDir : gcsDir + '/';

    const [files] = await storage.bucket(bucketName).getFiles({ prefix: gcsDir });
    const gcsFileNames = files.map(file => file.name);

    const localFiles = fs.readdirSync(localDir);

    let uploadedCount = 0; // Keep track of successfully uploaded files

    for (const fileName of localFiles) {
        const localFilePath = path.join(localDir, fileName);
        const gcsFilePath = gcsDir + fileName;

        if (!gcsFileNames.includes(gcsFilePath)) {
            try {
                // Call your retry method here
                await uploadFileWithRetry(localFilePath, gcsFilePath);
                uploadedCount++;
            } catch (error) {
                console.error(`Failed to upload ${fileName}:`, error);
            }
        } else {
            console.log(`${fileName} already exists in GCS directory`);
        }
    }

    return uploadedCount; // Return the count of successfully uploaded files
}

async function uploadFileWithRetry(localFilePath, gcsFilePath, maxRetries = 5) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await storage.bucket(bucketName).upload(localFilePath, {
                destination: gcsFilePath,
            });
            console.log(`${localFilePath} uploaded to ${gcsFilePath}`);
            return;
        } catch (error) {
            const isLastAttempt = attempt === maxRetries;
            if (isLastAttempt) throw error;
            const waitTime = Math.pow(2, attempt) * 1000; // exponential backoff
            console.log(`Attempt ${attempt} failed, retrying in ${waitTime}ms...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
}


async function main() {
    const localBaseDirectory = '/Users/kyrinkalonji/Desktop/tracker-radar/domains';
    const countries = fs.readdirSync(localBaseDirectory);
    const countryDirectories = countries.filter(country => fs.statSync(path.join(localBaseDirectory, country)).isDirectory());

    let totalUploaded = 0; // Total count for all directories
    const uploadSummary = {}; // Object to hold the count of uploads per directory

    for (const country of countryDirectories) {
        const localCountryPath = path.join(localBaseDirectory, country);
        const gcsCountryPath = country; // The country code itself is the directory in GCS
        const uploadedCount = await uploadMissingFiles(localCountryPath, gcsCountryPath);
        totalUploaded += uploadedCount;
        uploadSummary[country] = uploadedCount; // Keep track of uploads per directory
    }

    console.log(`Finished checking and uploading files. Process completed successfully.`);
    console.log(`Total files uploaded: ${totalUploaded}`);
    console.log('Files uploaded per directory:', uploadSummary);
}

main().catch(console.error);
