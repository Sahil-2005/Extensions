const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

const iconsDir = path.join(__dirname, 'icons');

async function createIcon(size, text) {
    try {
        // Create a new image with slate 800 background
        const image = new Jimp(size, size, '#1e293b');
        
        // Save as PNG
        const outputPath = path.join(iconsDir, `icon${size}.png`);
        await image.writeAsync(outputPath);
        console.log(`Created ${outputPath}`);
    } catch (err) {
        console.error('Error creating icon:', err);
    }
}

// Convert existing JPGs if available, or generate new ones
// Since text rendering in pure JS without canvas is hard with jimp (needs font files),
// we will just create colored blocks for now to ensure visibility.
// Or we can just load the existng jpg and save as png.

async function convertIcons() {
    const sizes = [16, 48, 128];
    
    for (const size of sizes) {
        const jpgPath = path.join(iconsDir, `icon${size}.jpg`);
        const pngPath = path.join(iconsDir, `icon${size}.png`);
        
        if (fs.existsSync(jpgPath)) {
            console.log(`Converting ${jpgPath} to PNG...`);
            try {
                const image = await Jimp.read(jpgPath);
                await image.writeAsync(pngPath);
                console.log(`Saved ${pngPath}`);
            } catch (err) {
                console.error(`Failed to convert ${jpgPath}:`, err);
                // Fallback to generation
                await createIcon(size, 'PG');
            }
        } else {
            console.log(`${jpgPath} not found, generating new icon...`);
            await createIcon(size, 'PG');
        }
    }
}

convertIcons();
