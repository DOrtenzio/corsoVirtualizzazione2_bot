require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const SELF_URL = process.env.SELF_URL;
const token = process.env.BOT_TOKEN;

if (!SELF_URL) {
  console.warn('⚠️ Attenzione: SELF_URL non impostato. Il webhook non funzionerà.');
}
if (!token) {
  console.error('❌ BOT_TOKEN non trovato nelle variabili d\'ambiente');
  process.exit(1);
}

// Bot Telegram (senza polling)
const bot = new TelegramBot(token);

// Middleware per accettare JSON da Telegram
app.use(express.json());

// Endpoint per ricevere aggiornamenti dal webhook
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Comandi bot
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
Per altre informazioni, visita il nostro sito web: https://www.nonEsiste:-).it
`);
});

bot.onText(/\/info/, (msg) => {
  bot.sendMessage(msg.chat.id, `
Bot creato durante il corso di Containerizzazione e Deployment.
Versione: 1.0.2
Ambiente: ${process.env.NODE_ENV || 'development'}
`);
});

bot.onText(/\/ciao/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Ciao bro! Come va?');
  bot.sendSticker(msg.chat.id, 'CAACAgUAAxkBAAEF7YxljdEFeRZw4gG1xzq8ToQnKxd0rAACMwADVp29CjocP7P8K_5sNAQ');
});

bot.onText(/\/getToken/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Marameo!');
});

bot.on('message', (msg) => {
  const knownCommands = ['/start', '/help', '/getToken', '/info', '/ciao'];
  if (msg.text && knownCommands.some(cmd => msg.text.startsWith(cmd))) return;
  bot.sendMessage(msg.chat.id, 'Non ho capito. Usa /help per vedere i comandi disponibili.');
});

console.log('🤖 Bot inizializzato con webhook.');

// Route base per test
app.get('/', (req, res) => {
  res.send('✅ Il bot è attivo!');
});

// Avvio del server Express + set del webhook
app.listen(PORT, () => {
  console.log(`🚀 Server in ascolto sulla porta ${PORT}`);

  bot.setWebHook(`${SELF_URL}/bot${token}`)
    .then(() => console.log('🔗 Webhook impostato correttamente!'))
    .catch(err => console.error('❌ Errore nel settaggio del webhook:', err));
});

// Optional: self-ping per Render (opzionale se usi cron o keep-alive)
if (SELF_URL) {
  setInterval(() => {
    console.log('🔁 Self-pinging...');
    fetch(SELF_URL)
      .then(() => console.log('✅ Ping OK'))
      .catch(err => console.error('❌ Errore nel self-ping:', err));
  }, 5 * 60 * 1000); // ogni 5 minuti
}
