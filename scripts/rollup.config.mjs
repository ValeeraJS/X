import typescript from "rollup-plugin-typescript2";
// import resolve from "@rollup/plugin-node-resolve";

export default {
	external: ["@valeera/eventfirer", "@valeera/idgenerator", "@valeera/tree"],
	input: "src/index.ts",
	output: [
		{
			file: "build/x.js",
			format: "umd",
			globals: {
				"@valeera/eventfirer": "EventFirer",
				"@valeera/idgenerator": "IdGenerator",
				"@valeera/tree": "Tree"
			},
			indent: "\t",
			name: "X",
			sourcemap: false
		},
		{
			file: "build/x.module.js",
			format: "es",
			indent: "\t",
			sourcemap: false
		}
	],
	plugins: [
		typescript({
			tsconfig: "./tsconfig.json"
		})
	]
};
