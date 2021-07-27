import { build } from 'esbuild';

const define = {};
const allowedEnvironmentVariables = ['USER_AGENT'];
for (const k in process.env) {
	if (!allowedEnvironmentVariables.includes(k)) {
		continue;
	}
	define[k] = JSON.stringify(process.env[k]);
}

const isProduction = process.env.NODE_ENV === 'production';
const format = process.env.ESBUILD_FORMAT || 'cjs';
const outfile = format === 'esm' ? 'dist/index.mjs' : 'dist/index.js';

build({
	sourcemap: !isProduction && true,
	legalComments: 'none',
	format: format,
	target: 'esnext',
	minify: isProduction,
	charset: 'utf8',
	define,
	logLevel: isProduction ? 'info' : 'silent',

	bundle: true,
	outfile,
	entryPoints: ['src/index.ts'],
}).catch(() => process.exit(1));
