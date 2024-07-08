import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
// import { to } from './../../../../../web-ai/.next/server/vendor-chunks/next';

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
    //giá vào lệnh
    let pricesMoney = 1.67;
    let money = 0;
    let totalMoney = 9.74;
    let percentageMoney = 50;
    let testTotalMoney = 0;
    let stoploss = 0.0550;
    const fisrtPrice = prices[0]?.price;
    let percentageChange = null;
    if (fisrtPrice !== null) {
      percentageChange = (((price - fisrtPrice) / fisrtPrice) * 100) * percentageMoney;
      money = pricesMoney * percentageChange / 100;
    }
    // Check if prices array has at least 10 entries
    if (prices.length >= 10) {
      // Get the last 10 prices
      const lastTenPrices = prices.slice(-10).map((entry: any) => entry.price);
      // Calculate percentage change between the latest price and the oldest price in the last 10 prices
      const firstPrice = lastTenPrices[0];
      const percentageChangeLastTen = ((price - firstPrice) / firstPrice) * 100;
      console.log(`Percentage change (last 10 prices): ${percentageChangeLastTen} %`);
    } else {
      console.log("Not enough prices to calculate percentage change for last 10 entries.");
    }
    totalMoney = money + totalMoney;
    // Hiển thị kết quả
    console.log(`Latest price: ${price}`);
    console.log(`Percentage change: ${percentageChange }`);
    console.log(`money : ${money}`);
    console.log(`totalMoney : ${totalMoney}`);
    //test totalMoney
    percentageChange = (((stoploss - fisrtPrice) / fisrtPrice)* 100) * percentageMoney;
    money = (pricesMoney * percentageChange) / 100;

    testTotalMoney = money + 9.74;
    console.log(`test totalMoney : ${testTotalMoney}`)

    // Lưu giá vào file sau 10s
    
    prices.push({ timestamp, price });

    fs.writeFileSync(filePath, JSON.stringify(prices, null, 2), 'utf8');
    
    res.status(200).json(prices);
  } catch (error) {
    console.error('Error fetching price:', error); // Log the error to console
    res.status(500).json({ error: 'Failed to fetch price' });
  }
};

export default fetchPrices;
