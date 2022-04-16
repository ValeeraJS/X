import json from "rollup-plugin-json";
import typescript from "rollup-plugin-typescript2";

export default {
	external: ["@valeera/idgenerator", "@valeera/eventdispatcher"],
	input: "src/index.ts",
	output: [
		{
			file: "build/x.legacy.js",
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
			file: "build/x.legacy.module.js",
			format: "es",
			indent: "\t",
			sourcemap: false
		}
	],
	plugins: [
		json(),
		typescript({
			tsconfig: "./tsconfig.legacy.json"
		})
	]
};
