import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";
// import resolve from "@rollup/plugin-node-resolve";

export default {
	external: ["@valeera/eventdispatcher", "@valeera/idgenerator"],
	input: "src/index.ts",
	output: [
		{
			file: "build/x.js",
			format: "umd",
			globals: {
				"@valeera/eventdispatcher": "EventDispatcher",
				"@valeera/idgenerator": "IdGenerator",
				"@valeera/tree": "Tree"
			},
			indent: "\t",
			name: "X",
			sourcemap: true
		},
		{
			file: "build/x.module.js",
			format: "es",
			indent: "\t",
			sourcemap: false
		}
	],
	plugins: [
		json(),
		typescript({
			tsconfig: "./tsconfig.json"
		})
	]
};
