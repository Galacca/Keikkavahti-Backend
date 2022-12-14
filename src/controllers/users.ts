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
            name: user.name,
            id: user.id,
        }

        console.log(userForToken)
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
        .status(201)
        .json("New user added succesfully");

    } catch (error: any) {
        return res
        .status(400)
        .json({ message: error.message, field: 'critical'})
    }
}

const addFriend = async (req: Request, res: Response) => {

    const friendRequester: number = req.body.decodedToken.id
    //Type this for name
    const friendToAdd: string = req.body.friendToAddName

    try {

        const connection = await Connect()
        
        const newFriendExistsQuery = `SELECT EXISTS(SELECT name FROM users WHERE name = ${connection.escape(friendToAdd)}) as TRUTH`
        const newFriendExistsResult = await UserQuery(connection, newFriendExistsQuery)
        if (newFriendExistsResult[0].TRUTH === 0) throw new Error("User named " + friendToAdd + " does not exist.")

        const userIsFriendToAddQuery = `SELECT id FROM users WHERE name = ${connection.escape(friendToAdd)}`
        const userIsFriendToAddResult = await UserQuery(connection, userIsFriendToAddQuery)
        if (userIsFriendToAddResult[0].id === friendRequester) throw new Error("You cannot add yourself as your friend.")
       
        const duplicateFriendQuery = `SELECT EXISTS(SELECT id FROM friends WHERE friendName = ` + connection.escape(friendToAdd) + ` AND userId = ` + connection.escape(friendRequester) +`) as TRUTH`
        const duplicateFriendResult = await UserQuery(connection, duplicateFriendQuery) as any
        if (duplicateFriendResult[0].TRUTH === 1) throw new Error("User named " + friendToAdd + " is already on your friends list.")
        
        const addNewFriendQuery = `INSERT INTO friends (userId, friendName) VALUES (${connection.escape(friendRequester)},${connection.escape(friendToAdd)})`
        console.log(addNewFriendQuery)
        await UserQuery(connection, addNewFriendQuery)
        connection.end
    
    return res
        .status(201)
        .json("New friend added succesfully")
        

    } catch (error: any) {
        return res
        .status(400)
        .json({ message: error.message, field: 'friendToAddName'})
    }
}

export default { login, signup, addFriend };