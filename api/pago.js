import { MercadoPagoConfig, Preference } from 'mercadopago';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        if (!process.env.MP_ACCESS_TOKEN) {
            throw new Error("CRÍTICO: No se encontró el MP_ACCESS_TOKEN. Revisa tu archivo .env");
        }

        const cuerpo = req.body || {};
        const tipoPlan = cuerpo.tipoPlan || 'landing';

        let tituloProducto = 'Desarrollo Web - Landing Page (SIGRED)';
        let precioFinal = 50000;

        if (tipoPlan === 'ecommerce') {
            tituloProducto = 'Desarrollo Web - E-commerce (SIGRED)';
            precioFinal = 150000;
        }

        const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items: [
                    {
                        title: tituloProducto,
                        quantity: 1,
                        unit_price: precioFinal,
                        currency_id: 'ARS'
                    }
                ],
                back_urls: {
                    success: 'https://wa.me/541155972972?text=Hola%20SIGRED!%20Acabo%20de%20abonar%20el%20desarrollo.%20¡Empecemos!',
                    failure: '',
                    pending: ''
                },
                auto_return: 'approved'
            }
        });

        return res.status(200).json({ url_pago: result.init_point });
        
    } catch (error) {
        console.error("EL BACKEND FALLÓ:", error.message);
        return res.status(500).json({ 
            error: 'Fallo interno', 
            detalle: error.message 
        });
    }
}