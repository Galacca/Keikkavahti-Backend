import { NextFunction, Request, Response } from "express"
import { Connect, UserQuery } from "../config/mysql"
import { LoginSchema, SignUpSchema } from "../schema/UserSchema"
import { ZodIssue }from "zod"
import argon2 from "argon2"
import jwt, { Secret } from 'jsonwebtoken'


const login = async (req: Request, res: Response) => {

    try {
        
        LoginSchema.parse(req.body)
   
    } catch (error: any) {
        return res
        .status(400)
        .json(error.issues.map((issue: ZodIssue) => ({ message: issue.message, field: issue.path.join()})))
    }

    const connection = await Connect()
    const findUserQuery = `SELECT * FROM users WHERE username = ` + connection.escape(req.body.username.toLowerCase()) + ``
    const queriedUser = await UserQuery(connection, findUserQuery)
    //user can end up as undefined, but we catch it early and throw. Still not the best solution? Not sure.
    const user = queriedUser[0]
    connection.end

    try {
        
        if (!user) throw new Error('Username does not exist')
    
    } catch (error: any) {
        return res
        .status(400)
        .json({ message: error.message, field: 'username'})
    }

    try {
        
        const valid = await argon2.verify(user.password, req.body.password)
        if (!valid) throw new Error("Invalid password")
    
    } catch (error: any) {
        return res
        .status(400)
        .json({ message: error.message, field: 'password'})
    }

    try {

        const userForToken = {
            username: user.username,
            id: user.id,
          }
        const token = jwt.sign(userForToken, process.env.TOKEN_SECRET as Secret)

        return res
        .status(200)
        .json({token : token, user : user.username, id : user.id, name : user.name})

    } catch (error: any) {
        return res
        .status(400)
        .json({ message: error.message, field: 'username'})
    }
}

const signup = async (req: Request, res: Response) => {

    try {

        SignUpSchema.parse(req.body)
   
    } catch (error: any) {
        return res
        .status(400)
        .json(error.issues.map((issue: ZodIssue) => ({ message: issue.message, field: issue.path.join()})))
    }
    
    const connection = await Connect()
    const duplicateUserQuery = `SELECT EXISTS(SELECT "username" FROM users WHERE username = ` + connection.escape(req.body.username) + `) as TRUTH`

    try {
    
    //Thinking I should make a different query for boolean queries
    const duplicateUsername = await UserQuery(connection, duplicateUserQuery) as any
    
    if (Object.values(duplicateUsername[0]).includes(1)) throw new Error('Username already exists')

    } catch (error: any) {
        connection.end
        return res
        .status(400)
        .json({ message: error.message, field: 'username'})
    }

    //Check for a duplicate name/handle (the name actually displayed in frontend)
    const duplicateNameQuery = `SELECT EXISTS(SELECT "username" FROM users WHERE name = ` + connection.escape(req.body.name) + `) as TRUTH`

    try {
        
        const duplicateName = await UserQuery(connection, duplicateNameQuery) as any
        if (Object.values(duplicateName[0]).includes(1)) throw new Error('Name/handle already exists')
    
    } catch (error: any) {
        connection.end()
        return res
        .status(400)
        .json({ message: error.message, field: 'name'})
    }


    try {
    
    const hashedPassword = await argon2.hash(req.body.password)
    const hashedEmail = await argon2.hash(req.body.email)
    //Escape the hashed password and email too since it can contain special characters that confuse the query
    const insertNewUserquery = `INSERT INTO users (username, password, name, email) VALUES (${connection.escape(req.body.username.toLowerCase())},${connection.escape(hashedPassword)},${connection.escape(req.body.name)},${connection.escape(hashedEmail)})`
    await UserQuery(connection, insertNewUserquery)
    connection.end()

    return res
        .status(200)
        .json("New user added succesfully");

    } catch (error: any) {
        return res
        .status(400)
        .json({ message: error.message, field: 'critical'})
    }
}

const addFriend = async (req: Request, res: Response) => {

    const friendRequester: string = req.body.decodedToken.id
    const friendToAdd: string = req.body.friendToAddId

    try {

        const connection = await Connect()

        if (friendToAdd === "0" || null || undefined) throw new Error("Invalid friend index")
        
        const friendsQuery = `SELECT friends FROM users WHERE id = ${connection.escape(friendRequester)}`
        //This should have a custom query as it definitely does not return a User
        const friendsResult = await UserQuery(connection, friendsQuery) as any
        let addNewFriendQuery
        
        //The DB initializes new users with a default value of [0]. Reasoning here is that it is by far easier to replace than NULL or "" since I dont have to tell the
        //Entry that it's supposed to be a JSON_ARRAY to begin with...If I do that it also adds the NULL or "" as an element...
        //This does result in a slight annoyance when returning empty friends lists since the list will never truly be empty. 
        //However I cannot think of a better solution, if there even is one.
        //To be fair this is my first time dabbling with JSON entries in SQL so there was bound to be some dumb stuff happening somewhere

        if (friendsResult[0].friends.toString() === "[0]") {

            addNewFriendQuery = `UPDATE users SET friends = JSON_REPLACE(friends, "$[0]", ${connection.escape(friendToAdd)}) WHERE id = ${connection.escape(friendRequester)}`

        } else {

            addNewFriendQuery = `UPDATE users SET friends = JSON_ARRAY_APPEND(friends, "$", ${connection.escape(friendToAdd)}) WHERE id = ${connection.escape(friendRequester)}`

        }
        
        const results = await UserQuery(connection, addNewFriendQuery)
        connection.end
    
    return res
        .status(200)
        .json(results)
        

    } catch (error: any) {
        return res
        .status(400)
        .json({ message: error.message, field: 'critical'})
    }
}

const getFriendsList = async (req: Request, res: Response) => {
    
    const userId: string = req.body.decodedToken.id

    try {

        const connection = await Connect()
        const friendsQuery = `SELECT friends FROM users WHERE id = ${connection.escape(userId)}`
        //Once again...Need to write a type for this
        const friendsResult = await UserQuery(connection, friendsQuery) as any

        if (friendsResult[0].friends.toString() === "[0]") return res.status(200).json({ friends: 'User has no friends' })

        return res
            .status(200)
            .json(friendsResult)

    } catch (error: any) {
        return res
        .status(400)
        .json({ message: error.message, field: 'critical'})
    }

}

export default { login, signup, addFriend, getFriendsList };