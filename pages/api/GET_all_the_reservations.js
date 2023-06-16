import db from '../connection/db';
import cors from './cors';
export default async function handler(req, res) {

    await cors(req, res);

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

   
    try {


        const selectQuery = " SELECT reservations.reservations_id,reservations.slote_id,reservations.date,reservations.cust_id,reservations.slote_no,reservations.amount_received,slote_settings.car_type,slote_settings.disable_person, slote_settings.start_time,slote_settings.end_time,slote_settings.slot_count,reservations.cust_id FROM reservations INNER JOIN slote_settings ON reservations.slote_id = slote_settings.slote_id  ";
      
        db.query(selectQuery, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Error retrieving data from the table' });
                return;
            }

            function searchBySloteNo(array, sloteNo) {
                return array.filter(obj => obj.slote_no === sloteNo);
            };


            const my_resrvations = [];

            result.forEach((element, i) => {
                let arySlt = [];
                arySlt = generateTimeSlots(element.start_time, element.end_time, 60, element.slot_count)
                my_resrvations.push({
                    reservations_id: element.reservations_id,
                    slote_id: element.slote_id,
                    date: element.date,
                    cust_id: element.cust_id,
                    slote_no: element.slote_no,
                    car_type: element.car_type,
                    my_slote: arySlt[element.slote_no - 1],
                    amount_received:element.amount_received
                })



            });


            function generateTimeSlots(startTime, endTime, interval, slot_count) {
                const slots = [];
                const dataArray = [];
                const rslt2 = []
                let currentTime = startTime;
                let firsttime = startTime
                for (let i = 0; i < slot_count; i++) {
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
                  

                }

                return slots;
            }
           

            res.status(200).json(my_resrvations);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

}





