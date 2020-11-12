/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/
let nbSpellInPlay;
let commandes = [];

let sortJoueur1 = [];
let sortJoueur2 = [];

let joueur1 = {};
let joueur2 = {};

// LOG
function log(show, message, ...obj) {
	if (show) {
		console.error(message, ...obj);
	}
}

// Sort

function sortedCommandeByPriceAndByCost(commande, commande1) {
	const result = commande1.price - commande.price;

	if (result === 0) {
		const coutCommande1 = -commande1.cout.reduce((total, coutIngredient) => total + coutIngredient, 0);
		const coutCommande = -commande.cout.reduce((total, coutIngredient) => total + coutIngredient, 0);

		return coutCommande - coutCommande1;
	}
	return result;
}

function getCommandesPossibles() {
	return commandes.filter((commande) => {
		var sum = joueur1.inventaire.map((ingredient, idx) => {
			return ingredient + commande.cout[idx];
		});
		return !sum.find((ingredient) => ingredient < 0);
	});
}

function getSortsPossibles() {
	return sortJoueur1.filter((sort) => {
		var sum = joueur1.inventaire.map((ingredient, idx) => {
			return ingredient + sort.cout[idx];
		});
		return !sum.find((ingredient) => ingredient < 0) && sort.castable;
	});
}

function play() {
	commandes = commandes.sort(sortedCommandeByPriceAndByCost);
	const commandesPossibles = getCommandesPossibles().sort(sortedCommandeByPriceAndByCost);
	const sortsPossibles = getSortsPossibles();

	log(false, 'Commandes :', commandes);
	log(false, 'Commandes Possible :', commandesPossibles);
	log(true, 'Sort :', sortJoueur1);
	log(true, 'Sorts Possibles :', sortsPossibles);

	console.log('BREW ' + commandes[0].id);
}

// game loop
while (true) {
	nbSpellInPlay = parseInt(readline()); // the number of spells and recipes in play

	commandes = [];
	sortJoueur1 = [];
	sortJoueur2 = [];

	for (let i = 0; i < nbSpellInPlay; i++) {
		initActions();
	}

	joueur1 = readPlayer();
	joueur2 = readPlayer();

	// Write an action using console.log()
	// To debug: console.error('Debug messages...');

	// in the first league: BREW <id> | WAIT; later: BREW <id> | CAST <id> [<times>] | LEARN <id> | REST | WAIT

	play();
}

function readPlayer() {
	var inputs = readline().split(' ');

	const inv0 = parseInt(inputs[0]); // tier-0 ingredients in inventory
	const inv1 = parseInt(inputs[1]);
	const inv2 = parseInt(inputs[2]);
	const inv3 = parseInt(inputs[3]);
	const score = parseInt(inputs[4]);

	const player = { inventaire: [inv0, inv1, inv2, inv3], score };

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
		cout: [delta0, delta1, delta2, delta3],
		price,
		tomeIndex,
		taxCount,
		castable,
		repeatable,
	};

	switch (action.actionType) {
		case 'BREW':
			commandes.push(action);
			break;
		case 'CAST':
			sortJoueur1.push(action);
			break;
		case 'OPPONENT_CAST':
			sortJoueur2.push(action);
			break;

		default:
			break;
	}

	return inputs;
}
