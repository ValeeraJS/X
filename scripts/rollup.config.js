import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
// import resolve from "@rollup/plugin-node-resolve";

export default {
	input: 'src/index.ts',
	plugins: [
		json(),
		typescript({
			tsconfig: './tsconfig.json'
		})
	],
	output: [
		{
			format: 'umd',
			name: 'X',
			file: 'build/x.js',
			sourcemap: true,
			indent: '\t',
			globals: {
				"@valeera/idgenerator": "IdGenerator",
				"@valeera/eventdispatcher": "EventDispatcher"
			}
		},
		{
			format: 'es',
			file: 'build/x.module.js',
			sourcemap: true,
			indent: '\t'
		}
	],
	external: ["@valeera/idgenerator", "@valeera/eventdispatcher"]
};
