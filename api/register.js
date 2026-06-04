import prisma from '../src/lib/db.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, pass, company, role, team } = req.body || {}

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Nombre inválido' })
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Correo inválido' })
  }
  if (!pass || !['full', 'expo', 'stand'].includes(pass)) {
    return res.status(400).json({ error: 'Tipo de entrada inválido' })
  }
  if (pass === 'stand' && (!company || typeof company !== 'string' || !company.trim())) {
    return res.status(400).json({ error: 'Empresa requerida para stand' })
  }
  if (pass !== 'stand' && (!role || typeof role !== 'string' || role.trim().length < 2)) {
    return res.status(400).json({ error: 'Rol inválido' })
  }

  try {
    const reg = await prisma.registration.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        pass,
        company: (company || '').trim(),
        role: (role || '').trim(),
        team: (team || '').trim(),
      },
    })

    res.status(201).json({ ticketId: reg.id })
  } catch (err) {
    if (err?.code === 'P2002') {
      return res.status(409).json({ error: 'Este correo ya está registrado' })
    }
    console.error('register error:', err)
    res.status(500).json({ error: 'Error al registrar' })
  }
}
