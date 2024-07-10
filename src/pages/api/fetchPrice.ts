import { NextApiRequest, NextApiResponse } from 'next';
import { db } from './firebaseAdmin';
import axios from 'axios';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

const fetchPrices = async (req: NextApiRequest, res: NextApiResponse) => {
  const symbol = req.query.symbol as string;
  
  if (!symbol) {
    return res.status(400).json({ error: 'Symbol is required' });
  }

  const baseUrl = "https://fapi.binance.com/fapi/v1/ticker/price";
  const params = { symbol };
  
  try {
    const response = await axios.get(baseUrl, { params });
    const currentPrice = parseFloat(response.data.price);
    
    const timestamp = new Date().toISOString();
    
    let prices: any[] = [];
    const pricesCollection = collection(db, symbol);
    const pricesQuery = query(pricesCollection, orderBy('timestamp', 'asc'));
    const pricesSnapshot = await getDocs(pricesQuery);

    pricesSnapshot.forEach(doc => {
      prices.push(doc.data());
    });


    // Giá vào lệnh
    let pricesMoney = 1.36;
    let money = 0;
    let totalMoney = 8.880;
    let percentageMoney = 50;
    let testTotalMoney = 0;
    let stoploss = 0.0555;

    const firstPrice = prices.length > 0 ? prices[0].price : null;
    let percentageChange = 0;
    if (firstPrice !== null) {
      percentageChange = Math.abs((((currentPrice - firstPrice) / firstPrice) * 100) * percentageMoney);
      money = Math.abs(pricesMoney * percentageChange / 100);
    }

    // Check if prices array has at least 10 entries
    if (prices.length >= 10) {
      const lastTenPrices = prices.map((entry: any) => entry.price);
      const firstPriceLastTen = lastTenPrices[0];
      const percentageChangeLastTen = ((currentPrice - firstPriceLastTen) / firstPriceLastTen) * 100;
      console.log(`Percentage change (last 10 prices): ${Math.round(percentageChangeLastTen)}%`);
    } else {
      console.log("Not enough prices to calculate percentage change for last 10 entries.");
    }

    totalMoney = Math.abs(money + totalMoney);
    // Hiển thị kết quả
    console.log(`Latest price: ${currentPrice}`);
    console.log(`Percentage change: ${Math.round(percentageChange)}%`);
    console.log(`money : ${money}`);
    console.log(`totalMoney : ${totalMoney}`);

    // Test totalMoney
    percentageChange = Math.abs((((stoploss - firstPrice) / firstPrice) * 100) * percentageMoney);
    money = Math.abs((pricesMoney * percentageChange) / 100);
    testTotalMoney = money + 8.47;
    console.log(`test totalMoney : ${testTotalMoney}`);

    // BTC price
    const baseUrlbtc = "https://fapi.binance.com/fapi/v1/ticker/price?symbol=BTCUSDT";
    const responsebtc = await axios.get(baseUrlbtc);
    const pricebtc = parseFloat(responsebtc.data.price);
    console.log(`price btc : ${pricebtc}`);
    
    // Save price to Firestore
    await addDoc(pricesCollection, { timestamp, price: currentPrice });

    res.status(200).json(prices);
  } catch (error) {
    console.error('Error fetching price:', error); // Log the error to console
    res.status(500).json({ error: 'Failed to fetch price' });
  }
};

export default fetchPrices;
