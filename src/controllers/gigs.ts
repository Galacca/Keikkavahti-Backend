import { Request, Response } from 'express';
import { Connect, GigQuery } from '../config/mysql';

const currentDate = new Date().toISOString()

const getAllGigs = async ( req: Request, res: Response ) => {

    Connect()
        .then((connection) => {

            const query = `SELECT * FROM gigs WHERE date > "${currentDate}" ORDER BY date ASC`;

            GigQuery(connection, query)
                .then((results) => {
                    return res
                    .status(200)
                    .json({
                        results
                });
                })
                .catch((error) => {
                    return res
                    .status(400)
                    .json({ message: "Query failure", field: 'critical'})
                })
                .finally(() => {
                    connection.end();
                });
        })
        .catch((error) => {
            return res
            .status(400)
            .json({ message: "Server status failure", field: 'critical'})
        });
};

const getGigsByMonth = async (req: Request, res: Response ) => {

    const highRange: string = req.body.year + "-".concat(req.body.month).concat("-32")
    const lowRange: string = req.body.year + "-".concat(req.body.month).concat("-0")

    Connect()
        .then((connection) => {

            const query = `SELECT * FROM gigs WHERE date < ` + connection.escape(highRange) + ` AND date > ` + connection.escape(lowRange) + ` ORDER BY date ASC`

            GigQuery(connection, query)
                .then((results) => {
                    return res
                    .status(200)
                    .json({
                        results
                });
                })
                .catch((error) => {
                    return res
                    .status(400)
                    .json({ message: "Query failure", field: 'critical'})
                })
                .finally(() => {
                    connection.end();
                });
        })
        .catch((error) => {
            return res
            .status(400)
            .json({ message: "Server failure", field: 'critical'})
        });
}
export default { getAllGigs, getGigsByMonth };