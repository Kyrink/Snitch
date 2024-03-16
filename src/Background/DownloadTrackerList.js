import fetch from 'node-fetch';
import { Storage } from '@google-cloud/storage';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const dotenv = require('dotenv');
dotenv.config();


const storage = new Storage();
const bucketName = 'snitch-domain-data';
const githubApiBaseUrl = 'https://api.github.com/repos/duckduckgo/tracker-radar/contents';

const fetchGitHubContent = async (url, results = []) => {
    const response = await fetch(url, {
        headers: {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const data = await response.json();
    results.push(...data);

    // Check for the Link header and find the URL for the next page
    const linkHeader = response.headers.get('link');
    const nextLink = linkHeader ? linkHeader.split(',').find(s => s.includes('rel="next"')) : null;
    console.log(`Link header: ${linkHeader}`); // Log the entire Link header
    if (nextLink) {
        const nextUrl = nextUrlMatch[1];
        console.log(`Found next page, fetching: ${nextUrl}`); // Log the URL of the next page before fetching
        await fetchGitHubContent(nextUrl, results);
    }


    return results;
}

async function uploadFileToGCS(content, filePath) {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filePath);
    await file.save(content);
    console.log(`${filePath} uploaded to ${bucketName}.`);
}

async function processGitHubItem(item, pathPrefix = '') {
    const fullPath = `${pathPrefix}${item.name}`;
    let fileCount = 0; // Initialize a counter for files in the current directory

    if (item.type === 'file' && item.download_url) {
        console.log(`Processing file: ${fullPath}`);
        try {
            const contentResponse = await fetch(item.download_url);
            if (!contentResponse.ok) {
                throw new Error(`Failed to fetch file content from ${item.download_url}: ${contentResponse.statusText}`);
            }
            const content = await contentResponse.text(); // Assuming the content is text
            await retryOperation(() => uploadFileToGCS(content, fullPath), 5);
            fileCount = 1;
        } catch (error) {
            console.error(`Error processing file: ${fullPath}`, error);
        }

    } else if (item.type === 'dir') {
        console.log(`Entering directory: ${fullPath}`);
        const dirContents = await fetchGitHubContent(item.url);
        for (const contentItem of dirContents) {
            const countFromSubDir = await processGitHubItem(contentItem, `${fullPath}/`);
            fileCount += countFromSubDir; // Accumulate file counts from subdirectories
        }
        console.log(`Directory ${fullPath} contains ${fileCount} files.`);
    }

    return fileCount; // Return the count of files processed in this directory or subdirectory
}


async function retryOperation(operation, attempts = 5) {
    for (let i = 0; i < attempts; i++) {
        try {
            return await operation(); // Attempt the operation
        } catch (error) {
            const isLastAttempt = i === attempts - 1;
            if (isLastAttempt) throw error; // If this was the last attempt, throw the error

            const delay = Math.pow(2, i) * 100; // Exponential backoff
            console.log(`Operation failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

async function main() {
    try {
        const initialUrl = `${githubApiBaseUrl}/domains?ref=main`;
        const initialContents = await fetchGitHubContent(initialUrl);
        for (const item of initialContents) {
            await processGitHubItem(item);
        }
        console.log('All files have been processed.');
    } catch (error) {
        console.error('Error:', error);
    }
}

main();

