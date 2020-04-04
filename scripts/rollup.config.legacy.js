import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';

export default {
	input: 'src/index.ts',
	plugins: [
		json(),
		typescript({
			tsconfig: './tsconfig.legacy.json'
		})
	],
	output: [
		{
			format: 'umd',
			name: 'X',
			file: 'build/x.legacy.js',
			sourcemap: true,
			indent: '\t',
			globals: {
				"@valeera/idgenerator": "IdGenerator",
				"@valeera/eventdispatcher": "EventDispatcher"
			}
		},
		{
			format: 'es',
			file: 'build/x.legacy.module.js',
			sourcemap: true,
			indent: '\t'
		}
	],
	external: ["@valeera/idgenerator", "@valeera/eventdispatcher"]
};
