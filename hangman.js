const fs = require('fs');

// Caricamento dizionario
const dictionary = fs.readFileSync('parole_italiane.txt', 'utf-8').split('\n');

// Stato delle partite: una per ogni chat
const games = {};

// Funzione per ottenere una parola casuale dal dizionario
function getRandomWord() {
  let word;
  do {
    word = dictionary[Math.floor(Math.random() * dictionary.length)].toLowerCase();
  } while (word.length < 4 || word.length > 12 || word.includes('-') || word.includes(' '));
  return word;
}

// Inizia una nuova partita
function startGame(chatId) {
  const word = getRandomWord();
  games[chatId] = {
    word,
    guessed: [],
    attempts: 6,
    revealed: Array(word.length).fill("_"),
  };
  return `Nuova partita iniziata!\n${games[chatId].revealed.join(" ")}\nTentativi rimasti: 6\nRispondi con una lettera per indovinare!`;
}

// Gestione dei tentativi
function guess(chatId, letter) {
  const game = games[chatId];
  if (!game) return "Nessuna partita in corso. Usa /impiccato per iniziare!";

  letter = letter.toLowerCase();
  if (!/^[a-zàèéìòù]$/.test(letter)) {
    return "Per favore, invia UNA sola lettera!";
  }
  if (game.guessed.includes(letter)) {
    return `Hai già provato "${letter}".\n${game.revealed.join(" ")}\nTentativi rimasti: ${game.attempts}`;
  }

  game.guessed.push(letter);

  if (game.word.includes(letter)) {
    for (let i = 0; i < game.word.length; i++) {
      if (game.word[i] === letter) game.revealed[i] = letter;
    }
    if (!game.revealed.includes("_")) {
      const parola = game.word;
      delete games[chatId];
      return `🎉 Hai vinto! La parola era "${parola}".\nUsa /impiccato per giocare ancora.`;
    }
    return `Bravo! "${letter}" è nella parola.\n${game.revealed.join(" ")}\nTentativi rimasti: ${game.attempts}`;
  } else {
    game.attempts--;
    if (game.attempts === 0) {
      const parola = game.word;
      delete games[chatId];
      return `😢 Hai perso! La parola era "${parola}".\nUsa /impiccato per una nuova partita.`;
    }
    return `No! "${letter}" non è nella parola.\n${game.revealed.join(" ")}\nTentativi rimasti: ${game.attempts}`;
  }
}

module.exports = { startGame, guess, games };
