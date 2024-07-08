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

const Home: React.FC = () => {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState<string>('white');
  const symbol = 'PEOPLEUSDT';

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get<Price[]>(`/api/fetchPrice?symbol=${symbol}`);
        const fetchedPrices = response.data;
        
        setPrices(fetchedPrices);
        
        const latestPrice = fetchedPrices[fetchedPrices.length - 1]?.price;
        if (latestPrice < 0.0546) {
          setBackgroundColor('red');
          
        } else {
          setBackgroundColor('green');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    fetchPrices(); // Fetch prices initially
    const intervalId = setInterval(fetchPrices, 10000); // Fetch every 10 seconds
    return () => clearInterval(intervalId);
  }, []);

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
    <Container maxWidth="md" style={{ backgroundColor: backgroundColor }}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Continuous Path Graph from Array of Numbers
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

export default Home;
