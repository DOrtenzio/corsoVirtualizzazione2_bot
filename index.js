require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// bot effettivo

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('BOT_TOKEN non trovato nelle variabili d\'ambiente');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Ciao uaglione comme stai. Usa /help per vedere i comandi disponibili.');
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, `
Comandi disponibili:
/start - Avvia il bot
/help - Mostra questo messaggio di aiuto
/info - Informazioni sul bot
/ciao - Ciao bro
/getToken - Ottieni il token
`);
});

bot.onText(/\/info/, (msg) => {
  bot.sendMessage(msg.chat.id, `
Bot creato durante il corso di Containerizzazione e Deployment.
Versione: 1.0.0
Ambiente: ${process.env.NODE_ENV || 'development'}
`);
});

bot.onText(/\/ciao/, (msg) => {
  bot.sendMessage(msg.chat.id, 'CIAOOOOO BROO');
});

bot.onText(/\/getToken/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Suca');
});

bot.on('message', (msg) => {
  const knownCommands = ['/start', '/help', '/getToken', '/info', '/ciao'];
  if (msg.text && knownCommands.some(cmd => msg.text.startsWith(cmd))) return;
  bot.sendMessage(msg.chat.id, 'Non ho capito. Usa /help per vedere i comandi disponibili.');
});

console.log('Bot avviato con successo!');

// Server web express

app.get('/', (req, res) => {
  res.send('Bot è vivo!');
});

app.listen(PORT, () => {
  console.log(`Server web in ascolto sulla porta ${PORT}`);
});

// Self ping
setInterval(() => {
  console.log('Self pinging...');
  fetch(`http://localhost:${PORT}/`)
    .then(res => console.log('Ping OK'))
    .catch(err => console.error('Errore nel self-ping:', err));
}, 5 * 60 * 1000);
