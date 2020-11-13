const { performance } = require('perf_hooks');

// GAME CONST
const INVENTORY_SIZE = 10;

// Storage Const
let nbSpellInPlay;
let potionsList = [];

let mySpells = [];
let opSpells = [];

let me = {};
let op = {};
let turn = 0;

// Constante Debug Perf
const DEBUG_MODE = false;
const DEBUG_PERF = true;

// Perf Functions
let perfs = [];

function logPerf() {
	perfs.push(performance.now());

	log(
		DEBUG_PERF,
		'Turn n°: %s, Perf n° %s, time elapse since begin %d, time elapse since last perf %d',
		turn,
		perfs.length - 1,
		perfs[perfs.length - 1] - perfs[0],
		perfs[perfs.length - 1] - perfs[perfs.length - 2]
	);
}

function resetPerf() {
	perfs = [];
	perfs.push(performance.now());
}

// LOG Functions
function log(show, message, ...obj) {
	if (DEBUG_MODE && show) {
		console.error(message, ...obj);
	}
}

function stringify(obj) {
	return JSON.stringify(obj);
}

// Sort Functions

function sortedPotionsByPriceAndByCost(commande, commande1) {
	const result = commande1.price - commande.price;

	if (result === 0) {
		const coutCommande1 = -inventorySize(commande1.cost);
		const coutCommande = -inventorySize(commande.cost);

		return coutCommande - coutCommande1;
	}
	return result;
}

// Math Functions

function sumTable(tableau, tableau1) {
	return tableau.map((ingredient, idx) => {
		return ingredient + tableau1[idx];
	});
}

function inventorySize(inventory) {
	return inventory.reduce((total, ingredient) => total + ingredient, 0);
}

// Filter Functions

// List All possible potion with the inventory avaible
function getCraftablePotions(inventory) {
	return potionsList.filter((potion) => !sumTable(inventory, potion.cost).find((ingredient) => ingredient < 0));
}

/**
 * List all castable spells
 * @param {*} spells Current List of Spells
 * @param {*} inventory Current List of avaible ingredient (only those we want to use)
 * @param {*} nbSlotsReserved Number of reserved slot in inventory ( ingredient we want to save )
 */
function getCastableSpells(spells, inventory, nbSlotsReserved = 0) {
	return spells.filter((sort) => {
		const somme = sumTable(inventory, sort.cost);

		return (
			!somme.find((ingredient) => ingredient < 0) &&
			inventorySize(somme) + nbSlotsReserved <= INVENTORY_SIZE &&
			sort.castable
		);
	});
}

// Games Functions

let listOfSortSinceRest = [];
/**
 * Take a potion in the list ( the first one for eg) and check what is the ingredient to get for this potion
 * Reserved all ingredient we already have
 * do Spells in order ( since the first spells are a chain)
 */
function nextPotionToDo() {
	const commandeTodo = potionsList[0];

	log(true, 'Commande à faire : ', commandeTodo);

	let inventoryMinusCommande = sumTable(me.inventory, commandeTodo.cost);
	let costLeft = inventoryMinusCommande.map((ingredient) => (ingredient < 0 ? ingredient : 0));
	let inventoryLeft = inventoryMinusCommande.map((ingredient) => (ingredient > 0 ? ingredient : 0));
	let numberSlotReserved = inventorySize(
		sumTable(
			costLeft,
			commandeTodo.cost.map((cost) => -cost)
		)
	);
	log(true, 'Cost Left', costLeft);
	log(true, 'commande cost', commandeTodo.cost);
	log(true, 'Slots Reserved :', numberSlotReserved);
	let spellsAvaible = getCastableSpells(mySpells, inventoryLeft, numberSlotReserved).filter(
		(sort) => !listOfSortSinceRest.some((usedSort) => usedSort.id === sort.id)
	);
	if (inventorySize(costLeft) === 0) {
		return `BREW ${commandeTodo.id}`;
	}
	if (spellsAvaible.length === 0) {
		listOfSortSinceRest = [];
		return `REST`;
	}
	return `CAST ${spellsAvaible[0].id}`;
}

/**
 * The BIG play function where update of current state go
 * Log the result
 */
function play() {
	potionsList = potionsList.sort(sortedPotionsByPriceAndByCost);
	const commandesPossibles = getCraftablePotions(me.inventory).sort(sortedPotionsByPriceAndByCost);
	const sortsPossibles = getCastableSpells(mySpells, me.inventory);

	log(false, 'Commandes :', potionsList);
	log(false, 'Commandes Possible :', commandesPossibles);
	log(false, 'Sort :', mySpells);
	log(false, 'Sorts Possibles :', sortsPossibles);

	//console.log('BREW ' + commandes[0].id);

	console.log(nextPotionToDo());
}

// The Game Loop
while (true) {
	resetPerf();
	nbSpellInPlay = parseInt(readline()); // the number of spells and recipes in play

	potionsList = [];
	mySpells = [];
	opSpells = [];

	for (let i = 0; i < nbSpellInPlay; i++) {
		initActions();
	}

	me = readPlayer();
	op = readPlayer();

	play();
	turn++;
}

function readPlayer() {
	var inputs = readline().split(' ');

	const inv0 = parseInt(inputs[0]); // tier-0 ingredients in inventory
	const inv1 = parseInt(inputs[1]);
	const inv2 = parseInt(inputs[2]);
	const inv3 = parseInt(inputs[3]);
	const score = parseInt(inputs[4]);

	const player = { inventory: [inv0, inv1, inv2, inv3], score };

	return player;
}

function initActions() {
	var inputs = readline().split(' ');
	const actionId = parseInt(inputs[0]); // the unique ID of this spell or recipe
	const actionType = inputs[1]; // in the first league: BREW; later: CAST, OPPONENT_CAST, LEARN, BREW
	const delta0 = parseInt(inputs[2]); // tier-0 ingredient change
	const delta1 = parseInt(inputs[3]); // tier-1 ingredient change
	const delta2 = parseInt(inputs[4]); // tier-2 ingredient change
	const delta3 = parseInt(inputs[5]); // tier-3 ingredient change
	const price = parseInt(inputs[6]); // the price in rupees if this is a potion
	const tomeIndex = parseInt(inputs[7]); // in the first two leagues: always 0; later: the index in the tome if this is a tome spell, equal to the read-ahead tax
	const taxCount = parseInt(inputs[8]); // in the first two leagues: always 0; later: the amount of taxed tier-0 ingredients you gain from learning this spell
	const castable = inputs[9] !== '0'; // in the first league: always 0; later: 1 if this is a castable player spell
	const repeatable = inputs[10] !== '0'; // for the first two leagues: always 0; later: 1 if this is a repeatable player spell

	const action = {
		id: actionId,
		actionType,
		cost: [delta0, delta1, delta2, delta3],
		price,
		tomeIndex,
		taxCount,
		castable,
		repeatable,
	};

	switch (action.actionType) {
		case 'BREW':
			potionsList.push(action);
			break;
		case 'CAST':
			mySpells.push(action);
			break;
		case 'OPPONENT_CAST':
			opSpells.push(action);
			break;

		default:
			break;
	}

	return inputs;
}
