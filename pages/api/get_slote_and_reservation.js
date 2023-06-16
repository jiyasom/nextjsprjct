


import db from '../connection/db';




export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { sloteId } = req.body;

  // Query to retrieve start time and end time from slote_settings table
  const query = 'SELECT start_time, end_time FROM slote_settings WHERE slote_id = ?';

  // Execute the query with the provided sloteId
  db.query(query, [sloteId], (error, results) => {
    if (error) throw error;

    const slots = [];
let rlt=results
    // Generate slots based on start time, end time, and duration
    results.forEach((row,i) => {
      const { start_time, end_time } = row;
      const startTime = new Date(start_time);
      const endTime = new Date(end_time);

      while (startTime < endTime) {
        const slot = {
          start_time: startTime.toISOString(),
          end_time: new Date(startTime.getTime() + (60 * 60 * 1000)).toISOString()
        };

        slots.push(slot);

        startTime.setTime(startTime.getTime() + (60 * 60 * 1000));
      }

if(i+1==rlt.length){
    res.status(200).json(slots);
}

    });

    // Send the generated slots as a response
  //  res.status(200).json(slots);
  });
}
