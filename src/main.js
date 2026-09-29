import './style.css'; 

document.addEventListener('DOMContentLoaded', () => {
    
    const botonLanding = document.getElementById('btn-pagar-landing');
    const botonEcommerce = document.getElementById('btn-pagar-ecommerce');

    async function procesarPago(boton, tipoDePlan) {
        boton.preventDefault(); 
        
        const textoOriginal = boton.target.innerText;
        boton.target.innerText = "Conectando con Mercado Pago...";
        boton.target.style.pointerEvents = "none";
        boton.target.style.opacity = "0.7";

        try {
            const respuesta = await fetch('/api/pago', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tipoPlan: tipoDePlan })
            });
            
            const datos = await respuesta.json();

            if (datos.url_pago) {
                window.location.href = datos.url_pago;
            } else {
                alert("Error: No se pudo generar el pago.");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("Hubo un error de conexión con el servidor.");
        } finally {
            boton.target.innerText = textoOriginal;
            boton.target.style.pointerEvents = "auto";
            boton.target.style.opacity = "1";
        }
    }

    if (botonLanding) {
        botonLanding.addEventListener('click', (e) => procesarPago(e, 'landing'));
    }

    if (botonEcommerce) {
        botonEcommerce.addEventListener('click', (e) => procesarPago(e, 'ecommerce'));
    }
});