import db from './db.js'

async function cleanup() {
  try {
    const [rows] = await db.query("SELECT id, name, brand FROM products WHERE name = ?", ['Teste-API'])
    if (!rows.length) {
      console.log('Nenhum produto de teste encontrado.')
      return
    }
    const ids = rows.map(row => row.id)
    const [result] = await db.query('DELETE FROM products WHERE id IN (?)', [ids])
    console.log(`Produtos deletados: ${result.affectedRows}`, ids)
  } catch (error) {
    console.error('Erro ao limpar produtos de teste:', error)
  } finally {
    await db.end()
  }
}

cleanup()
