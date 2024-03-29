import Head from 'next/head'
import styles from '../styles/Home.module.css'
import CoinGecko from 'coingecko-api'
const coinGeckoClient = new CoinGecko();

// thanks to eattheblocks on youtube

export default function Home(props) {
  const { data } = props.result

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

    <>
      <div className={styles.container}>
        <Head>
          <title>CryptoBitpunk Coin Tracker 🕵️‍♂️</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <a href="/" className='text-decoration-none'><h1>🦎 CryptoBitpunk Coin Tracker 🕵️‍♂️</h1></a>
        <h6><a href="https://www.kucoin.com/ucenter/signup?rcode=rJXT7LT" target="_blank"><button className='btn btn-sm btn-info'>KuCoin</button></a> <a href="https://www.coingecko.com/en"><button className='btn btn-sm btn-info'>Coingecko</button></a> <a href="https://www.coinbase.com/join/horth_0k" target="_blank"><button className='btn btn-sm btn-info'>Coinbase</button></a> <a href="https://join.robinhood.com/justinh7759"><button className='btn btn-sm btn-info'>Robinhood</button></a> <a href="/exchanges"><button className='btn btn-sm btn-info'>Exchanges</button></a></h6>

        <table className='table table-dark table-striped text-info table-sortable'>
          <thead>
            <tr>
              <th>Crypto Symbol🔀</th>
              <th>Name🤷‍♂️</th>
              <th>24 hour %🔀</th>
              <th>Current💲</th>
              <th>ATH⚡</th>
              <th>🧢 Rank🔥</th>
            </tr>
          </thead>
          <tbody>
            {data.map(coin => (
              <tr key={coin.id}>
                <td>
                  <img
                    src={coin.image}
                    style={{ width: 25, height: 25, marginRight: 10 }} />
                  {coin.symbol.toUpperCase()}</td>
                <td>{coin.name}</td>
                <td>
                  <span
                    className={coin.price_change_percentage_24h > 0 ? (
                      'text-success'
                    ) : 'text-danger'}
                  >
                    {formatPercent(coin.price_change_percentage_24h)}
                  </span>
                </td>
                <td>{formatDollar(coin.current_price, 20)}</td>
                <td>{formatDollar(coin.ath, 6)}</td>
                <td>{coin.market_cap_rank}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h1>CryptoBitpunk</h1>
        <h5><a href="https://www.kucoin.com/ucenter/signup?rcode=rJXT7LT" target="_blank"><button className='btn btn-sm btn-info'>KuCoin</button></a> <a href="https://join.robinhood.com/justinh7759"><button className='btn btn-sm btn-info'>Robinhood</button></a> <a href="https://www.coinbase.com/join/horth_0k" target="_blank"><button className='btn btn-sm btn-info'>Coinbase</button></a> <a href="/exchanges"><button className='btn btn-sm btn-info'>Exchanges</button></a></h5>
        <h6>Developed by <a href="https://non-fungi.com">non-fungi.com</a> Coingecko API w <a href="https://youtu.be/klFeYge2G0I">EatTheBlocks</a> Crypto Dashboard <a href="https://non-fungi.com/posts/donate" target="_blank">Donate</a></h6> <a href="#">🔼Top🔼</a>

      </div>
    </>
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

/**
 *  Sorts a HTML table thanks to dcode on youtube
 * 
 * @param {HTMLTableElement} table to sort
 * @param {number} the index of the column to sort
 * @param {boolean} asc sets the ascending order
 */

function sortTableByColumn(table, column, asc = true) {
  const dirModifier = asc ? -1 : 1;
  const tBody = table.tBodies[0];
  const rows = Array.from(tBody.querySelectorAll("tr"));

  // sort each row
  const sortedRows = rows.sort((a, b) => {
    let aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
    let bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();

    if (!isNaN(parseFloat(aColText)) && !isNaN(parseFloat(bColText))) {
      aColText = parseFloat(aColText)
      bColText = parseFloat(bColText)
    }
    return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
  });

  // Remove all existing TRs
  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild)
  }

  // Re-add the newly sorted rows
  tBody.append(...sortedRows);

  // remember how the column currently sorted
  table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
  table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-asc", asc);
  table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-desc", !asc);



};

// wrapped in this if to prevent server side document build fail

if (typeof window === 'object') {
  document.querySelectorAll(".table-sortable th").forEach(headerCell => {
    headerCell.addEventListener("click", () => {
      const tableElement = headerCell.closest('.table');
      const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
      const currentIsAscending = headerCell.classList.contains("th-sort-asc");

      sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
    });
  })
}
