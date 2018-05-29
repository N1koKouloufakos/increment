import Upgrade from './upgrade';

export default class Automator extends Upgrade {
	
	
	constructor(base, amount, cost, resourceName, id, description) {
		super(base, amount, cost, resourceName, id, description)
		this.excessIncrement = 0;
	}

	doJob(callback) {
		callback();
	}

	incrementAmount() {
		this.excesssIncrement += (1 * Math.pow(this.base-0.02,this.amount))-Math.floor(1 * Math.pow(this.base-0.02,this.amount))
		console.log((1 * Math.pow(this.base-0.02,this.amount))-Math.floor(1 * Math.pow(this.base-0.02,this.amount)));
		//The same equation as the cost increase of the upgrade, but with
		// a lower base for a shallower growth curve and a starting value of 1. 
		if (this.excesssIncrement > 1) {
			this.excesssIncrement -= 1;
			return Math.floor(1 * Math.pow(this.base-0.02,this.amount)) + 1;
		} else {
			return Math.floor(1 * Math.pow(this.base-0.02,this.amount));
		}
		
	}
}