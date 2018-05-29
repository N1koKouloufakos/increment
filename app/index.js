// DO NOT USE VAR

import Upgrade from './upgrade';
import Automator from './automator';

console.log('Goofle World');

let counter = 0; //
let cursors = 1; //Amount earned by cursor
let workers = 0; //Amount of workers

//Clicker Strengths
let waterCursor = 10;
let moneyCursor = 1;

//Miscellaneous//
let state = {firstSale: false,
             unlockedUpgrades: false,
             autoWaterUnlocked: false,
             marketingUnlocked: false
            }

let resources = {weed: 0,
                 joints: 0,
                 money: 0}

let upgrades = {wateringCan: new Upgrade(1.1, 1, 10, 'weed', 'wateringCan', 'Increase Watering Efficiency (+ weed output/click)'),
                hypeMan: new Upgrade(1.1, 1, 10, 'money', 'hypeMan', 'Increase money per sale')}
let automators = {gardener: new Automator(1.1, 0, 200, 'weed', 'gardener', 'Automatically water your plants for you')}

window.onload = () => {
  loadGame();
}
//Resource Event Delegation
document.getElementById('resourceContainer').addEventListener('click', () => {
  let target = event.target;

  if (target.id == 'waterPlants') {
    console.log(upgrades['wateringCan'].amount)
    incrementScore('weed', upgrades['wateringCan'].amount);
    
    if (!state['firstSale'] && resources['weed'] >= 10) {
      state['firstSale'] = true;
      displaySellFeature();
    }

  } else if (target.id == 'sellWeed') {
    sellWeed();
    if (!state['unlockedUpgrades'] && resources['money'] >= 2) {
      state['unlockedUpgrades'] = true;
      displayUpgradeFeature();
    }
  }
});

//Upgrade Event Delegation
document.getElementById('upgradeContainer').addEventListener('click', () => {
  let target = event.target;
  //console.log(upgrades[target.id].cost)
  if (resources['money'] > 100 && !state['autoWaterUnlocked']) {
    state['autoWaterUnlocked'] = true;
    displayNewUpgrade(automators['gardener'], 'autoWater')
  }

  if (resources['money'] > 100 && state['autoWaterUnlocked'] && !state['marketingUnlocked']) {
    state['marketingUnlocked'] = true;
    displayNewUpgrade(upgrades['hypeMan'], 'marketing')
  }

  if (target.id == 'wateringCan') {
    console.log('howdy')

    if (resources['money'] >= upgrades[target.id].cost) {
      decrementScore('money', upgrades[target.id].cost);
      upgrades[target.id].buyNew();
      highlightElementSale('water');
    } else {
      highlightElementNonSale('water')
    } 
  }
  else if (target.id == 'gardener') {
    if (resources['money'] >= automators[target.id].cost) {
      decrementScore('money', automators[target.id].cost);
      automators[target.id].buyNew();
      highlightElementSale('autoWater');
    } else {
      highlightElementNonSale('autoWater')
    }
  }
  else if (target.id == 'hypeMan') {
    if (resources['money'] >= upgrades[target.id].cost) {
      decrementScore('money', upgrades[target.id].cost);
      upgrades[target.id].buyNew();
      highlightElementSale('marketing');
    } else {
      highlightElementNonSale('marketing')
    }
  }
})

document.getElementById('saveButton').addEventListener('click', () => {
  saveGame();
})

document.getElementById('newButton').addEventListener('click', () => {
  newGame();
})


function newGame() {
  console.log('new game')
  let save = { }
  try {
    localStorage.setItem('save', JSON.stringify(save));
    console.log('started new game successful')
  } 
  catch (error) {
    console.error(error);
  }
}

function saveGame() {
  console.log('starting to save')
  let save = {
    resources: resources,
    upgrades: upgrades,
    state: state
  }
  try {
    localStorage.setItem('save', JSON.stringify(save));
    console.log('save successful')
  } 
  catch (error) {
    console.error(error);
  }
}

function loadGame() {
  console.log('starting to load')
  try {
    const savedGame = JSON.parse(localStorage.getItem('save'));
    if (typeof savedGame.resources !== 'undefined') {
      resources = savedGame.resources;
    }
    if (typeof savedGame.upgrades !== 'undefined'){
        for (let key of Object.keys(upgrades)) {
          //Assigns stored values into class instances
          Object.assign(upgrades[key], savedGame.upgrades[key])
        }
    }
    if (typeof savedGame.state !== 'undefined') {
      state = savedGame.state;
    }
    update();
  }
  catch (error){
    console.error(error);
  }
  
}

