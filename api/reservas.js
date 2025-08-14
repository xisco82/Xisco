// api/reservas.js

export default function handler(req, res) {
  if (req.method === 'POST') {
    const reserva = req.body;  // Datos de la reserva enviados desde el frontend
    console.log('Nueva reserva:', reserva); // Se muestra en la consola de Vercel
    res.status(200).json({ mensaje: 'Reserva recibida', reserva });
  } else {
    res.status(405).json({ mensaje: 'Método no permitido' });
  }
}
