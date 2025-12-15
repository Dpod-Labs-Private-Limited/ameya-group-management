import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import postcss from "rollup-plugin-postcss";
import json from "@rollup/plugin-json";
import svgr from "@svgr/rollup";
import url from "@rollup/plugin-url";
import postcssPresetEnv from "postcss-preset-env";
import replace from "@rollup/plugin-replace";

const extensions = [".js", ".jsx"];

const basePlugins = [
  replace({
    "process.env.NODE_ENV": JSON.stringify("production"),
    preventAssignment: true,
  }),
  resolve({ browser: true, extensions }),
  babel({
    babelHelpers: "runtime",
    extensions,
    exclude: "node_modules/**",
    presets: [
      "@babel/preset-env",
      [
        "@babel/preset-react",
        {
          runtime: "automatic",
          importSource: "react",
        },
      ],
    ],
    plugins: ["@babel/plugin-transform-runtime"],
  }),
  json(),
  postcss({
    inject: true,
    minimize: false,
    plugins: [postcssPresetEnv()],
  }),
  svgr({
    svgo: false,
    ref: true,
    titleProp: true,
  }),
  url({
    include: ["**/*.svg", "**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.gif"],
    limit: 10000,
    fileName: "[name]-[hash][extname]",
    destDir: "dist/assets",
    publicPath: "/assets/",
  }),
  commonjs(),
];

export default [
  {
    input: "src/index.js",
    output: {
      file: "dist/group_management.js",
      format: "umd",
      name: "GroupManagement",
      sourcemap: false,
    },
    external: [],
    plugins: [...basePlugins],
  },
];