import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import fs from "fs";
import path from "path";

const filePath = path.resolve(process.cwd(), "prices.json");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { symbol } = req.query;

  try {
    // Fetch the current price from Binance
    const response = await axios.get(
      "https://fapi.binance.com/fapi/v1/ticker/price",
      {
        params: { symbol },
      }
    );
    const price = response.data.price;

    // Read the existing prices from the file
    let prices = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf8");
      prices = JSON.parse(fileData);
    }
    console.log(prices);
    // Add the new price to the array
    prices.push({ timestamp: new Date().toISOString(), price });

    // Save the updated prices back to the file
    fs.writeFileSync(filePath, JSON.stringify(prices, null, 2));

    res.status(200).json(prices);
  } catch (error) {

    // const query: string = `[JavaScript] fix error: ${error.message}`;
    // const encodedQuery: string = encodeURIComponent(query);
    // const url: string = `https://chatgpt/?q=${encodedQuery}`;

    // if (typeof window !== "undefined") {
    //   window.open(url);
    // } else {
    //   console.log(`Open this URL in a browser: ${url}`);
    // }

    // console.log(query);
    res.status(500).json({ error: 'Error fetching price' });
  }
}
