import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";

export default {
	input: "src/index.ts",
	output: [
		{
			file: "build/x.iife.js",
			format: "iife",
			indent: "\t",
			name: "X",
			sourcemap: false,
		},
	],
	plugins: [
		resolve(),
		typescript({
			tsconfig: "./tsconfig.json",
		}),
	],
};
