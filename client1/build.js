import esbuild from 'esbuild'

esbuild.build({
    entryPoints: ['src/main.jsx'], // Entry file
    bundle: true,                   // Bundle all dependencies
    outdir: 'dist',                 // Output directory
    minify: true,                   // Minify the output
    sourcemap: true,
    format: 'esm',                // Generate source maps
    target: ['es2020'],             // Target environment
    platform: 'browser',            // Target platform
    jsxFactory: 'React.createElement', // JSX factory
    jsxFragment: 'React.Fragment',
    loader: {
        '.js': 'jsx',
    }, 
     // JSX fragment
}).catch(() => process.exit(1));    // Handle build errors