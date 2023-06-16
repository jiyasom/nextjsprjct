





import db from '../connection/db';// Replace with the actual path to your database configuration
import cors from './cors';
export default async function handler(req, res) {

    await cors(req, res);

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { cust_id } = req.body;

    try {


        const selectQuery = " SELECT reservations.reservations_id,reservations.slote_id,reservations.date,reservations.cust_id,reservations.slote_no,reservations.amount_received,slote_settings.car_type,slote_settings.disable_person, slote_settings.start_time,slote_settings.end_time,slote_settings.slot_count FROM reservations INNER JOIN slote_settings ON reservations.slote_id = slote_settings.slote_id WHERE reservations.cust_id = ? ";
        const values = [cust_id]
        db.query(selectQuery, values, (err, result) => {
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
                    // if (slots.length == result[0].slot_count) {


                    //     slots.forEach((element, i) => {
                    //         let tl = [];
                    //         tl = searchBySloteNo(rslt, i + 1);

                    //         dataArray.push({
                    //             slote: element,
                    //             slote_no: i + 1,
                    //             is_reserved: tl.length,
                    //             price: result[0].price


                    //         })
                    //     });

                    // }

                }

                return slots;
            }
            // const startTime = result[0].start_time;
            // const endTime = result[0].end_time;
            // const interval = 60; // in minutes

            // const timeSlots = generateTimeSlots(startTime, endTime, interval);
            // console.log(timeSlots);

            res.status(200).json(my_resrvations);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

}





// SELECT
// R.reservations_id,
// R.slote_id,
// R.date,

// S.slote_id,
// S.car_type,
// S.disable_person,
// S.shade,

// S.slot_count
// FROM reservations R
// INNER JOIN slote_settings S ON reservations.slote_id = slote_settings.slote_id
// WHERE reservations.cust_id = ?
// `