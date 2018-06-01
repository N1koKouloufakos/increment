// DO NOT USE VAR

import Upgrade from './upgrade';
import Automator from './automator';

// Miscellaneous//
let state = {firstSale: false,
  unlockedUpgrades: false,
  autoWaterUnlocked: false,
  marketingUnlocked: false,
  autoSaleUnlocked: false,
  boughtByGoogle: false
};

let resources = {weed: 0,
  joints: 0,
  money: 0};

let multiplier = 1;

const upgrades = {wateringCan: new Upgrade(1.07, 1, 4, 'weed', 'wateringCan', 'Increase Watering Efficiency (+ weed output/click)'),
  hypeMan: new Upgrade(1.1, 1, 10, 'money', 'hypeMan', 'Increase money per sale')};
const automators = {gardener: new Automator(1.15, 0, 25, 'weed', 'gardener', 'Automatically water your plants for you'),
  plug: new Automator(1.1, 0, 200, ['money', 'weed'], 'plug', 'Automatically sells your plants for you')};

window.onload = () => {
  loadGame();
};

// Resource Event Delegation
document.getElementById('resourceContainer').addEventListener('click', () => {
  const target = event.target;

  if (target.id === 'waterPlants') {
    incrementScore('weed', upgrades.wateringCan.amount*multiplier);

    if (!state.firstSale && resources.weed >= 10) {
      state.firstSale = true;
      displaySellFeature();
    }

  } else if (target.id === 'sellWeed') {
    sellWeed();
    if (!state.unlockedUpgrades && resources.money >= 2) {
      state.unlockedUpgrades = true;
      // displayUpgradeFeature();
      displayNewUpgrade(upgrades.wateringCan, 'water');
    }
  }
});

// Upgrade Event Delegation
document.getElementById('upgradeContainer').addEventListener('click', () => {
  const target = event.target;
  if (resources.money > 20 && !state.autoWaterUnlocked) {
    state.autoWaterUnlocked = true;
    displayNewUpgrade(automators.gardener, 'autoWater');
  }

  if (resources.money > 100 && state.autoWaterUnlocked && !state.marketingUnlocked) {
    state.marketingUnlocked = true;
    displayNewUpgrade(upgrades.hypeMan, 'marketing');
  }

  if (resources.money > 100 && state.autoWaterUnlocked && state.marketingUnlocked && !state.autoSaleUnlocked) {
    state.autoSaleUnlocked = true;
    displayNewUpgrade(automators.plug, 'autoSale');
  }

  if (target.id === 'wateringCan') {

    if (resources.money >= upgrades[target.id].cost) {
      decrementScore('money', upgrades[target.id].cost);
      upgrades[target.id].buyNew();
      updatePrice(upgrades[target.id], 'water')
      highlightElementSale('water');
    } else {
      highlightElementNonSale('water');
    }
  } else if (target.id === 'gardener') {
    if (resources.money >= automators[target.id].cost) {
      decrementScore('money', automators[target.id].cost);
      automators[target.id].buyNew();
      updatePrice(automators[target.id], 'autoWater')
      highlightElementSale('autoWater');
    } else {
      highlightElementNonSale('autoWater');
    }
  } else if (target.id === 'hypeMan') {
    if (resources.money >= upgrades[target.id].cost) {
      decrementScore('money', upgrades[target.id].cost);
      upgrades[target.id].buyNew();
      updatePrice(upgrades[target.id], 'marketing')
      highlightElementSale('marketing');
    } else {
      highlightElementNonSale('marketing');
    }
  } else if (target.id === 'plug') {
    if (resources.money >= automators[target.id].cost) {
      decrementScore('money', automators[target.id].cost);
      automators[target.id].buyNew();
      updatePrice(automators[target.id], 'autoSale')
      highlightElementSale('autoSale');
    } else {
      highlightElementNonSale('autoSale');
    }
  }
});

document.getElementById('finalUpgradesContainer').addEventListener('click', () => {
  const target = event.target;

  if (target.id === 'buyPuppet') {
    if (resources.money > 100000) {
      document.getElementById('finalUpgradesContainer').style.backgroundImage = "url('./brainless-puppet.jpg')";
      decrementScore('money', 100000);
    }
  }
  else if (target.id === 'boughtGoogle') {
    if (resources.money > 50000) {
      toggleStyle();
      decrementScore('money', 50000);
      state.boughtByGoogle = true;
    }
  }
});

document.getElementById('saveButton').addEventListener('click', () => {
  saveGame();
});

document.getElementById('newButton').addEventListener('click', () => {
  newGame();
});


function newGame() {
  const save = { };
  try {
    localStorage.setItem('save', JSON.stringify(save));
  } catch (error) {
    console.error(error);
  }
}

function saveGame() {
  const save = {
    resources,
    upgrades,
    state,
  };
  try {
    localStorage.setItem('save', JSON.stringify(save));
  } catch (error) {
    console.error(error);
  }
}

function loadGame() {
  try {
    const savedGame = JSON.parse(localStorage.getItem('save'));
    if (typeof savedGame.resources !== 'undefined') {
      resources = savedGame.resources;
    }
    if (typeof savedGame.upgrades !== 'undefined') {
      for (const key of Object.keys(upgrades)) {
          // Assigns stored values into class instances
        Object.assign(upgrades[key], savedGame.upgrades[key]);
      }
    }
    if (typeof savedGame.state !== 'undefined') {
      state = savedGame.state;
    }
    update();
  } catch (error) {
    console.error(error);
  }

}

