import jwt, { Secret } from 'jsonwebtoken'

interface userForTokenType {
    id: number,
    name: string
}

export const signToken = (userForToken: userForTokenType) => {
    const token = jwt.sign(userForToken, process.env.TOKEN_SECRET as Secret)
    console.log(token)
    return token
}