import { defineConfig } from "vite";

export default defineConfig({
    base: './',
    build: {
        minify: 'terser', // kaboom will not work with es modules
        outDir: './docs',
    },
});