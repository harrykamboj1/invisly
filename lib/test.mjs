import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

const results = await yahooFinance.search("AAPL");
const symbol = 'AAPL';
// const quote = await yahooFinance.chart('AAPL');

// const historicalData = await yahooFinance.historical(symbol, {
//     period1: '2023-01-01',
//     period2: '2023-12-31',
//   });
//   console.log(historicalData);
  
  // Get various ticker information
  const history = await yahooFinance.chart(symbol, {
    period1: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    interval: "1d",
  });
console.log(history)
// console.log(`The current price of Apple (AAPL) is ${JSON.stringify(quote)}`);
// console.log(`Search results for TCS.NS: ${JSON.stringify(results)}`);