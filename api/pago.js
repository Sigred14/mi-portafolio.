import { MercadoPagoConfig, Preference } from 'mercadopago';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
       // 
        const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
        const preference = new Preference(client);

        // Armamos el cobro blindado
        const result = await preference.create({
            body: {
                items: [
                    {
                        id: 'plan-landing',
                        title: 'Desarrollo Web - Landing Page (SIGRED)',
                        quantity: 1,
                        unit_price: 50000 
                    }
                ],
                // El truco de WhatsApp: si paga bien, lo mandamos a tu chat
                back_urls: {
                    success: 'https://wa.me/541155972972?text=Hola%20SIGRED!%20Acabo%20de%20pagar%20los%2050.000%20por%20el%20desarrollo.%20Paso%20a%20suscribirme%20al%20mantenimiento.',
                    failure: 'https://sigred-webs-lobby.vercel.app/', 
                    pending: 'https://sigred-webs-lobby.vercel.app/'
                },
                auto_return: 'approved', 
            }
        });

        // Le mandamos el link de pago generado al HTML
        res.status(200).json({ url_pago: result.init_point });
        
    } catch (error) {
        console.error("Error del Backend:", error);
        res.status(500).json({ error: 'Error al generar el pago seguro' });
    }
}