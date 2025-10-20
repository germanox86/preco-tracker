import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({
  origin: "https://germanox86.github.io"
}));

const PORT = process.env.PORT || 3000;

app.get("/api/coin/:coinId", async (req, res) => {
  const { coinId } = req.params;
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
      headers: { "x-cg-demo-api-key": process.env.CG_API_KEY }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch coin data" });
  }
});

app.get("/api/coin/:coinId/market_chart", async (req, res) => {
  const { coinId } = req.params;
  const { vs_currency, days, interval } = req.query;
  try {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${vs_currency}&days=${days}&interval=${interval}`;
    const response = await fetch(url, {
      headers: { "x-cg-demo-api-key": process.env.CG_API_KEY }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch historical data" });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
