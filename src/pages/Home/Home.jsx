import React, { useContext, useEffect, useState } from 'react'
import './Home.css'
import { CoinContext } from '../../../context/CoinContext'
import { Link } from 'react-router-dom'

const Home = () => {

  const {allCoin, currency} = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [input, setInput] = useState("");
  const inputHandler = (event) => {
    setInput(event.target.value);
    if(event.target.value ===""){
      setDisplayCoin(allCoin);
    }
  }
  const searchHandler = async (event) => {
    event.preventDefault();
    const coins = await allCoin.filter((item) =>{
      return item.name.toLowerCase().includes(input.toLowerCase());
    });
    setDisplayCoin(coins);
  }
  useEffect(() => {
    setDisplayCoin(allCoin); /*uma cópia do allcoin para mostrar na home */
  }, [allCoin])


  return (
    <div className='home'>
      <div className="hero">
        <h1>Acompanhe o <br /> Ritmo das Moedas Digitais</h1>
        <p>Monitore o preço das suas crypto moedas favoritas em tempo real!</p>
        <form onSubmit={searchHandler}>
          <input  onChange={inputHandler} list='coinlist' value={input} type="text" placeholder="Buscar moeda..." required/>

          <datalist id="coinlist"> {/* sugestão automática ao digitar */}
            {allCoin.map((item, index) => (
              <option key={index} value={item.name} />
            ))}
          </datalist>
          
          <button type="input">Buscar</button>
        </form>
      </div>
      <div className="tabela-crypto">
        <div className="tabela-layout">
          <p style={{ textAlign: 'left' }}>#</p>
          <p>Moedas</p>
          <p>Preço</p>
          <p style={{ textAlign: 'center' }}>Variação 24h</p>
          <p className='marketcap' style={{ textAlign: 'right' }}>Volume de Mercado</p>
        </div>
        {
          displayCoin.slice(0, 10).map((item, index) => (
            <Link to={`/coin/${item.id}`} className="tabela-layout" key={index}>
              <p>{item.market_cap_rank}</p>
              <div>
                <img src={item.image} alt="" />
                <p>{item.name + " - " + item.symbol}</p>
              </div>
              <p>{currency.symbol} {item.current_price.toLocaleString()}</p> {/* toLocaleString() formata o número com vírgulas */}
              <p style={{ textAlign: 'center' }} className={item.price_change_percentage_24h>0?"green":"red"}
              >{Math.floor(item.price_change_percentage_24h*100)/100}%</p> {/* arredondar para 2 casas decimais */}
              <p className= "marketcap" style={{ textAlign: 'right' }}>{currency.symbol} {item.total_volume.toLocaleString()}</p>
            </Link>
          ))
        }
      </div>
    </div>
  )
}

export default Home