import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { StockService } from './stock.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	providers: [ StockService ],
	// animations metadata, we define a trigger with two possible states
	animations: [
		trigger('movable', [
			state('fixed', style({})),
			state('roaming', style({
				'background-color': 'green',
				'left': '90%'
			})),
			// define a transition from one state to another, and an associated animation
			transition('* => *', animate('5s 0s ease-in'))
		])
	]
})
export class AppComponent implements OnInit {
	title = 'Stock Dashboard';
	moving: string;
	stockPrices = [];

	constructor(private stockService: StockService) {

	}

	// once the component is created, poll the stock service regularly for fresh prices
	ngOnInit(): void {
		// check for updated prices
		setInterval(() => {this.getStockPrices(); }, 1000);
	}

	moveIt() {
		console.log('on the move');
		// change the state of moving to roaming, activating the trigger and animation
		this.moving = 'roaming';
	}

	getStockPrices() {
		// call out asynchronously to the stock service for prices, then update prices once data is received back
		this.stockService.getStockPrices().then(prices => {
			console.log('just got prices: ', prices);
			this.stockPrices = prices;
		});
	}
}