function update() {
  let money = document.createElement('money')
  let wateringCan = document.createElement('wateringCan')
  //Updates the view based on the state of the game
  document.getElementById('weed').textContent = resources['weed'] + ' weed';
  console.log(state['firstSale'])
  if (state['firstSale'])  {
    displaySellFeature();
  }

  if (state['unlockedUpgrades']) {
    displayUpgradeFeature();
  }
  console.log(state['autoWaterUnlocked'])
  if (state['autoWaterUnlocked']) {
    displayNewUpgrade(automators['gardener'], 'autoWater');
  }

  if (state['marketingUnlocked']) {
    displayNewUpgrade(upgrades['marketing'], 'marketing');
  }
}

function displaySellFeature() {
  let sellingFeature = document.createElement('div')
  let sellButton = document.createElement('button')
  let sellText = document.createTextNode('Sell Weed x10')
  let money = document.createElement('div')
  let moneyText = document.createTextNode(resources['money']+' money')
  
  money.setAttribute('id', 'money')
  money.appendChild(moneyText)

  sellButton.setAttribute('id', 'sellWeed')
  sellButton.appendChild(sellText)

  sellingFeature.appendChild(sellButton)
  sellingFeature.appendChild(money)

  document.getElementById('resourceContainer').append(sellingFeature)
}

function displayUpgradeFeature() {
  let upgradeFeature = document.getElementById('upgradeContainer')
  let wateringDiv = document.createElement('div')
  let wateringCanButton = document.createElement('button')
  let wateringCanTitle = document.createTextNode('Watering Can')
  let wateringCanText = document.createTextNode('Increase Watering Efficiency (+ weed output/click)')

  wateringDiv.setAttribute('id', 'water')

  wateringCanButton.setAttribute('id', 'wateringCan')
  wateringCanButton.appendChild(wateringCanTitle)

  wateringDiv.appendChild(wateringCanButton)
  wateringDiv.appendChild(wateringCanText)

  upgradeFeature.append(wateringDiv)
}

//Generalized function for appending an upgrade to the container
function displayNewUpgrade(upgrade, id) {
  let upgradeFeature = document.getElementById('upgradeContainer')
  let upgradeDiv = upgrade.toNode(id);
  
  upgradeFeature.append(upgradeDiv)

}

// Increases total of points by specifed amount
function incrementScore(resourceName, amount) {
  console.log(resourceName)
  resources[resourceName] += amount;
  document.getElementById(resourceName).textContent = resources[resourceName] + ' ' + resourceName;
}

function decrementScore(resourceName, amount) {
  console.log(resourceName)
  resources[resourceName] -= amount;
  document.getElementById(resourceName).textContent = resources[resourceName] + ' ' + resourceName;
}

function incrementResources() {
  if (automators['gardener'].amount > 0) {
    incrementScore(automators['gardener'].resourceName, automators['gardener'].incrementAmount())
  }

}

function sellWeed() {
  console.log(resources['weed'])
  if (resources['weed'] >= 10) {
    incrementScore('money', upgrades['hypeMan'].amount)
    decrementScore('weed', 10)
  }
}

function buyCursor(){
    var cursorCost = Math.floor(10 * Math.pow(1.1,cursors));     //works out the cost of this cursor
    if(counter >= cursorCost){                                   //checks that the player can afford the cursor
        cursors += 1;                                   //increases number of cursors
    	  counter -= cursorCost;                          //removes the counter spent
        document.getElementById('cursors').innerHTML = cursors;  //updates the number of cursors for the user
        document.getElementById('score').innerHTML = counter;  //updates the number of counter for the user
    };
    var nextCost = Math.floor(10 * Math.pow(1.1,cursors));       //works out the cost of the next cursor
    document.getElementById('cursorCost').innerHTML = nextCost;  //updates the cursor cost for the user
};

function buyWorker(){
    var workerCost = Math.floor(10 * Math.pow(1.1,workers));     //works out the cost of this cursor
    if(counter >= workerCost){                                   //checks that the player can afford the cursor
        workers += 1;                                   //increases number of cursors
    	  counter -= workerCost;                          //removes the counter spent
        document.getElementById('workers').innerHTML = workers;  //updates the number of cursors for the user
        document.getElementById('score').innerHTML = counter;  //updates the number of counter for the user
    };
    var nextCost = Math.floor(10 * Math.pow(1.1,workers));       //works out the cost of the next cursor
    document.getElementById('workerCost').innerHTML = nextCost;  //updates the cursor cost for the user
};

function highlightElementSale(name) {
  let element = document.getElementById(name)
  element.className = ''

  void element.offsetWidth;

  element.className = 'most-recent-highlight'
}

function highlightElementNonSale(name) {
  let element = document.getElementById(name)
  element.className = ''
  void element.offsetWidth;

  element.className = 'insufficient-funds-highlight'
}

//CHEATER FUNCTIONS
export function cheat(amount) {
  incrementScore('money', amount);
}

export function clearStorage() {
  localStorage.setItem('save', JSON.stringify(''));
}

window.setInterval(function(){
  incrementResources();
}, 200);
