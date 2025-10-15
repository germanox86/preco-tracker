import { createContext, useEffect, useState } from "react"

export const CoinContext = createContext();

const CoinContextProvider = (props) => {
    const [allCoin, setAllCoin] = useState([]);
    const [currency, setCurrency] = useState({
        name: "usd", symbol: "$"
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAllCoin = async (currencyName = currency.name) => {
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currencyName}`;
        const options = { method: 'GET', headers: { 'x-cg-demo-api-key': 'CG-2ouHbSeADv3Y8Qt2KHQrS1rm' } };

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
            const data = await response.json();
            setAllCoin(data || []);
        } catch (err) {
            console.error(err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAllCoin();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currency])
    const contextValue = {
        allCoin, currency, setCurrency
    };
    
    return (
        <CoinContext.Provider value={contextValue}>
            {props.children}
        </CoinContext.Provider>
    )
}

export default CoinContextProvider;