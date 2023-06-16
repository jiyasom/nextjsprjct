import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';

// Initialize the CORS middleware
const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST','PUT','DELETE'],
    origin: 'http://localhost:4200', // Replace with your frontend URL
    credentials: true,
  })
);

export default cors;