// login.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../connection/db';
import cors from './cors';


export default async function handler(req, res) {



    
// Initialize CORS
await cors(req, res);
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Check if the user exists in the database
    db.query(
      'SELECT * FROM customer WHERE email = ?',
      [email],
      async (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ message: 'Failed to login' });
        } else if (results.length === 0) {
          res.status(401).json({ message: 'Invalid email or password' });
        } else {
          const user = results[0];
          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (isPasswordValid) {
            // Generate a JSON Web Token (JWT) for authentication
            const token = jwt.sign({ userId: user.id }, 'your_secret_key');

            res.status(200).json({ token:token,user:user });
          } else {
            res.status(401).json({ message: 'Invalid email or password' });
          }
        }
      }
    );
  } else {
    res.status(400).json({ message: 'Invalid request method' });
  }
}
