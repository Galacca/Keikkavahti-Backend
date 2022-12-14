import { Request, Response } from "express"
import { Connect, UserQuery } from "../config/mysql"

const getFriendsList = async (req: Request, res: Response) => {
    
    const userId: string = req.body.decodedToken.id

    try {

        const connection = await Connect()
        const friendsQuery = `SELECT friendName FROM friends WHERE userId = ${connection.escape(userId)}`
        //Once again...Need to write a type for this
        const friendsResult = await UserQuery(connection, friendsQuery) as any
        console.log(friendsResult)
        const friendsArray = friendsResult.map((f: { friendName: string }) => f.friendName)

        //Just for debugging
        //if (friendsArray.length === 0) return res.status(200).json({ friends: 'User has no friends' })

        return res
            .status(200)
            .json(friendsArray)

    } catch (error: any) {
        return res
        .status(400)
        .json({ message: error.message, field: 'critical'})
    }

}

export default { getFriendsList };