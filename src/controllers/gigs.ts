import { Request, Response } from 'express';
import { Connection } from 'mysql2';
import { Connect, GigQuery, TempQuery } from '../config/mysql';

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

const tagGig = async (req: Request, res: Response) => {

    console.log(req.body)

    const userName: string = req.body.decodedToken.name
    const gigId: number = req.body.gigToTagId
    const operation: string = req.body.operation
    
    try {

        const connection = await Connect()
        const duplicateTagQuery = `SELECT status FROM taggedgigs WHERE gigId = ${connection.escape(gigId)} AND userName = ${connection.escape(userName)}`
        //Deconstruct this
        const isDuplicateTag = await GigQuery(connection, duplicateTagQuery) as any
        let tagQuery
       
        if (isDuplicateTag.length === 0) {

            //Jesus christ help me
            tagQuery = `INSERT into taggedgigs (gigId, userName, status) VALUES (` + connection.escape(gigId) + ',' + connection.escape(userName)  + ',' + connection.escape(operation) + ')'

        } else {
            
            if (isDuplicateTag[0].status === operation) throw new Error('You are already tagged as ' + operation + ' this gig.')

            tagQuery = `UPDATE taggedgigs SET status = ${connection.escape(operation)} WHERE gigId = ${connection.escape(gigId)} AND userName = ${connection.escape(userName)}`
        }
        
        const tagResult = await GigQuery(connection, tagQuery) as any

        return res
            .status(200)
            .json(tagResult)

    } catch (error: any) {
        console.log(error.message)
        return res
        .status(400)
        
        .json({ message: error.message, field: 'critical'})
    }
}

const getUsersTaggedGigs = async (req: Request, res: Response) => { 

    const name: string = req.body.name

    try {

        const connection = await Connect()
        const getTaggedGigsQuery = `SELECT gigId, status FROM taggedgigs WHERE userName = ${connection.escape(name)}`
        const getTaggedGigsResult = await GigQuery(connection, getTaggedGigsQuery) as any
        
        if (getTaggedGigsResult.length !== 0) {

            const mappedResults = getTaggedGigsResult.map((g: { gigId: string; }) => g.gigId)
            const gigDataQuery = `SELECT date, bands, id, venue FROM gigs WHERE id IN (${mappedResults})`
            const gigDataResult = await TempQuery(connection, gigDataQuery)
           
            //Assign the statuses we got earlier to the response object
            getTaggedGigsResult.map((g: { gigId: string, status: string }) => {
                
                const entry = {
                    status: g.status
                }
                
                const index: number = gigDataResult.findIndex(item => item.id === g.gigId)
                Object.assign(gigDataResult[index], entry)
                
            })
           
            return res
            .status(200)
            .json(gigDataResult)
        }
        
        return res
            .status(400)
            .json("User has no tagged gigs")

    } catch (error: any) {
        return res
        .status(400)
        .json({ message: error.message, field: 'critical'})
    }

}

export default { getAllGigs, getGigsByMonth, tagGig, getUsersTaggedGigs };
