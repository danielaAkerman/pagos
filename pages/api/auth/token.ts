import type { NextApiRequest, NextApiResponse } from "next"
import { Auth } from "lib/auth"
import { User } from "lib/user"
import { findOrCreateAuth } from "lib/controllers/auth"
import { sendCode } from "lib/controllers/auth"
// import { firestore } from "lib/firestore"
import jwt from "jsonwebtoken"
import { generate } from "lib/jwt"


export default async function (req: NextApiRequest, res: NextApiResponse) {
    const { email, code } = req.body
    const auth = await Auth.findByEmailAndCode(email, code)
    if (!auth) {
        res.status(401).send({ message: "Email or code incorrect" })
    }

    const expires = auth.isCodeExpired()
    if (expires) {
        res.status(401).send({ message: "Code expirado" })
    }
    const token = generate({ userId: auth.data.userId })
    res.send({ token })



}

