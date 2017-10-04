import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Stock, StockService } from './stock.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	providers: [ StockService ],
	// animations metadata, we define a trigger with two possible states
	animations: [
		trigger('trending', [
			// define a down state, with a background style of red to distinguish it from an up state
			state('DOWN', style({
				'background-color': '#e74c3c'
			})),
			// define an up state, with a less jarring green color
			state('UP', style({
				'background-color': '#00bc8c'
			})),
			// when a stock changes from up to down, animate the change over 3 seconds
			transition('UP => DOWN', [
				style({transform: 'translateX(-100%)'}),
				animate(3000)
			]),
			// when a stock changes from down to up, animate vertically, over 200ms
			transition('DOWN => UP', [
				style({transform: 'translateY(-100%)'}),
				animate(200)
			])
		])
	]
})
export class AppComponent implements OnInit {
	stocks: Stock[];

	constructor(private stockService: StockService) {}

	ngOnInit(): void {
		// once the component is created, poll the stock service regularly for fresh prices
		setInterval(() => {
			// call out asynchronously to the stock service for stocks, then update the stocks once data is received back
			this.stockService.getStocks().then(stocks => {
				console.log('just got stocks: ', stocks);
				this.stocks = stocks;
			});
		}, 1000);
	}

	trackBySymbol(index: number, stock: Stock): string { return stock.symbol; }
}
