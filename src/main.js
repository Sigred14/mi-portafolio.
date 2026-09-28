import './style.css'; 

console.log("🚀 Iniciando sistema de JS...");

document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ El HTML cargó correctamente.");
    
    // Buscamos el botón en el HTML por su ID
    const botonLanding = document.getElementById('btn-comprar-landing');

    if (botonLanding) {
        console.log("✅ ¡Botón Landing encontrado con éxito!");
        
        botonLanding.addEventListener('click', async (e) => {
            e.preventDefault(); // Evitamos que la página salte hacia arriba
            console.log("🖱️ ¡Clic detectado! Avisando al Backend...");
            
            // Efecto visual de carga en el botón
            const textoOriginal = botonLanding.innerText;
            botonLanding.innerText = "Generando cobro seguro...";
            botonLanding.style.pointerEvents = "none";
            botonLanding.style.opacity = "0.7";

            try {
                // Tocamos el timbre de nuestro Backend seguro
                const respuesta = await fetch('/api/pago', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                console.log("📩 Respuesta del Backend status:", respuesta.status);
                
                const datos = await respuesta.json();
                console.log("📦 Datos recibidos del Backend:", datos);

                // Si el Backend nos devuelve el link, lo abrimos
                if (datos.url_pago) {
                    console.log("🔗 Redirigiendo a Mercado Pago...");
                    window.location.href = datos.url_pago;
                } else {
                    console.error("❌ El Backend no devolvió la URL:", datos);
                    alert("Error: No se pudo generar el pago.");
                }
            } catch (error) {
                console.error("❌ Error de conexión:", error);
                alert("Hubo un error de conexión con el servidor.");
            } finally {
                // Restauramos el botón a su estado normal
                botonLanding.innerText = textoOriginal;
                botonLanding.style.pointerEvents = "auto";
                botonLanding.style.opacity = "1";
            }
        });
    } else {
        console.error("❌ ERROR CRÍTICO: No encontré el botón en el HTML.");
    }
});