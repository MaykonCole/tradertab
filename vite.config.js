import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { streamHistoryOddVideo } from "./api/_historyOddVideoStream.js";
import historyOddVideoProgress from "./api/historyodd-video-progress.js";
import generateHistoryOddTrial from "./api/generate-historyodd-trial.js";
import sendVerificationCode from "./api/send-verification-code.js";
import verifyEmailCode from "./api/verify-email-code.js";

const readJsonBody = (req) =>
  new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1024 * 1024) reject(new Error("request-too-large"));
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });

const adaptVercelResponse = (res) => {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload) => {
    if (!res.headersSent) res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(payload));
    return res;
  };
  res.send = (payload = "") => {
    res.end(payload);
    return res;
  };
  return res;
};

const localApiPlugin = () => ({
  name: "tradertab-local-api",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const pathname = String(req.url || "").split("?")[0];

      if (pathname === "/api/historyodd-video-stream") {
        await streamHistoryOddVideo(req, res);
        return;
      }

      const handler =
        pathname === "/api/historyodd-video-progress"
          ? historyOddVideoProgress
          : pathname === "/api/generate-historyodd-trial"
            ? generateHistoryOddTrial
            : pathname === "/api/send-verification-code"
              ? sendVerificationCode
              : pathname === "/api/verify-email-code"
                ? verifyEmailCode
                : null;

      if (!handler) return next();

      try {
        req.body = await readJsonBody(req);
        adaptVercelResponse(res);
        await handler(req, res);
      } catch (error) {
        console.error("[TraderTab] Local API middleware error", error);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
        }
        res.end(JSON.stringify({ error: "local-api-failed" }));
      }
    });
  },
});

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return {
    plugins: [react(), localApiPlugin()],
    server: { host: "0.0.0.0" },
    preview: { host: "0.0.0.0" },
  };
});
