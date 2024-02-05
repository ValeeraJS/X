import typescript from "rollup-plugin-typescript2";

export default {
	input: "src/index.ts",
	output: [
		{
			file: "build/x.module.js",
			format: "es",
			indent: "\t",
			sourcemap: false,
		},
	],
	plugins: [
		typescript({
			tsconfig: "./tsconfig.json",
		}),
	],
	external: [
		"@valeera/idgenerator",
		"@valeera/eventfire",
		"@valeera/tree",
	],
};
