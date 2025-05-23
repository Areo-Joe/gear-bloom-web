// rsbuild.config.ts
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginBabel } from "@rsbuild/plugin-babel";
import { TanStackRouterRspack } from "@tanstack/router-plugin/rspack";

// React Compiler 配置
const ReactCompilerConfig = {
  // React 19 不需要额外配置
};

export default defineConfig({
  plugins: [
    pluginReact(),
    // 添加 Babel 插件用于 React Compiler
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
      babelLoaderOptions(opts) {
        opts.plugins ||= [];
        // 确保 React Compiler 是第一个插件
        opts.plugins.unshift([
          "babel-plugin-react-compiler",
          ReactCompilerConfig,
        ]);
      },
    }),
  ],
  tools: {
    rspack: {
      plugins: [
        TanStackRouterRspack({ target: "react", autoCodeSplitting: true }),
      ],
    },
  },
  html: {
    title: "Gear Bloom",
    favicon: "./public/favicon.ico",
  },
});
