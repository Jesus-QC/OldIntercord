import esbuild from 'esbuild';
import swc from '@swc/core';
import * as fs from "fs";

// First we bundle everything together and compile the JSX
await esbuild.build({
    entryPoints: ['src/kernel/index.js'],
    bundle: true,
    jsxFactory: 'React.createElement',
    outfile: 'out/kernel-temp.js',
});

// Hermes doesn't allow classes, so we need to convert them to functions
// Thankfully, swc can do this for us
const classConversionPlugin = {
    name: "swc",
    setup: (build) => {
        build.onLoad({ filter: /\.[jt]s?$/ }, async (args) => {
            const result = await swc.transformFile(args.path, {
                jsc: { externalHelpers: true },
                env: { targets: "defaults", include: ["transform-classes"] },
            });
            return { contents: result.code };
        });
    },
}

// Yep, we are building it twice, it fixes some issues with the plugins and react, so it is fine
await esbuild.build({
    entryPoints: ['out/kernel-temp.js'],
    bundle: true,
    minify: true,
    plugins: [classConversionPlugin],
    outfile: 'out/kernel/kernel.js',
});

// And we remove the temporary file
await fs.rmSync('out/kernel-temp.js');

