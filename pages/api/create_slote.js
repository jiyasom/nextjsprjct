import db from '../connection/db';

import cors from './cors';

export default  async function handler(req, res) {

    await cors(req, res);


    if (req.method === 'POST') {
      const { car_type, disable_person, shade, price, visible,start_time,end_time,slot_count } = req.body;


  
      const insertQuery = `INSERT INTO slote_settings (car_type, disable_person, shade, price, visible,start_time,end_time,slot_count) VALUES (?, ?, ?, ?, ?,?,?,?)`;
      const values = [car_type, disable_person, shade, price, visible,start_time,end_time,slot_count];
  
      db.query(insertQuery, values, (err, result) => {
        if (err) {
          console.error('Error inserting data:', err);
          res.status(500).json({ error: 'Failed to insert data' });
        } else {
          res.status(200).json({ message: 'Data inserted successfully',data:result });
        }
      });
    }
  else  if (req.method === 'GET') {

    try {
        const selectQuery = 'SELECT * FROM slote_settings';

        db.query(selectQuery, (err, result) => {
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
     

  }
    
    
    else if (req.method === 'PUT') {
      const { slote_id, car_type, disable_person, shade, price, visible,start_time,end_time,slot_count } = req.body;
  
      const updateQuery = `UPDATE slote_settings SET car_type = ?, disable_person = ?, shade = ?, price = ?, visible = ?, start_time = ?, end_time = ?, slot_count= ? WHERE slote_id = ?`;
      const values = [car_type, disable_person, shade, price, visible, slote_id,start_time,end_time,slot_count];
      
      db.query(updateQuery, values, (err, result) => {
        if (err) {
          console.error('Error updating data:', err);
          res.status(500).json({ error: 'Failed to update data' });
        } else {
          if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Data not found' });
          } else {
            res.status(200).json({ message: 'Data updated successfully' });
          }
        }
      });
    } else if (req.method === 'DELETE') {

      const { slote_id } = req.body;
      const deleteQuery = `DELETE FROM slote_settings WHERE slote_id = ?`;
      const values = [slote_id];
  
      db.query(deleteQuery, values, (err, result) => {
        if (err) {
          console.error('Error deleting data:', err);
          res.status(500).json({ error: 'Failed to delete data' });
        } else {
          if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Data not found' });
          } else {
            res.status(200).json({ message: 'Data deleted successfully' });
          }
        }
      });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }
  