import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath, URL } from 'node:url';

const r = (p) => fileURLToPath(new URL(p, import.meta.url));

// TASK 1 - Vite Configuration Environments
// defineConfig receives { mode, command } so one file can serve
// development, staging and production with different behaviour.
export default defineConfig(({ mode, command }) => {
  // Loads .env, .env.[mode] (only VITE_* keys are exposed to client code)
  const env = loadEnv(mode, process.cwd(), '');

  const isProd = mode === 'production';
  const isStaging = mode === 'staging';
  const isBuild = command === 'build';

  return {
    // ---------- 1. Compile configuration ----------
    base: env.VITE_BASE_URL || '/',
    esbuild: {
      target: 'es2020',
      // strip console/debugger from production bundles only
      drop: isProd ? ['console', 'debugger'] : [],
    },
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __BUILD_MODE__: JSON.stringify(mode),
    },

    // ---------- 2. Absolute imports (aliases) ----------
    resolve: {
      alias: {
        '@': r('./src'),
        '@components': r('./src/components'),
        '@utils': r('./src/utils'),
        '@config': r('./src/config'),
        '@data': r('./src/data'),
        '@assets': r('./src/assets'),
        '@styles': r('./src/styles'),
      },
    },

    // ---------- Dev server ----------
    server: {
      port: Number(env.VITE_DEV_PORT) || 5173,
      host: true, // expose on LAN so the dashboard can be tested on a real phone
      open: false,
    },
    preview: { port: 4173, host: true },

    // ---------- 3. Build optimization ----------
    build: {
      outDir: 'dist',
      target: 'es2020',
      minify: isBuild ? 'esbuild' : false,
      sourcemap: isProd ? false : true,       // maps only for dev/staging
      cssCodeSplit: true,
      cssMinify: true,
      assetsInlineLimit: 4096,                // <4kb assets become base64
      chunkSizeWarningLimit: 500,
      reportCompressedSize: true,
      rollupOptions: {
        output: {
          // ---------- 4. Assets processing ----------
          // hashed names -> long-term caching, grouped by type
          entryFileNames: 'js/[name]-[hash].js',
          chunkFileNames: 'js/[name]-[hash].js',
          assetFileNames: (info) => {
            const ext = (info.name || '').split('.').pop();
            if (/png|jpe?g|svg|gif|webp|avif|ico/i.test(ext)) return 'images/[name]-[hash][extname]';
            if (/woff2?|ttf|otf/i.test(ext)) return 'fonts/[name]-[hash][extname]';
            if (ext === 'css') return 'css/[name]-[hash][extname]';
            return 'assets/[name]-[hash][extname]';
          },
          // split rarely-changing code into its own cacheable chunk
          manualChunks(id) {
            if (id.includes('/src/data/')) return 'data';
            if (id.includes('/src/utils/')) return 'utils';
          },
        },
      },
    },
  };
});
