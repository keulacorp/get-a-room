import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    // depending on your application, base can also be "/"
    base: './',
    plugins: [
        // here is the main update
        react({
            jsxImportSource: '@emotion/react',
            include: /\.(jsx|tsx)$/,
            babel: {
                plugins: ['@emotion/babel-plugin']
            }
        }),
        viteTsconfigPaths(),
        svgr({ svgrOptions: { exportType: 'named' }, include: '/**/*.svg' })
    ],
    optimizeDeps: {
        include: ['@emotion/styled', '@mui/styled-engine']
    },
    server: {
        // this ensures that the browser opens upon server start
        open: true,
        // this sets a default port to 3000
        port: 3000,
        proxy: {
            // with options: http://localhost:5173/api/bar-> http://jsonplaceholder.typicode.com/bar
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: false,
                secure: true
                // rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    },
    build: {
        outDir: './build',
        rollupOptions: {
            external: ['**.test.ts']
        }
    }
});
