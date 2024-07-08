import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const filePath = path.resolve(process.cwd(), 'data', 'prices.json');

const fetchPrices = async (req: NextApiRequest, res: NextApiResponse) => {
  const symbol = req.query.symbol as string;
  
  if (!symbol) {
    return res.status(400).json({ error: 'Symbol is required' });
  }

  const baseUrl = "https://fapi.binance.com/fapi/v1/ticker/price";
  const params = { symbol };
  
  try {
    const response = await axios.get(baseUrl, { params });
    const price = parseFloat(response.data.price);
    
    const timestamp = new Date().toISOString();
    
    let prices = [];
    
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      prices = JSON.parse(data);
    } else {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify([]));
    }

    prices.push({ timestamp, price });

    fs.writeFileSync(filePath, JSON.stringify(prices, null, 2), 'utf8');
    
    res.status(200).json(prices);
  } catch (error) {
    console.error('Error fetching price:', error); // Log the error to console
    res.status(500).json({ error: 'Failed to fetch price' });
  }
};

export default fetchPrices;
