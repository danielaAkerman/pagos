import type { NextApiRequest, NextApiResponse } from "next"
import { getMerchantOrder } from "lib/mercadopago"

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const { id, topic } = req.query

    if (topic == "merchant_order") {
        const order = await getMerchantOrder(id)
        if (order.order_status == "paid") {
            const orderId = order.external_reference
            console.log({orderId})
            // Busco en DB esta orden, y los datos del comprador, para enviarle un mail
            // Cambiar estado en la orden interna (esto ya esta pago)
            // sendEmail()
        }
    }


    res.send("ok")
}