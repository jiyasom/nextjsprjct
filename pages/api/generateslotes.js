import db from '../connection/db';// Replace with the actual path to your database configuration
import cors from './cors';
export default async function handler(req, res) {

    await cors(req, res);

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { slote_id, date } = req.body;

    try {
        let rslt = []

        const selectQuery2 = 'SELECT * FROM reservations WHERE slote_id = ? AND date=?';
        const val = [slote_id, date]
        db.query(selectQuery2, val, (err, result2) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Error retrieving data from the table' });
                return;
            }
            rslt = result2;

        });

        const selectQuery = 'SELECT  slote_id,start_time,end_time,slot_count,price  FROM slote_settings  WHERE slote_id = ? ';
        const values = [slote_id]
        db.query(selectQuery, values, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Error retrieving data from the table' });
                return;
            }

            function searchBySloteNo(array, sloteNo) {
                return array.filter(obj => obj.slote_no === sloteNo);
            };

            function generateTimeSlots(startTime, endTime, interval) {
                const slots = [];
                const dataArray = [];
                const rslt2 = []
                let currentTime = startTime;
                let firsttime = startTime
                for (let i = 0; i < result[0].slot_count; i++) {
                    if (i != 0) {
                        firsttime = currentTime;
                    }
                    const [hours, minutes] = currentTime.split(":");
                    const date = new Date();
                    date.setHours(hours);
                    date.setMinutes(minutes);
                    date.setMinutes(date.getMinutes() + interval);
                    currentTime = `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;


                    slots.push(firsttime + " to " + currentTime);
                    if (slots.length == result[0].slot_count) {


                        slots.forEach((element, i) => {
                            let tl = [];
                            tl = searchBySloteNo(rslt, i + 1);

                            dataArray.push({
                                slote: element,
                                slote_no: i + 1,
                                is_reserved: tl.length,
                                price: result[0].price


                            })
                        });

                    }

                }

                return dataArray;
            }
            const startTime = result[0].start_time;
            const endTime = result[0].end_time;
            const interval = 60; // in minutes

            const timeSlots = generateTimeSlots(startTime, endTime, interval);
            console.log(timeSlots);

            res.status(200).json(timeSlots);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

}
