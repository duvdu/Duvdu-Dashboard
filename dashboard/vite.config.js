"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vite_1 = require("vite");
var plugin_react_1 = require("@vitejs/plugin-react");
var path_1 = require("path");
// https://vitejs.dev/config/
exports.default = (0, vite_1.defineConfig)({
    build: {
        commonjsOptions: {
            include: ["tailwind.config.js", "node_modules/**"],
        },
    },
    optimizeDeps: {
        include: ["tailwind-config"],
    },
    plugins: [(0, plugin_react_1.default)()],
    resolve: {
        alias: {
            "tailwind-config": path_1.default.resolve(__dirname, "./tailwind.config.js"),
            '@': '/src', // Adjust alias if necessary
        },
    },
    server: {
        port: 3000,
        host: '0.0.0.0',
    },
    preview: {
        port: 3000,
        host: '0.0.0.0',
    },
});
