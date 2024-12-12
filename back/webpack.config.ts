import path from "path";
import nodeExternals from "webpack-node-externals";
import { BUILD_NAME } from "./src/utils/constants";

export default {
  mode: "production",
  entry: "./dist/index.js",
  target: "node",
  externals: [nodeExternals()],
  output: {
    path: path.join(__dirname),
    filename: `${BUILD_NAME}.js`,
    libraryTarget: "var",
    library: "app",
  },
};
