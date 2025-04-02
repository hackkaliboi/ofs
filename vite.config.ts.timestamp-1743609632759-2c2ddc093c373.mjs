// vite.config.ts
import { defineConfig } from "file:///C:/Users/gener/OneDrive/Documents/COMPANIES/OFS/ofsledger/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/gener/OneDrive/Documents/COMPANIES/OFS/ofsledger/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///C:/Users/gener/OneDrive/Documents/COMPANIES/OFS/ofsledger/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\gener\\OneDrive\\Documents\\COMPANIES\\OFS\\ofsledger";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/api/, "")
      }
    },
    middleware: (app) => {
      app.use((req, res, next) => {
        if (!req.url?.includes(".") && !req.url?.startsWith("/api")) {
          req.url = "/index.html";
        }
        next();
      });
    }
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxnZW5lclxcXFxPbmVEcml2ZVxcXFxEb2N1bWVudHNcXFxcQ09NUEFOSUVTXFxcXE9GU1xcXFxvZnNsZWRnZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGdlbmVyXFxcXE9uZURyaXZlXFxcXERvY3VtZW50c1xcXFxDT01QQU5JRVNcXFxcT0ZTXFxcXG9mc2xlZGdlclxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvZ2VuZXIvT25lRHJpdmUvRG9jdW1lbnRzL0NPTVBBTklFUy9PRlMvb2ZzbGVkZ2VyL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XG5pbXBvcnQgdHlwZSB7IENvbm5lY3QgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHR5cGUgeyBTZXJ2ZXJSZXNwb25zZSB9IGZyb20gXCJodHRwXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiBcIjo6XCIsXG4gICAgcG9ydDogODA4MCxcbiAgICBoaXN0b3J5QXBpRmFsbGJhY2s6IHRydWUsXG4gICAgcHJveHk6IHtcbiAgICAgIFwiL2FwaVwiOiB7XG4gICAgICAgIHRhcmdldDogXCJodHRwOi8vbG9jYWxob3N0OjgwODBcIixcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgXCJcIiksXG4gICAgICB9LFxuICAgIH0sXG4gICAgbWlkZGxld2FyZTogKGFwcDogQ29ubmVjdC5TZXJ2ZXIpID0+IHtcbiAgICAgIGFwcC51c2UoKHJlcTogQ29ubmVjdC5JbmNvbWluZ01lc3NhZ2UsIHJlczogU2VydmVyUmVzcG9uc2UsIG5leHQ6IENvbm5lY3QuTmV4dEZ1bmN0aW9uKSA9PiB7XG4gICAgICAgIGlmICghcmVxLnVybD8uaW5jbHVkZXMoJy4nKSAmJiAhcmVxLnVybD8uc3RhcnRzV2l0aCgnL2FwaScpKSB7XG4gICAgICAgICAgcmVxLnVybCA9ICcvaW5kZXguaHRtbCc7XG4gICAgICAgIH1cbiAgICAgICAgbmV4dCgpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgbW9kZSA9PT0gJ2RldmVsb3BtZW50JyAmJlxuICAgIGNvbXBvbmVudFRhZ2dlcigpLFxuICBdLmZpbHRlcihCb29sZWFuKSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICB9LFxufSkpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2VyxTQUFTLG9CQUFvQjtBQUMxWSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsdUJBQXVCO0FBSGhDLElBQU0sbUNBQW1DO0FBUXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sb0JBQW9CO0FBQUEsSUFDcEIsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDQSxVQUFTQSxNQUFLLFFBQVEsVUFBVSxFQUFFO0FBQUEsTUFDOUM7QUFBQSxJQUNGO0FBQUEsSUFDQSxZQUFZLENBQUMsUUFBd0I7QUFDbkMsVUFBSSxJQUFJLENBQUMsS0FBOEIsS0FBcUIsU0FBK0I7QUFDekYsWUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLEdBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxXQUFXLE1BQU0sR0FBRztBQUMzRCxjQUFJLE1BQU07QUFBQSxRQUNaO0FBQ0EsYUFBSztBQUFBLE1BQ1AsQ0FBQztBQUFBLElBQ0g7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixTQUFTLGlCQUNULGdCQUFnQjtBQUFBLEVBQ2xCLEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDaEIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbInBhdGgiXQp9Cg==
