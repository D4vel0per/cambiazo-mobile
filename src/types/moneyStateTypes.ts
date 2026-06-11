export type Currency = "VES" | "EUR" | "USD" | "USD_P" | "EUR_P"

export interface MoneyState extends Record<Currency, number> {
    USD: number
    VES: number
    EUR: number
    USD_P: number
    EUR_P: number
}

export interface ApiResponse {
  disclaimer: string
  license: string
  timestamp: number
  base: string
  rates: Record<string, number>
}

export interface APIResponse {
  moneda: string,
  fuente: string,
  nombre: string,
  compra: null,
  venta: null,
  promedio: number
}