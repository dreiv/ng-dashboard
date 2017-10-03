import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
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
export class AppComponent {
	title = 'Stock Dashboard';
	moving: string;

	moveIt() {
		console.log('on the move');
		// change the state of moving to roaming, activating the trigger and animation
		this.moving = 'roaming';
	}
}
