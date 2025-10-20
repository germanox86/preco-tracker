import React, { useEffect, useState, useContext } from 'react';
import './Coin.css';
import { useParams } from 'react-router-dom';
import { CoinContext } from '../../../context/CoinContext';
import Linechart from '../../components/linechart/Linechart';

const API_BASE = process.env.REACT_APP_API_BASE || 'https://preco-tracker-api.onrender.com';

const Coin = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const { currency } = useContext(CoinContext);

  const fetchCoinData = async (signal) => {
    if (!coinId) return;
    const url = `${API_BASE}/api/coin/${coinId}`;

    try {
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();
      setCoinData(data);
    } catch (err) {
      if (err.name !== 'AbortError') console.error('fetchCoinData error:', err);
    }
  };

  const fetchHistoricalData = async (signal) => {
    if (!coinId) return;
    const vs = currency?.name || 'usd';
    const url = `${API_BASE}/api/coin/${coinId}/market_chart?vs_currency=${vs}&days=10&interval=daily`;

    try {
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();
      setHistoricalData(data);
    } catch (err) {
      if (err.name !== 'AbortError') console.error('fetchHistoricalData error:', err);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchCoinData(controller.signal);
    if (currency?.name) fetchHistoricalData(controller.signal);
    return () => controller.abort();
  }, [coinId, currency]);

  if (!coinData || !historicalData) {
    return (
      <div className="spinner">
        <div className="spin"></div>
      </div>
    );
  }

  const marketData = coinData.market_data || {};
  const curName = currency?.name || 'usd';
  const curSymbol = currency?.symbol || '$';

  const format = (value) => {
    if (value == null) return '-';
    try {
      return Number(value).toLocaleString();
    } catch {
      return value;
    }
  };

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
          <li>{"#"}{coinData.market_cap_rank ?? '-'}</li>
        </ul>
        <ul>
          <li>Preço Atual</li>
          <li>{curSymbol} {format(marketData.current_price?.[curName])}</li>
        </ul>
        <ul>
          <li>Maior valor em 24H</li>
          <li>{curSymbol} {format(marketData.high_24h?.[curName])}</li>
        </ul>
        <ul>
          <li>Menor valor em 24H</li>
          <li>{curSymbol} {format(marketData.low_24h?.[curName])}</li>
        </ul>
        <ul>
          <li>Volume de Mercado</li>
          <li>{curSymbol} {format(marketData.market_cap?.[curName])}</li>
        </ul>
      </div>
    </div>
  );
};

export default Coin;
