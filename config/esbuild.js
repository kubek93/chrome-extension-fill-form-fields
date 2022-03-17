import esbuild from 'esbuild';

esbuild.buildSync({
    entryPoints: [
        'src/background.js',
        'src/content.js',
        'src/options.js',
        'src/popup.js'
    ],
    bundle: true,
    // minify: true,
    // sourcemap: true,
    // target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
    outdir: 'public/build'
  });
