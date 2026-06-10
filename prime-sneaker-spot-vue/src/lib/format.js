export function formatBRL(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatParcelas(price, installments = 10) {
  return `${installments}x de ${formatBRL(price / installments)}`
}

export function discountPercent(oldPrice, price) {
  return Math.round(
    ((oldPrice - price) / oldPrice) * 100
  )
}

export const CATEGORY_LABELS = {
  casual: 'Casual',
  esportivo: 'Esportivo',
  feminino: 'Feminino',
  infantil: 'Infantil',
}