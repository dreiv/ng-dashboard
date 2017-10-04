import { Injectable } from '@angular/core';

export class Stock {
	constructor(public symbol: StockSymbol,
	            public price: number,
	            public compute: Function,
	            public bought_price: number,
	            public quantity: number,
	            public total_value: number,
	            public trend: StockTrend){}
}

export type StockTrend = 'UP' | 'DOWN';

export const StockTrend = {
	Up: 'UP' as StockTrend,
	Down: 'DOWN' as StockTrend
};

export type StockSymbol = 'GOOG' | 'YHOO' | 'MSFT' | 'AAPL';

export const StockSymbol = {
	Google: 'GOOG' as StockSymbol,
	Yahoo: 'YHOO' as StockSymbol,
	Microsoft: 'MSFT' as StockSymbol,
	Apple: 'AAPL' as StockSymbol
}

@Injectable()
export class StockService {
  static stocks: Stock[];

	/** return the prices of all stocks, the main interface to our service */
	getStocks = (): Promise<Stock[]> => {
		StockService.computePrices(StockService.stocks);
		return Promise.resolve(StockService.stocks);
	};

	/** simulate a stock market price increase, increasing price and setting an up trend */
	static incrementPrice = (stock: Stock): void => {
		const price = Math.min(stock.price + 5, 120);
		// when a stock is in a price increase pattern, its compute property is a function that raises price over time
		Object.assign(stock,{
			compute: StockService.uptrend,
			trend: StockTrend.Up,
			price: price,
			total_value: price * stock.quantity
		});
	};

	/** simulate a stock market price decrease */
	static decreasePrice = (stock): void => {
		const price = Math.max(stock.price - 5, 0);
		// in this case, once a stock price is falling, the stock enters a downtrend, decreasing price over time
		Object.assign(stock,{
			compute: StockService.downtrend,
			trend: StockTrend.Down,
			price: price,
			total_value: price * stock.quantity
		});
	};

	static computePrices = (stocks: Stock[]): void => {
		console.log('computing new prices');
		stocks.forEach((stock: Stock, index: number) => {
			switch(stock.price) {
				case 0: StockService.incrementPrice(stock); break;
				case 120: StockService.decreasePrice(stock); break;
			}

			stocks[index].price = stock.compute.call(null, stock);
		});
	};

	/** an uptrend is defined by a pattern of gentle increases in price by $5 */
	static uptrend = (stock: Stock): number => stock.price + 5;

	/** a downtrend shows price decreasing by 5 with successive ticks */
	static downtrend = (stock: Stock): number => stock.price - 5;

	constructor() {
	  // define the stocks within the service, each has a symbol, price, and other characteristics
	  StockService.stocks = [
		  { symbol: StockSymbol.Google, price: 120, compute: StockService.uptrend, bought_price: 50, quantity: 0, total_value: 21000, trend: StockTrend.Up },
		  { symbol: StockSymbol.Yahoo, price: 100, compute: StockService.uptrend, bought_price: 100, quantity: 0, total_value: 21000, trend: StockTrend.Up },
		  { symbol: StockSymbol.Microsoft, price: 20, compute: StockService.uptrend, bought_price: 120, quantity: 0, total_value: 21000, trend: StockTrend.Up },
		  { symbol: StockSymbol.Apple, price: 200, compute: StockService.uptrend, bought_price: 85, quantity: 20, total_value: 21000, trend: StockTrend.Up },
	  ];

		console.log('Stocks from the stock service ', StockService.stocks.toString());
  }

}
