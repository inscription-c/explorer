import { fileURLToPath, URL } from 'url';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        splitVendorChunkPlugin(),
        vuetify({
            autoImport: true,
            styles: { configFile: 'src/scss/variables.scss' }
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        }
    },
    css: {
        preprocessorOptions: {
            scss: {}
        }
    },
    optimizeDeps: {
        exclude: ['vuetify'],
        entries: ['./src/**/*.vue']
    },
    build: {
      minify: 'terser',
      rollupOptions: {
        // output: {
        //   experimentalMinChunkSize: 20 * 1024,
        //   chunkFileNames: 'static/js/[name]-[hash].js',
        //   entryFileNames: 'static/js/[name]-[hash].js',
        //   assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        // },
      },
    },
});
