import type { NextApiRequest, NextApiResponse } from "next"
import { sendCode } from "lib/controllers/auth"
import method from "micro-method-router"
import { authMiddleware } from "lib/middlewares"
import { createPreference } from "lib/mercadopago"
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

    const product = products[productId] // Es como si lo fuera a buscar a DB

    if (!product) {
        res.status(404).json({ message: "El producto no existe" })
    }
    // Por body recibe info relacionada a esta intencion de compra
    // El endpoint chequea entradas y salidas, 
    // Todo lo demás debería ir en Controllers

    const order = await Order.createNewOrder({
        aditionalInfo: req.body,
        productId,
        userId: token.userId,
        status: "pending",
        createdAt: new Date()
    })

    // res.send(order.data)

    const pref = await createPreference({
        "external_reference": order.id,
        "notification_url": "https://payments-vert-iota.vercel.app/api/webhooks/mercadopago",
        "back_urls": {
            "success": "https://www.google.com.ar"
        },

        "items": [
            {
                "title": product.title,
                "description": "Dummy description",
                "picture_url": "http://www.myapp.com/myimage.jpg",
                "category_id": "car_electronics",
                "quantity": 1,
                "currency_id": "ARS",
                "unit_price": product.price
            }
        ],


    })
    res.send({ url: pref.init_point })
}

const handler = method({
    post: postHandler
})

export default authMiddleware(handler)