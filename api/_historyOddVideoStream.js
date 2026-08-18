import { Readable } from "node:stream";

export const HISTORY_ODD_VIDEO_FILE_ID = "1UNRWlQ-uTyyPMGbFFBBYvSpzx249pt-C";

const DRIVE_MEDIA_URL =
  `https://drive.usercontent.google.com/download?id=${HISTORY_ODD_VIDEO_FILE_ID}&export=download&authuser=0&confirm=t`;

const FORWARDED_HEADERS = [
  "content-type",
  "content-length",
  "content-range",
  "accept-ranges",
  "etag",
  "last-modified",
  "cache-control",
];

export async function streamHistoryOddVideo(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET, HEAD");
    res.end("Method Not Allowed");
    return;
  }

  try {
    const headers = {
      "User-Agent":
        req.headers?.["user-agent"] ||
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/150 Safari/537.36",
      Accept: "video/mp4,video/*;q=0.9,*/*;q=0.8",
    };

    if (req.headers?.range) headers.Range = req.headers.range;
    if (req.headers?.["if-none-match"]) headers["If-None-Match"] = req.headers["if-none-match"];
    if (req.headers?.["if-modified-since"])
      headers["If-Modified-Since"] = req.headers["if-modified-since"];

    const upstream = await fetch(DRIVE_MEDIA_URL, {
      method: req.method,
      headers,
      redirect: "follow",
      cache: "no-store",
    });

    const contentType = String(upstream.headers.get("content-type") || "").toLowerCase();
    if (!upstream.ok || contentType.includes("text/html")) {
      const detail = req.method === "HEAD" ? "" : await upstream.text().catch(() => "");
      console.error(
        "[TraderTab] Google Drive video upstream failed",
        upstream.status,
        contentType,
        detail.slice(0, 240),
      );
      res.statusCode = 502;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.end("Não foi possível carregar o vídeo do HistoryOdd.");
      return;
    }

    res.statusCode = upstream.status;
    for (const headerName of FORWARDED_HEADERS) {
      const value = upstream.headers.get(headerName);
      if (value) res.setHeader(headerName, value);
    }

    // Garante que o navegador trate a resposta como mídia e permita seeking via Range.
    if (!upstream.headers.get("content-type")) res.setHeader("Content-Type", "video/mp4");
    if (!upstream.headers.get("accept-ranges")) res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Content-Disposition", "inline; filename=HistoryOdd-apresentacao.mp4");
    res.setHeader("X-Content-Type-Options", "nosniff");

    if (req.method === "HEAD" || !upstream.body) {
      res.end();
      return;
    }

    Readable.fromWeb(upstream.body).pipe(res);
  } catch (error) {
    console.error("[TraderTab] HistoryOdd video stream error", error);
    if (!res.headersSent) {
      res.statusCode = 502;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
    }
    res.end("Não foi possível carregar o vídeo do HistoryOdd.");
  }
}
