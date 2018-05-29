export default class Upgrade {
	
	constructor(base, amount, cost, resourceName, id, description) {
		this.base = base;
		this.amount = amount;
		this.cost = cost;
		//id lets you link the upgrade to a dom element
		this.resourceName = resourceName;
		this.id = id;
		this.description = description;
	}
 
 	buyNew() {
		this.amount += 1;
		this.cost += Math.floor(10 * Math.pow(this.base,this.amount));
		return true;
	}

	toNode(upgradeDivId = '') {
		let upgradeDiv = document.createElement('div');

		let purchaseButton = document.createElement('button')
  	let buttonTitle = document.createTextNode(this.id)
  	let descriptionText = document.createTextNode(this.description)

  	if (upgradeDivId) {
  		upgradeDiv.setAttribute('id', upgradeDivId);
  	}

  	purchaseButton.setAttribute('id', this.id);
  	 purchaseButton.appendChild(buttonTitle);

  	upgradeDiv.appendChild(purchaseButton);
  	upgradeDiv.appendChild(descriptionText);

  	return upgradeDiv;
	}
}