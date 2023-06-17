import bcrypt from 'bcryptjs';
import db from '../connection/db';
import cors from './cors';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {

    // Initialize CORS
await cors(req, res);
  if (req.method === 'POST') {
    const { name, email, password,mob } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the database
    db.query(
      'INSERT INTO customer (name, email, password,mob) VALUES (?, ?, ?,?)',
      [name, email, hashedPassword,mob],
     async (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ message: 'Failed to register user' });
        } else {
            const userId = results.insertId;

            // Generate JWT token
            const token = jwt.sign({ userId }, 'your_secret_key');
            // Generate JWT token
            res.status(200).json({ token:token,cust_id:userId });
        
        }
      }
    );
  } else {
    res.status(400).json({ message: 'Invalid request method' });
  }
}