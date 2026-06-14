import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import db from './db.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json({ limit: '50mb' }))

function normalizeImagesValue(value) {
  if (!value) return []
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed
      if (parsed) return [parsed]
    } catch {
      return [value]
    }
  }
  return []
}

function buildProduct(row) {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    image: row.image_url,
    images: normalizeImagesValue(row.images),
    price: Number(row.price),
    oldPrice: row.old_price !== null ? Number(row.old_price) : null,
    promocao: Boolean(row.promocao),
    destaque: Boolean(row.destaque),
    badge: row.badge || null,
    active: Boolean(row.active),
    rating: Number(row.rating || 0),
    reviews: Number(row.reviews || 0),
    sales: Number(row.sales || 0),
    installments: Number(row.installments || 1),
    mercadoLink: row.mercado_link || '',
    description: {
      material: row.material || '',
      conforto: row.conforto || '',
      indicacao: row.indicacao || '',
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

async function cleanupTestProducts() {
  try {
    const [result] = await db.query('DELETE FROM products WHERE name = ?', ['Teste-API'])
    if (result.affectedRows > 0) {
      console.log(`Removed ${result.affectedRows} test product(s) from the database.`)
    }
  } catch (error) {
    console.error('Failed to remove test products:', error)
  }
}

app.get('/api/products', async (req, res) => {
  try {
    await cleanupTestProducts()
    const [rows] = await db.query('SELECT * FROM products ORDER BY id ASC')
    res.json(rows.map(buildProduct))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao buscar produtos.' })
  }
})

app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id])
    if (!rows.length) {
      return res.status(404).json({ message: 'Produto não encontrado.' })
    }
    res.json(buildProduct(rows[0]))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao buscar produto.' })
  }
})

app.post('/api/products', async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      image,
      images = [],
      price,
      oldPrice,
      promocao = false,
      destaque = false,
      badge = null,
      active = true,
      rating = 0,
      reviews = 0,
      sales = 0,
      installments = 1,
      mercadoLink = '',
      marketplaceLink = '',
      description = {},
    } = req.body

    const effectiveMercadoLink = mercadoLink || marketplaceLink

    const [result] = await db.query(
      `INSERT INTO products
      (name, brand, category, image_url, images, price, old_price, promocao, destaque, badge, active, rating, reviews, sales, installments, mercado_link, material, conforto, indicacao)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        brand,
        category,
        image,
        JSON.stringify(Array.isArray(images) ? images : [images].filter(Boolean)),
        price,
        oldPrice || null,
        promocao ? 1 : 0,
        destaque ? 1 : 0,
        badge,
        active ? 1 : 0,
        rating || 0,
        reviews || 0,
        sales || 0,
        installments || 1,
        effectiveMercadoLink,
        description.material || '',
        description.conforto || '',
        description.indicacao || '',
      ]
    )

    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [result.insertId])
    res.status(201).json(buildProduct(rows[0]))
  } catch (error) {
    console.error('POST /api/products error:', error)
    res.status(500).json({ message: 'Erro ao cadastrar o produto.', error: error.message })
  }
})

app.put('/api/products/:id', async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      image,
      images = [],
      price,
      oldPrice,
      promocao = false,
      destaque = false,
      badge = null,
      active = true,
      rating = 0,
      reviews = 0,
      sales = 0,
      installments = 1,
      mercadoLink = '',
      description = {},
    } = req.body

    const [result] = await db.query(
      `UPDATE products SET
        name = ?,
        brand = ?,
        category = ?,
        image_url = ?,
        images = ?,
        price = ?,
        old_price = ?,
        promocao = ?,
        destaque = ?,
        badge = ?,
        active = ?,
        rating = ?,
        reviews = ?,
        sales = ?,
        installments = ?,
        mercado_link = ?,
        material = ?,
        conforto = ?,
        indicacao = ?
      WHERE id = ?`,
      [
        name,
        brand,
        category,
        image,
        JSON.stringify(images),
        price,
        oldPrice || null,
        promocao ? 1 : 0,
        destaque ? 1 : 0,
        badge,
        active ? 1 : 0,
        rating || 0,
        reviews || 0,
        sales || 0,
        installments || 1,
        mercadoLink,
        description.material || '',
        description.conforto || '',
        description.indicacao || '',
        req.params.id,
      ]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Produto não encontrado.' })
    }

    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id])
    res.json(buildProduct(rows[0]))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao atualizar o produto.' })
  }
})

app.delete('/api/products/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Produto não encontrado.' })
    }
    res.status(204).end()
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao remover o produto.' })
  }
})

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' })
    }

    const [rows] = await db.query('SELECT * FROM admin_users WHERE email = ?', [email])
    if (!rows.length) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' })
    }

    const user = rows[0]
    let passwordMatch = false
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$')) {
      passwordMatch = await bcrypt.compare(password, user.password)
    } else {
      passwordMatch = password === user.password
    }

    if (!passwordMatch) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' })
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao efetuar login.' })
  }
})

app.listen(port, () => {
  console.log(`Backend rodando em http://localhost:${port}`)
})
