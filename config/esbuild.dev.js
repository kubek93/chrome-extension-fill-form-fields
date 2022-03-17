import esbuild from 'esbuild';

esbuild.build({
    entryPoints: [
        'src/background.js',
        'src/content.js',
        'src/options.js',
        'src/popup.js'
    ],
    bundle: true,
    watch: true,
    outdir: 'public/build'
  }).then(result => {
    console.log('watching...')
  });
