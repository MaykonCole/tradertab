import { streamHistoryOddVideo } from "./_historyOddVideoStream.js";

export default async function handler(req, res) {
  return streamHistoryOddVideo(req, res);
}
