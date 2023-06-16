import db from '../connection/db';// Replace with the actual path to your database configuration
import cors from './cors';
export default async function handler(req, res) {


    await cors(req, res);
  if (req.method === 'DELETE') {
    const { reservations_id } = req.query;

    try {
      const deleteQuery = 'DELETE FROM reservations WHERE reservations_id = ?';
      db.query(deleteQuery, [reservations_id], (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ message: 'Error Cancelled the Slote' });
        } else {
          res.status(200).json({ message: 'Slote Cancelled successfully' });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error Cancelled the Slote' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}