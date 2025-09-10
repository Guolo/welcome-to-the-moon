
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
seed = urlParams.get('seed')
if (seed == "") {
    seed = Math.random();
}

const rng = new Math.seedrandom(seed);


components = makeComponents(rng);
decks = components["decks"];
discards = components["discards"];

display(decks, discards);



function makeComponents(rng) {
    const deck = Deck.BASE_DECK;
    deck.shuffle(rng);

    const decks = deck.split(3);
    const discards = [new Deck(), new Deck(), new Deck()];

    return {
        "decks": decks,
        "discards": discards
    }
}

function enableButtons(decks, discards) {
    const flipButton = document.getElementById("flip-button");
    const backButtonCentral = document.getElementById("back-button-central");
    const backButtonLeft = document.getElementById("back-button-left");
    const shuffleButton = document.getElementById("shuffle-button");

    if (decks[0].cards.length > 0) { // se il deck non è finito
        flipButton.disabled = false;
        backButtonLeft.style.display = "inline-block"; // mostra BackLeft
        backButtonCentral.style.display = "none"; // nascondi BackCentral
        //backButtonCentral.style.visibility = "hidden"; // nascondi BackCentral con visibility
        shuffleButton.style.display = "none"; // nascondi Shuffle
    } else { //se è finito il deck
        flipButton.disabled = true;
        shuffleButton.style.display = "inline-block"; // mostra Shuffle
        backButtonCentral.style.display = "inline-block"; // mostra BackCentral
        //backButtonCentral.style.visibility = "visible"; // mostra Back centrale con visibility
        backButtonLeft.style.display = "none"; // nascondi BackLeft
    }

    if (discards[0].cards.length > 0) { // eccetto all'inizio, gli scarti sono sempre > 0
        backButtonCentral.disabled = false;
    } else {
        backButtonCentral.disabled = true;
        backButtonLeft.style.display = "none"; // nascondi BackLeft
        shuffleButton.style.display = "inline-block"; // mostra Shuffle
    }
}

function display(decks, discards) {
    var table = document.getElementById('flip-table');

    for (var c = 0; c < 3; c++) {
        card = decks[c].peek()
        if (card) {
            html = card.frontHTML();
        } else {
            html = Card.EMPTY_FRONT_HTML;
        }
        table.rows[0].cells[c].innerHTML = html;
    }

    for (var c = 0; c < 3; c++) {
        card = discards[c].peek()
        if (card) {
            html = card.backHTML();
        } else {
            html = Card.EMPTY_FRONT_HTML;
        }
        table.rows[1].cells[c].innerHTML = html;
    }

    document.getElementById('flip-button').innerHTML = "<i class='fa-solid fa-arrow-turn-down'></i> Flip! ("+decks[0].cards.length+" left)";

    enableButtons(decks, discards);
}

function flip(decks, discards) {
    for (var c = 0; c < 3; c++) {
        card = decks[c].draw();
        if (card) {
            discards[c].push(card);
        }
    }

    display(decks, discards);
}

function unflip(decks, discards) {
    for (var c = 0; c < 3; c++) {
        card = discards[c].draw();
        if (card) {
            decks[c].push(card);
        }
    }

    display(decks, discards);
}


function shuffle(decks, discards) {
    components = makeComponents(rng);

    for (var c = 0; c < 3; c++) {
        delete decks[c].cards;
        delete discards[c].cards;

        decks[c].cards= components["decks"][c].cards;
        discards[c].cards = components["discards"][c].cards;

    }
    display(decks, discards);
}
