// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // // https://vitejs.dev/config/
// // export default defineConfig({
// //   plugins: [react()],
// //   css: {
// //     postcss: "./postcss.config.js", // Ensures Tailwind runs via PostCSS
// //   },
// //  server: {
// //     proxy: {
// //       '/auth': {
// //         target: 'http://127.0.0.1:8000',
// //         changeOrigin: true,
// //         secure: false,
// //       },
// //       '/recipes': {
// //         target: 'http://127.0.0.1:8000',
// //         changeOrigin: true,
// //         secure: false,
// //       },
// //        '/dashboard': {
// //         target: 'http://127.0.0.1:8000',
// //         changeOrigin: true,
// //         secure: false,
// //       },
// //     },
// //   },
// // });
// // vite.config.ts
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       "/auth": {
//         target: "http://127.0.0.1:8000",
//         changeOrigin: true,
//         secure: false,
//       },
//       "/users": {
//         target: "http://127.0.0.1:8000",
//         changeOrigin: true,
//         secure: false,
//       },
//       "/recipes": {
//         target: "http://127.0.0.1:8000",
//         changeOrigin: true,
//         secure: false,
//       },
//       "/pantry": {
//         target: "http://127.0.0.1:8000",
//         changeOrigin: true,
//         secure: false,
//       },
//       "/leftovers": {
//         target: "http://127.0.0.1:8000",
//         changeOrigin: true,
//         secure: false,
//       },
//       "/dashboard": {
//         // ADD THIS
//         target: "http://127.0.0.1:8000",
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// });
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
      "/users": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
      "/recipes": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
      "/kitchen": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
      "/remainings": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
      "/dboard": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Add this for SPA routing
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
  },
});
