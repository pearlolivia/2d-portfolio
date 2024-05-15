import { defineConfig } from "vite";

export default defineConfig({
    base: './',
    buiild: {
        minify: 'terser', // kaboom will not work with es modules
    },
});