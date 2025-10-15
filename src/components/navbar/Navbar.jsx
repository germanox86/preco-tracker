import React, { useContext } from 'react'
import './navbar.css'
import logo from '../../assets/logocpt.png'
import arrow_icon from '../../assets/arrowicon.png'
import { CoinContext } from '../../../context/CoinContext'
import { Link } from 'react-router-dom'


const Navbar = () => {

  const {setCurrency} = useContext(CoinContext);

  const currencyHandler = (event) => {
    switch(event.target.value) {
      case "usd":
        setCurrency({name: "usd", symbol: "$"});
        break;
      case "eur":
        setCurrency({name: "eur", symbol: "€"});
        break;
      case "brl":
        setCurrency({name: "brl", symbol: "R$"});
        break;
      default:
        setCurrency({name: "usd", symbol: "$"});
    }
  }

  return (
    <div className='navbar'>
       <Link to="/"><img src={logo} alt="" className='logo1' /></Link>

      <ul>
        <li><Link to="/">Início</Link></li>
        <li><Link to="/about">Sobre mim</Link></li>
      </ul>
        <div className="nav-right">
            <select onChange={currencyHandler}>
               <option value="usd">USD</option> 
               <option value="eur">EUR</option>
               <option value="brl">BRL</option>
            </select>
            <a href="https://github.com/germanox86">
              <button><img src={arrow_icon} alt="" />  GitHub</button>
            </a>
        </div>
    </div>
  )
}

export default Navbar