function update() {
  // Updates the view based on the state of the game
  document.getElementById('weed').textContent = `${resources.weed} weed`;
  if (state.firstSale) {
    displaySellFeature();
  }

  if (state.unlockedUpgrades) {
    displayNewUpgrade(upgrades.wateringCan, 'water');
  }
  if (state.autoWaterUnlocked) {
    displayNewUpgrade(automators.gardener, 'autoWater');
  }

  if (state.marketingUnlocked) {
    displayNewUpgrade(upgrades.hypeMan, 'marketing');
  }

  if (state.autoSaleUnlocked) {
    displayNewUpgrade(automators.plug, 'autoSale');
  }
}

function displaySellFeature() {
  const sellingFeature = document.createElement('div');
  const sellButton = document.createElement('button');
  const sellText = document.createTextNode('Sell Weed x10');
  const money = document.createElement('div');
  const moneyText = document.createTextNode(`${resources.money} money`);

  money.setAttribute('id', 'money');
  money.appendChild(moneyText);

  sellButton.className = "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent"
  sellButton.setAttribute('id', 'sellWeed');
  sellButton.appendChild(sellText);

  sellingFeature.appendChild(sellButton);
  sellingFeature.appendChild(money);

  document.getElementById('resourceContainer').append(sellingFeature);
}

// function displayUpgradeFeature() {
//   const upgradeFeature = document.getElementById('upgradeContainer');
//   const wateringDiv = document.createElement('div');
//   const wateringCanButton = document.createElement('button');
//   const wateringCanTitle = document.createTextNode('Watering Can');
//   const wateringCanText = document.createTextNode('Increase Watering Efficiency (+ weed output/click)');

//   wateringDiv.setAttribute('id', 'water');

//   wateringCanButton.setAttribute('id', 'wateringCan');
//   wateringCanButton.appendChild(wateringCanTitle);

//   wateringDiv.appendChild(wateringCanButton);
//   wateringDiv.appendChild(wateringCanText);

//   upgradeFeature.append(wateringDiv);
// }

// Generalized function for appending an upgrade to the container
function displayNewUpgrade(upgrade, id) {
  const upgradeFeature = document.getElementById('upgradeContainer');
  const upgradeDiv = upgrade.toNode(id);

  upgradeFeature.append(upgradeDiv);

}

// Increases total of points by specifed amount
function incrementScore(resourceName, amount) {
  resources[resourceName] += amount;
  document.getElementById(resourceName).textContent = `${resources[resourceName]} ${resourceName}`;
}

function decrementScore(resourceName, amount) {
  resources[resourceName] -= amount;
  document.getElementById(resourceName).textContent = `${resources[resourceName]} ${resourceName}`;
}

function incrementResources() {
  if (state.boughtByGoogle) { multiplier = 3}
  if (automators.gardener.amount > 0) {
    incrementScore(automators.gardener.resourceName, automators.gardener.incrementAmount()*multiplier);
  }

  if (automators.plug.amount > 0) {
    incrementScore(automators.plug.incrementResource(), automators.plug.incrementAmount()+upgrades.hypeMan.amount/2);
    decrementScore(automators.plug.decrementResource(), 10 + automators.plug.incrementAmount());
  }

}

function sellWeed() {
  if (resources.weed < 10) { return; }

  incrementScore('money', upgrades.hypeMan.amount*multiplier);
  decrementScore('weed', 10);
}

function updatePrice(upgrade, id) {
  let target = $('#'+id)

  target.replaceWith(upgrade.toNode(id))
}

function highlightElementSale(name) {
  const element = document.getElementById(name);
  element.classList.remove('most-recent-highlight');
  element.classList.remove('insufficient-funds-highlight');

  void element.offsetWidth;

  element.className += ' most-recent-highlight';
}

function highlightElementNonSale(name) {
  const element = document.getElementById(name);
  element.classList.remove('most-recent-highlight');
  element.classList.remove('insufficient-funds-highlight');
  void element.offsetWidth;

  element.className += ' insufficient-funds-highlight';
}

function toggleStyle() {
  addCss('https://fonts.googleapis.com/icon?family=Material+Icons');
  addCss('https://code.getmdl.io/1.3.0/material.blue_grey-amber.min.css');
  addScript('https://code.getmdl.io/1.3.0/material.min.js');

  $('#header').replaceWith(`<!-- Simple header with fixed tabs. -->
<div class="mdl-layout mdl-js-layout mdl-layout--fixed-header
            mdl-layout--fixed-tabs">
  <header class="mdl-layout__header">
    <div class="mdl-layout__header-row">
      <!-- Title -->
      <span class="mdl-layout-title">Weed Empire</span>
    </div>
    <!-- Tabs -->
    <div class="mdl-layout__tab-bar mdl-js-ripple-effect">
    <button id='saveButton' class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">Save</button>
      <button id='newButton' class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored">New Game</button>   
    </div>
  </header>
  
</div>`)
  
}

// Copied from StackOverflow
function addCss(fileName) {

  const head = document.head;
  const link = document.createElement('link');

  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = fileName;

  head.prepend(link);
}

function addScript(src) {
  const script = document.createElement('script');
  script.setAttribute('src', src);
  document.head.appendChild(script);
}

// CHEATER FUNCTIONS
export function cheat(amount) {
  incrementScore('money', amount);
}

export function clearStorage() {
  localStorage.setItem('save', JSON.stringify(''));
}

let timer = 0;
window.setInterval(() => {
  incrementResources();
  if (resources.weed < 0) {
    timer += 1;
  } else {
    timer = 0;
  }

  if (timer >= 50) {
    // you lose
  }
}, 200);
