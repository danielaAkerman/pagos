import type { NextApiRequest, NextApiResponse } from "next"
import parseToken from "parse-bearer-token"
import { decode } from "lib/jwt"
import { User } from "lib/models/user"
import { authMiddleware } from "lib/middlewares"

async function handler(req: NextApiRequest, res: NextApiResponse, token) {
    console.log(token)

    const user = new User(token.userId)

    await user.pull()

    res.send(user.data)
}



export default authMiddleware(handler)