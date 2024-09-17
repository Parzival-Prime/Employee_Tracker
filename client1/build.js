import esbuild from 'esbuild';
import fs from 'fs'; // For file operations
import path from 'path';

// Define the output directory
const outdir = 'dist';

// Build for the frontend with esbuild
esbuild.build({
    entryPoints: ['src/main.jsx'], // Entry file
    bundle: true,                  // Bundle all dependencies
    outdir: outdir,                // Output directory
    minify: true,                  // Minify the output
    sourcemap: true,               // Generate source maps
    format: 'esm',                 // Use ESM format
    target: ['es2020'],            // Target environment
    platform: 'browser',           // Target platform
    jsxFactory: 'React.createElement', // JSX factory
    jsxFragment: 'React.Fragment',     // JSX fragment
    loader: {
        '.js': 'jsx',
    },
}).then(() => {
    console.log('Build completed successfully for the frontend.');

    // Copy server.js to dist directory without modification
    const serverSrcPath = 'server.js';
    const serverDestPath = path.join(outdir, 'server.js');

    fs.copyFile(serverSrcPath, serverDestPath, (err) => {
        if (err) {
            console.error('Error copying server.js:', err);
        } else {
            console.log('server.js copied successfully to dist folder.');
        }
    });

}).catch(() => process.exit(1));  // Handle build errors
