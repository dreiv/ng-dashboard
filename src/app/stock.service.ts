import { Injectable } from '@angular/core';

export class Stock {
	constructor(public symbol: StockSymbol,
	            public price: number,
	            public compute: Function,
	            public bought_price: number,
	            public quantity: number,
	            public total_value: number,
	            public trend: StockTrend) {}
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
};

@Injectable()
export class StockService {
	/** return the prices of all stocks, the main interface to our service */
	getStocks = (): Promise<Stock[]> => {
		this.computeStocks();
		return Promise.resolve(this.stocks);
	};
	private stocks: Stock[];
	private computeStocks = (): void => {
		this.stocks.forEach((stock: Stock) => {
			switch (stock.price) {
				case 0:
					Object.assign(stock, {
						compute: this.uptrend,
						trend: StockTrend.Up
					});
					break;
				case 120:
					Object.assign(stock, {
						compute: this.downtrend,
						trend: StockTrend.Down
					});
					break;
			}

			stock.price = stock.compute(stock);
			stock.total_value = stock.price * stock.quantity;
		});
	};

	/** an uptrend is defined by a pattern of gentle increases in price by $5 */
	private uptrend = (stock: Stock): number => stock.price + 5;

	/** a downtrend shows price decreasing by 5 with successive ticks */
	private downtrend = (stock: Stock): number => stock.price - 5;

	constructor() {
		// define the stocks within the service, each has a symbol, price, and other characteristics
		this.stocks = [
			{
				symbol: StockSymbol.Google,
				price: 120,
				compute: this.uptrend,
				bought_price: 50,
				quantity: 18,
				total_value: 0,
				trend: StockTrend.Up
			},
			{
				symbol: StockSymbol.Yahoo,
				price: 100,
				compute: this.uptrend,
				bought_price: 100,
				quantity: 5,
				total_value: 0,
				trend: StockTrend.Up
			},
			{
				symbol: StockSymbol.Microsoft,
				price: 20,
				compute: this.uptrend,
				bought_price: 120,
				quantity: 13,
				total_value: 0,
				trend: StockTrend.Up
			},
			{
				symbol: StockSymbol.Apple,
				price: 120,
				compute: this.uptrend,
				bought_price: 85,
				quantity: 20,
				total_value: 0,
				trend: StockTrend.Up
			},
		];

		console.log('Stocks from the stock service ', this.stocks.toString());
	}

}
