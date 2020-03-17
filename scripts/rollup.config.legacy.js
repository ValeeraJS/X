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
			name: 'EventDispatcher',
			file: 'build/EventDispatcher.legacy.js',
			sourceMap: true,
			indent: '\t'
		},
		{
			format: 'es',
			file: 'build/EventDispatcher.legacy.module.js',
			sourceMap: true,
			indent: '\t'
		}
	]
};
