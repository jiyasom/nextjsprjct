import db from '../connection/db';
import cors from './cors';

export default async function handler(req, res) {
    await cors(req, res);
  if (req.method !== 'POST') {
    res.status(400).json({ message: 'Invalid request method. Only POST requests are allowed.' });
    return;
  }

  try {

    // Query to retrieve customer data
    const query = 'SELECT * FROM customer';

    // Execute the query
    db.query(query, (error, results) => {
      // Handle query errors
      if (error) {
        res.status(500).json({ message: 'An error occurred while retrieving customer data.' });
        throw error;
      }

      // Close the database connection
      // Send the customer data as a response
      res.status(200).json(results);
    });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while connecting to the database.' });
    throw error;
  }
}
