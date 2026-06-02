import prisma from '../../src/lib/db.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' })
  }

  try {
    const attendee = await prisma.registration.findUnique({
      where: { id },
    })

    if (!attendee) {
      return res.status(404).json({ error: 'No encontrado' })
    }

    res.json({
      name: attendee.name,
      email: attendee.email,
      pass: attendee.pass,
      company: attendee.company,
      role: attendee.role,
      paid: attendee.paid,
    })
  } catch (err) {
    console.error('attendee error:', err)
    res.status(500).json({ error: 'Error al consultar' })
  }
}
