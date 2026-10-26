export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Método no permitido.' });
  }

  return res.status(200).json({
    ok: true,
    service: 'FitIA API',
    message: 'El backend de Vercel está disponible.'
  });
}
