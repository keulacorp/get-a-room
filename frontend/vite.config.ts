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
        port: 3000
    },
    build: {
        outDir: './build'
    }
});
