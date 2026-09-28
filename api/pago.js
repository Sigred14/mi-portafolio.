import { MercadoPagoConfig, Preference } from 'mercadopago';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    // Averiguamos qué plan eligió el usuario
    const { tipoPlan } = req.body;

    let tituloProducto = '';
    let precioFinal = 0;

    // Asignamos el precio seguro del lado del servidor
    if (tipoPlan === 'ecommerce') {
        tituloProducto = 'Desarrollo Web - E-commerce (SIGRED)';
        precioFinal = 150000;
    } else {
        // Por defecto cobra la Landing
        tituloProducto = 'Desarrollo Web - Landing Page (SIGRED)';
        precioFinal = 50000;
    }

    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
    const preference = new Preference(client);

    try {
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

        res.status(200).json({ url_pago: result.init_point });
    } catch (error) {
        console.error("Error en Mercado Pago:", error);
        res.status(500).json({ error: 'Error al generar link de pago' });
    }
}