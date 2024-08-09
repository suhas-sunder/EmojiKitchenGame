// vite.config.ts
import { vitePlugin as remix } from "file:///E:/Desktop%20Files/Web%20Dev%20Projects%20and%20Learning/github/EmojiKitchenGame/node_modules/@remix-run/dev/dist/index.js";
import { defineConfig, loadEnv } from "file:///E:/Desktop%20Files/Web%20Dev%20Projects%20and%20Learning/github/EmojiKitchenGame/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///E:/Desktop%20Files/Web%20Dev%20Projects%20and%20Learning/github/EmojiKitchenGame/node_modules/vite-tsconfig-paths/dist/index.mjs";
var vite_config_default = ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  process.env = { ...process.env, ...env };
  const port = 3200;
  return defineConfig({
    server: {
      port,
      hmr: {
        protocol: "ws",
        host: "localhost"
      }
    },
    plugins: [
      remix({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true
        }
      }),
      tsconfigPaths()
    ],
    base: "/"
    // Ensure base path is set correctly
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxEZXNrdG9wIEZpbGVzXFxcXFdlYiBEZXYgUHJvamVjdHMgYW5kIExlYXJuaW5nXFxcXGdpdGh1YlxcXFxFbW9qaUtpdGNoZW5HYW1lXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxEZXNrdG9wIEZpbGVzXFxcXFdlYiBEZXYgUHJvamVjdHMgYW5kIExlYXJuaW5nXFxcXGdpdGh1YlxcXFxFbW9qaUtpdGNoZW5HYW1lXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9EZXNrdG9wJTIwRmlsZXMvV2ViJTIwRGV2JTIwUHJvamVjdHMlMjBhbmQlMjBMZWFybmluZy9naXRodWIvRW1vamlLaXRjaGVuR2FtZS92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IHZpdGVQbHVnaW4gYXMgcmVtaXggfSBmcm9tIFwiQHJlbWl4LXJ1bi9kZXZcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiO1xuXG5leHBvcnQgZGVmYXVsdCAoeyBtb2RlIH06IHsgbW9kZTogc3RyaW5nIH0pID0+IHtcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCBcIlwiKTtcbiAgcHJvY2Vzcy5lbnYgPSB7IC4uLnByb2Nlc3MuZW52LCAuLi5lbnYgfTtcblxuICBjb25zdCBwb3J0ID0gMzIwMDtcblxuICByZXR1cm4gZGVmaW5lQ29uZmlnKHtcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIHBvcnQsXG4gICAgICBobXI6IHtcbiAgICAgICAgcHJvdG9jb2w6ICd3cycsXG4gICAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIHJlbWl4KHtcbiAgICAgICAgZnV0dXJlOiB7XG4gICAgICAgICAgdjNfZmV0Y2hlclBlcnNpc3Q6IHRydWUsXG4gICAgICAgICAgdjNfcmVsYXRpdmVTcGxhdFBhdGg6IHRydWUsXG4gICAgICAgICAgdjNfdGhyb3dBYm9ydFJlYXNvbjogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgdHNjb25maWdQYXRocygpLFxuICAgIF0sXG4gICAgYmFzZTogXCIvXCIsIC8vIEVuc3VyZSBiYXNlIHBhdGggaXMgc2V0IGNvcnJlY3RseVxuICB9KTtcbn07XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdaLFNBQVMsY0FBYyxhQUFhO0FBQzViLFNBQVMsY0FBYyxlQUFlO0FBQ3RDLE9BQU8sbUJBQW1CO0FBRTFCLElBQU8sc0JBQVEsQ0FBQyxFQUFFLEtBQUssTUFBd0I7QUFDN0MsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBQzNDLFVBQVEsTUFBTSxFQUFFLEdBQUcsUUFBUSxLQUFLLEdBQUcsSUFBSTtBQUV2QyxRQUFNLE9BQU87QUFFYixTQUFPLGFBQWE7QUFBQSxJQUNsQixRQUFRO0FBQUEsTUFDTjtBQUFBLE1BQ0EsS0FBSztBQUFBLFFBQ0gsVUFBVTtBQUFBLFFBQ1YsTUFBTTtBQUFBLE1BQ1I7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxNQUFNO0FBQUEsUUFDSixRQUFRO0FBQUEsVUFDTixtQkFBbUI7QUFBQSxVQUNuQixzQkFBc0I7QUFBQSxVQUN0QixxQkFBcUI7QUFBQSxRQUN2QjtBQUFBLE1BQ0YsQ0FBQztBQUFBLE1BQ0QsY0FBYztBQUFBLElBQ2hCO0FBQUEsSUFDQSxNQUFNO0FBQUE7QUFBQSxFQUNSLENBQUM7QUFDSDsiLAogICJuYW1lcyI6IFtdCn0K
