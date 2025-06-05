require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const SELF_URL = process.env.SELF_URL;
const token = process.env.BOT_TOKEN;
//Controllo dell'impostazione delle variabili d'ambiente
if (!SELF_URL) {
  console.warn('Attenzione: SELF_URL non impostato.');
}
if (!token) {
  console.error('BOT_TOKEN non trovato nelle variabili d\'ambiente');
  process.exit(1);
}

// Bot Telegram
const bot = new TelegramBot(token);
app.use(express.json());
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
/photos - Ottieni una foto
/gif - Ottieni una gif
/sticker - Ottieni uno sticker
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
});

bot.onText(/\/getToken/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Marameo!');
});

bot.onText(/\/photos/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendPhoto(chatId, 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg');
});

bot.onText(/\/sticker/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/9e5/06e/9e506e8c-5e59-4b90-8c72-7c6e6d659c3e/2.webp');
});

bot.onText(/\/gif/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendAnimation(chatId, 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif');
});

bot.on('message', (msg) => {
  const knownCommands = ['/start', '/help', '/getToken', '/info', '/ciao', '/photos', '/sticker', '/gif'];
  if (msg.text && knownCommands.some(cmd => msg.text.startsWith(cmd))) return;
  bot.sendMessage(msg.chat.id, 'Non ho capito. Usa /help per vedere i comandi disponibili.');
});

/* Altri comandi utili
bot.sendPhoto(chatId, 'percorso/o/url/della/foto.jpg');
bot.sendSticker(chatId, 'file_id_o_url_dello_sticker');
bot.sendDocument(chatId, 'percorso/o/url/del/documento.pdf');
bot.sendAnimation(chatId, 'percorso/o/url/della/gif.gif');
bot.sendAudio(chatId, 'percorso/o/url/dell/audio.mp3');
bot.sendVoice(chatId, 'percorso/o/url/della/voce.ogg');
*/

console.log('Bot inizializzato con successo.');

// Route base per test
app.get('/', (req, res) => {
  res.send('✅ Il bot è attivo!');
});

// Avvio del server Express + set del webhook
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);

  bot.setWebHook(`${SELF_URL}/bot${token}`)
    .then(() => console.log('Webhook impostato correttamente!'))
    .catch(err => console.error('Errore nel settaggio del webhook:', err));
});

if (SELF_URL) {
  setInterval(() => {
    console.log('🔁 Self-pinging...');
    fetch(SELF_URL)
      .then(() => console.log('✅ Ping OK'))
      .catch(err => console.error('❌ Errore nel self-ping:', err));
  }, 5 * 60 * 1000); // ogni 5 minuti
}
