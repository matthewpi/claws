import { build } from 'esbuild';

const isProduction = process.env.NODE_ENV === 'production';
const define = {};

for (const k in process.env) {
	if (k === 'NODE_ENV') {
		continue;
	}
	define[k] = JSON.stringify(process.env[k]);
}

build({
	sourcemap: !isProduction && true,
	legalComments: 'none',
	format: 'esm',
	target: 'esnext',
	minify: isProduction,
	charset: 'utf8',
	define,
	logLevel: isProduction ? 'info' : 'silent',

	bundle: true,
	outfile: 'dist/index.mjs',
	entryPoints: ['src/index.ts'],
}).catch(() => process.exit(1));
