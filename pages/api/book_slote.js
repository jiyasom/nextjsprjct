// pages/api/reservations.js
import db from '../connection/db';// Replace with the actual path to your database configuration
import cors from './cors';// Replace with your database connection configuration

  export default async function handler(req, res) {

    await cors(req, res);


  if (req.method === 'POST') {
    const { slote_id, date, amount_received, slote_no,cust_id} = req.body;

    const insertQuery = `
      INSERT INTO reservations (slote_id, date, amount_received, slote_no,cust_id)
      VALUES (?, ?, ?, ?,?)
    `;

    const values = [slote_id, date, amount_received, slote_no,cust_id];

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Error In payment' });
        return;
      }
      
      res.status(200).json({ message: 'Payment successfully completed' });
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
