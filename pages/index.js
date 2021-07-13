import Head from 'next/head'
import styles from '../styles/Home.module.css'
import CoinGecko from 'coingecko-api'

const coinGeckoClient = new CoinGecko();


export default function Home(props) {
  const { data } = props.result;
  console.log(data)

  const formatPercent = number =>
    `${new Number(number).toFixed(2)}%`

  const formatDollar = (number, maximumSignificantDigits) =>
    new Intl.NumberFormat(
      'en-US',
      {
        style: 'currency',
        currency: 'usd',
        maximumSignificantDigits
      })
      .format(number);

  return (
    <div className={styles.container}>
      <Head>
        <title>CryptoBitPunk Coin Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>CryptoBitpunk Coin Tracker</h1>
      <h6>Top 100 powered by CoinGecko API, Next js, Vercel, developed by non-fungi.com</h6>

      <table className='table bg-dark text-info'>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>24hr +/- %</th>
            <th>24hr +/- $</th>
            <th>Current Price</th>
            <th>All Time High</th>
            <th>Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {data.map(coin => (
            <tr key={coin.id}>
              <td>
                <img
                  src={coin.image}
                  style={{ width: 25, height: 25, marginRight: 10 }}
                />
                {coin.symbol.toUpperCase()}</td>
              <td>
                <span
                  className={coin.price_change_percentage_24h > 0 ? (
                    'text-success'
                  ) : 'text-danger'}
                >
                  {formatPercent(coin.price_change_percentage_24h)}
                </span>
              </td>
              <td>
                <span
                  className={coin.price_change_24h > 0 ? (
                    'text-success'
                  ) : 'text-danger'}
                >
                  {formatDollar(coin.price_change_24h)}
                </span>
              </td>
              <td>{formatDollar(coin.current_price, 20)}</td>
              <td>{formatDollar(coin.ath, 12)}</td>
              <td>{formatDollar(coin.market_cap, 12)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1>CryptoBitpunk</h1>
      <h6>Realtime updated stats powered by CoinGecko API, Next js, Vercel, developed by non-fungi.com</h6>

    </div>
  )
}

export async function getServerSideProps(context) {
  const params = {
    order: CoinGecko.ORDER.MARKET_CAP_DESC
  }
  const result = await coinGeckoClient.coins.markets({ params });
  return {
    props: {
      result
    }
  };
}