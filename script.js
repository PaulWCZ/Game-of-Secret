let numberOfPlayers;
let currentPlayer = 1;
let playerNames = [];
let secrets = [];
let randomSecrets = [];
let guesses = [];

function startGame() {
    numberOfPlayers = document.getElementById("player-count").value;
    if (numberOfPlayers < 2 || numberOfPlayers > 10) {
        alert("Veuillez entrer un nombre valide de joueurs (entre 2 et 10).");
        return;
    }
    document.getElementById("player-count-container").style.display = "none";
    document.getElementById("player-names-container").style.display = "block";
    const playerNamesInputs = document.getElementById("player-names-inputs");
    playerNamesInputs.innerHTML = '';
    for (let i = 0; i < numberOfPlayers; i++) {
        playerNamesInputs.innerHTML += `<label for="player-name-${i}">Nom du joueur ${i + 1} :</label>
                                        <input type="text" id="player-name-${i}"><br>`;
    }
}

function submitPlayerNames() {
    playerNames = [];
    for (let i = 0; i < numberOfPlayers; i++) {
        const playerName = document.getElementById(`player-name-${i}`).value;
        if (playerName === "") {
            alert("Veuillez entrer tous les noms des joueurs.");
            return;
        }
        playerNames.push(playerName);
    }
    document.getElementById("player-names-container").style.display = "none";
    document.getElementById("input-container").style.display = "block";
    document.getElementById("player-instruction").innerText = `${playerNames[currentPlayer - 1]}, entrez votre secret :`;
}

function previousPlayerName() {
    if (currentPlayer > 1) {
        currentPlayer--;
        document.getElementById(`player-name-${currentPlayer - 1}`).focus();
    }
}

function submitSecret() {
    const secret = document.getElementById("player-secret").value;
    if (secret === "") {
        alert("Veuillez entrer un secret.");
        return;
    }
    secrets.push({ player: playerNames[currentPlayer - 1], secret: secret });
    document.getElementById("player-secret").value = "";
    currentPlayer++;
    if (currentPlayer > numberOfPlayers) {
        document.getElementById("start-game-button").style.display = "block";
    } else {
        document.getElementById("player-instruction").innerText = `${playerNames[currentPlayer - 1]}, entrez votre secret :`;
    }
}

function previousSecret() {
    if (currentPlayer > 1) {
        currentPlayer--;
        secrets.pop();
        document.getElementById("player-secret").value = "";
        document.getElementById("player-instruction").innerText = `${playerNames[currentPlayer - 1]}, entrez votre secret :`;
    }
}

function shuffleAndDisplaySecrets() {
    randomSecrets = secrets.slice().sort(() => Math.random() - 0.5);
    document.getElementById("secret-list-container").style.display = "block";
    const secretList = document.getElementById("secret-list");
    secretList.innerHTML = "";

    randomSecrets.forEach((entry, index) => {
        const listItem = document.createElement("li");
        listItem.innerText = `Secret ${index + 1} : ${entry.secret}`;
        secretList.appendChild(listItem);
    });
    document.getElementById("input-container").style.display = "none";
}

function startGuessing() {
    displayGuessInputs();
}

function displayGuessInputs() {
    document.getElementById("guess-container").style.display = "block";
    const guessInstructions = document.getElementById("guess-instructions");
    guessInstructions.innerHTML = `<p>Entrez vos propositions :</p>`;
    randomSecrets.forEach((_, index) => {
        guessInstructions.innerHTML += `<label for="guess-secret-${index}">Secret ${index + 1} :</label>
                                        <select id="guess-secret-${index}">
                                            ${playerNames.map(name => `<option value="${name}">${name}</option>`).join('')}
                                        </select><br>`;
    });
}

function submitGuess() {
    guesses = [];
    randomSecrets.forEach((_, index) => {
        const guessedPlayer = document.getElementById(`guess-secret-${index}`).value;
        guesses.push({ secretIndex: index, guessedPlayer: guessedPlayer });
    });
    calculateResults();
}

function calculateResults() {
    let correctGuesses = 0;
    guesses.forEach(({ secretIndex, guessedPlayer }) => {
        if (guessedPlayer === randomSecrets[secretIndex].player) {
            correctGuesses++;
        }
    });
    document.getElementById("result-container").style.display = "block";
    document.getElementById("result-text").innerText = `Vous avez ${correctGuesses} bonnes propositions !`;

    const resultBar = document.getElementById("result-bar");
    resultBar.style.transition = 'none';
    resultBar.style.width = '100%';
    setTimeout(() => {
        resultBar.style.transition = 'width 7s linear';
        resultBar.style.width = '0%';
    }, 50);
    setTimeout(() => {
        document.getElementById("guess-container").style.display = "none";
        document.getElementById("result-container").style.display = "none";
        resetGuessInputs();
    }, 7000);
}

function resetGuessInputs() {
    randomSecrets.forEach((_, index) => {
        document.getElementById(`guess-secret-${index}`).selectedIndex = 0;
    });
}
