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

async function resolveMercadoLivreItemId(link) {
  if (!link) return null

  let url = link.trim()
  const browserHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  }

  // Tentar resolver links curtos
  if (url.includes('meli.la') || url.includes('mercadolibre.com') || url.includes('mercadolivre.com.br')) {
    try {
      const resp = await fetch(url, { redirect: 'follow', headers: browserHeaders, timeout: 5000 })
      if (resp.ok) {
        url = resp.url
      }
    } catch (err) {
      console.error('Failed to resolve short link:', err.message)
    }
  }

  // Padrão 1: MLB123456789 ou ML-123456789
  let m = url.match(/(MLB\d+)/i)
  if (m) return m[1].toUpperCase()

  // Padrão 2: /items/MLB123456789 ou /items/123456789
  m = url.match(/\/items\/([A-Za-z0-9_-]+)/i)
  if (m) {
    const idPart = m[1]
    // Se tem letras no início (tipo MLB), use como está
    if (/^[A-Z]{3}/.test(idPart)) return idPart.toUpperCase()
    // Se é só números, prefixe com MLB (Brasil)
    if (/^\d+$/.test(idPart)) return 'MLB' + idPart
    return idPart
  }

  // Padrão 3: procurar primeira sequência de 6+ dígitos e prefixar
  m = url.match(/(\d{6,})/)
  if (m) return 'MLB' + m[1]

  return null
}

async function fetchMercadoLivrePrice(itemId) {
  const response = await fetch(`https://api.mercadolibre.com/items/${itemId}`)
  if (!response.ok) {
    throw new Error(`Mercado Livre request failed with status ${response.status}`)
  }
  return response.json()
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

app.get('/api/debug/resolve-link/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT mercado_link FROM products WHERE id = ?', [req.params.id])
    if (!rows.length) {
      return res.status(404).json({ message: 'Produto não encontrado.' })
    }

    const mercadoLink = rows[0].mercado_link || ''
    const itemId = await resolveMercadoLivreItemId(mercadoLink)
    
    res.json({
      link: mercadoLink,
      resolvedItemId: itemId,
      status: itemId ? 'success' : 'failed'
    })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao resolver link.' })
  }
})

app.get('/api/products/:id/mercado-price', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT mercado_link FROM products WHERE id = ?', [req.params.id])
    if (!rows.length) {
      return res.status(404).json({ message: 'Produto não encontrado.' })
    }

    const mercadoLink = rows[0].mercado_link || ''
    if (!mercadoLink) {
      return res.status(400).json({ message: 'O produto não possui link do Mercado Livre.' })
    }

    const itemId = await resolveMercadoLivreItemId(mercadoLink)
    if (!itemId) {
      return res.status(400).json({ message: 'Link do Mercado Livre inválido.' })
    }

    const data = await fetchMercadoLivrePrice(itemId)
    res.json({
      price: data.price,
      currency: data.currency_id,
      availableQuantity: data.available_quantity,
      soldQuantity: data.sold_quantity,
      permalink: data.permalink,
    })
  } catch (error) {
    console.error('GET /api/products/:id/mercado-price error:', error)
    res.status(500).json({ message: 'Erro ao buscar preço Mercado Livre.' })
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
    const productPrice = price ? Number(price) : null

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
        productPrice,
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
        productPrice,
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
