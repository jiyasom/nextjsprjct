import db from '../connection/db';// Replace with the actual path to your database configuration
import cors from './cors';
export default async function handler(req, res) {

await cors(req, res);

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { car_type,disable_person,shade } = req.body;





  try {
    const selectQuery = 'SELECT * FROM slote_settings  WHERE car_type = ? AND disable_person = ? AND shade= ? ';
   const values= [car_type,disable_person,shade]
    db.query(selectQuery,values, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving data from the table' });
        return;
      }
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }




//   try {
//     const slots = await db.query(
//       'SELECT * FROM slote_settings WHERE car_type = ? AND disable_person = ? AND shade = ?',
//       [car_type, disable_person, shade]
//     );

//     res.status(200).json(slots);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }






}
