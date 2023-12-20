import type { NextApiRequest, NextApiResponse } from "next"
import { sendCode } from "lib/controllers/auth"
import method from "micro-method-router"
import { authMiddleware } from "lib/middlewares"
import { User } from "lib/models/user"
import { Order } from "lib/models/order"

// mock
const products = {
    1234: {
        title: "Remera Nigeria",
        price: 9999
    }
}
// 

async function postHandler(req: NextApiRequest, res: NextApiResponse, token) {
    // crear la orden en la DB, porq esta orden va a tener un ID

    const { productId } = req.query as any

    if (!products[productId]) {
        res.status(404).json({ message: "El producto no existe" })
    }
    // Por body recibe info relacionada a esta intencion de compra
    // El endpoint chequea entradas y salidas, 
    // Todo lo demás debería ir en Controllers

    const order = Order.createNewOrder({
        aditionalInfo: req.body,
        productId,
        userId: token.userId
    })

    // MINUTO 20:50 APX


    console.log(token)
    const user = new User(token.userId)
    await user.pull()
    res.send(user.data)
}

const handler = method({
    post: postHandler
})

export default authMiddleware(handler)