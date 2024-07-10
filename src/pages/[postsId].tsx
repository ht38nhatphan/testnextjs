import { useRouter } from "next/router";
import * as React from "react";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';

interface Price {
  timestamp: string;
  price: number;
}

export interface PostDetailProps {}

export default function PostDetail(props: PostDetailProps) {
  const router = useRouter();
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      const symbol = router.query['postsId'];
      console.log("symbol: ", symbol);
      try {
        const response = await axios.get<Price[]>(`/api/fetchPrice?symbol=${symbol}`);
        setPrices(response.data);
      } catch (error) {
        console.error('Error fetching prices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices(); // Lấy giá lần đầu
    const intervalId = setInterval(fetchPrices, 10000); // Lấy giá mỗi 10 giây

    return () => clearInterval(intervalId); // Xóa interval khi component unmount
  }, [router.query['postsId']]);

  const data = {
    labels: prices.map(price => new Date(price.timestamp).toLocaleTimeString()),
    datasets: [{
      label: 'PEOPLE/USDT Price',
      data: prices.map(price => price.price),
      fill: false,
      borderColor: 'rgba(75,192,192,1)',
      tension: 0.1
    }]
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Biểu đồ đường liên tục từ mảng các số
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Line data={data} />
          </Paper>
        )}
      </Box>
    </Container>
  );
}
