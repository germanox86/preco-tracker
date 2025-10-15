import React, { useEffect, useState, useContext } from 'react'
import './Coin.css'
import { useParams } from 'react-router-dom'
import { CoinContext } from '../../../context/CoinContext'
import Linechart from '../../components/linechart/Linechart'

const Coin = () => {
  const { coinId } = useParams()
  const [coinData, setCoinData] = useState(null)
  const [historicalData, setHistoricalData] = useState(null)
  const { currency } = useContext(CoinContext)

  const fetchCoinData = async (signal) => {
    if (!coinId) return
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}`
    const options = { method: 'GET', headers: { 'x-cg-demo-api-key': 'CG-2ouHbSeADv3Y8Qt2KHQrS1rm' }, signal }

    try {
      const res = await fetch(url, options)
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
      const data = await res.json()
      setCoinData(data)
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err)
    }
  }

  const fetchHistoricalData = async (signal) => {
    if (!coinId) return
    const vs = currency?.name || 'usd'
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${vs}&days=10&interval=daily`
    const options = { method: 'GET', headers: { 'x-cg-demo-api-key': 'CG-2ouHbSeADv3Y8Qt2KHQrS1rm' }, signal }

    try {
      const res = await fetch(url, options)
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
      const data = await res.json()
      setHistoricalData(data)
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchCoinData(controller.signal)
    // call historical only when currency is defined
    if (currency?.name) fetchHistoricalData(controller.signal)
    return () => controller.abort()
  }, [coinId, currency])

  if (coinData && historicalData) {
    return (
      <div className="coin">
        <div className="coin-name">
          <img src={coinData?.image?.large} alt={coinData?.name || ''} />
          <p><b>{coinData?.name} ({coinData?.symbol?.toUpperCase()})</b></p>
        </div>
        <div className="coin-chart">
          <Linechart historicalData={historicalData} />
        </div>
        <div className="coin-info">
          <ul>
            <li>Ranking de Mercado</li>
            <li>{"#"}{coinData.market_cap_rank}</li>
          </ul>
          <ul>
            <li>Preço Atual</li>
            <li>{currency.symbol} {coinData.market_data.current_price[currency.name].toLocaleString()}</li>
          </ul>
          <ul>
            <li>Maior valor em 24H</li>
            <li>{currency.symbol} {coinData.market_data.high_24h[currency.name].toLocaleString()}</li>
          </ul>
          <ul>
            <li>Menor valor em 24H</li>
            <li>{currency.symbol} {coinData.market_data.low_24h[currency.name].toLocaleString()}</li>
          </ul>
          <ul>
            <li>Volume de Mercado</li>
            <li>{currency.symbol} {coinData.market_data.market_cap[currency.name].toLocaleString()}</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="spinner">
      <div className="spin"></div>
    </div>
  )
}

export default Coin