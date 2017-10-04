import { Injectable } from '@angular/core';

@Injectable()
export class StockService {

  static stocks: any;

	/** return the prices of all stocks, the main interface to our service */
	getStockPrices = () => {
		StockService.computePrices(StockService.stocks);
		return Promise.resolve(StockService.stocks);
	};

	/** simulate a stock market price increase, increasing price and setting an up trend */
	static incrementPrice = (stock, index) => {
		const price = Math.min(stock.price + 5, 120);
		// when a stock is in a price increase pattern,
		// its compute property is a function that raises price over time
		StockService.stocks[index].compute = StockService.uptrend;
		StockService.stocks[index].trend = 'UP';
		StockService.stocks[index].price = price;
	};

	/** simulate a stock market price decrease */
	static decreasePrice = (stock, index) => {
		const price = Math.max(stock.price - 5, 0);
		// in this case, once a stock price is falling, the stock enters a downtrend, decreasing price over time
		StockService.stocks[index].compute = StockService.downtrend;
		StockService.stocks[index].trend = 'DOWN';
		StockService.stocks[index].price = price;
	};

	static computePrices = (input) => {
		console.log('computing new prices');
		input.forEach(function(stock, index) {
			// stocks are range-bound, once they hit a max price, they begin to fall
			if (stock.price >= 120) {
				StockService.decreasePrice(stock, index);
			}
			// likewise, a stock can't fall below 0, at that extremity its price begins to rise
			if (stock.price <= 0) {
				StockService.incrementPrice(stock, index)
			}

			input[index].price = stock.compute.call(null, stock);
		});
		return input;
	};

	/** an uptrend is defined by a pattern of gentle increases in price by $5 */
	static uptrend = (stock) => {
		return stock.price + 5;
	};

	/** a downtrend shows price decreasing by 5 with successive ticks */
	static downtrend = (stock) => {
		return stock.price - 5;
	};


	constructor() {
	  // define the stocks within the service, each has a symbol, price, and other characteristics
	  StockService.stocks = [
		  { symbol: "GOOG", price: 120, compute: StockService.uptrend, bought_price: 50, quantity: 0, total_value: 21000, trend: 'UP' },
		  { symbol: "YHOO", price: 100, compute: StockService.uptrend, bought_price: 100, quantity: 0, total_value: 21000, trend: 'UP' },
		  { symbol: "MSFT", price: 20, compute: StockService.uptrend, bought_price: 120, quantity: 0, total_value: 21000, trend: 'UP' },
		  { symbol: "AAPL", price: 200, compute: StockService.uptrend, bought_price: 85, quantity: 20, total_value: 21000, trend: 'UP' },
	  ];

		console.log("Stocks from the stock service ", StockService.stocks.toString());
  }

}
