import esbuild from 'esbuild';
import swc from '@swc/core';

// Hermes doesn't allow classes, so we need to convert them to functions
// Thankfully, swc can do this for us
const classConversionPlugin = {
    name: "swc",
    setup: (build) => {
        build.onLoad({ filter: /\.js$/ }, async (args) => {
            const result = await swc.transformFile(args.path, {
                jsc: { externalHelpers: true },
                env: { targets: "defaults", include: ["transform-classes"] },
            });
            return { contents: result.code };
        });
    },
}

esbuild.build({
    entryPoints: ['src/kernel/index.js'],
    bundle: true,
    // minify: true,
    jsxFactory: 'React.createElement',
    outfile: 'out/kernel.js',
    plugins: [classConversionPlugin],
}).catch(() => process.exit(1));
