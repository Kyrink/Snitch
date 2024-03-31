const fs = require('fs');
const path = require('path');

// Adjusted to the correct path assuming the script is run from the project root
const distPath = path.join(__dirname, '..', '..', 'dist'); // Adjust this path as necessary
const assetsPath = path.join(distPath, 'assets');
const manifestPath = path.join(distPath, 'manifest.json');

// Read the assets directory to find the background script
fs.readdir(assetsPath, (err, files) => {
    if (err) throw err;

    const backgroundScript = files.find(file => file.startsWith('background') && file.endsWith('.js'));
    if (!backgroundScript) {
        console.error('Background script not found.');
        return;
    }

    // Read the current manifest.json
    fs.readFile(manifestPath, (err, data) => {
        if (err) throw err;

        const manifest = JSON.parse(data.toString());
        manifest.background.service_worker = `assets/${backgroundScript}`;

        // Write the updated manifest.json back to the dist directory
        fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), (err) => {
            if (err) throw err;
            console.log('manifest.json updated with the correct background script name.');
        });
    });
});
