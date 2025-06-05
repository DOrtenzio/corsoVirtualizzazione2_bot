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
  bot.sendPhoto(chatId, 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.lastampa.it%2Fla-zampa%2Fgatti%2F2019%2F08%2F01%2Fnews%2Flui_e_zuu_e_non_esiste_gatto_piu_buffo_di_lui-814456%2F&psig=AOvVaw0fXe4MnU1IbO-e1DJ7f6ra&ust=1749213417700000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCIjf5_2l2o0DFQAAAAAdAAAAABAE');
});

bot.onText(/\/sticker/, (msg) => {
  bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/9e5/06e/9e506e8c-5e59-4b90-8c72-7c6e6d659c3e/2.webp');
});

bot.onText(/\/gif/, (msg) => {
  bot.sendAnimation(chatId, 'https://www.google.com/imgres?q=gatto%20buffo%20gif&imgurl=https%3A%2F%2Fpersbaglio.wordpress.com%2Fwp-content%2Fuploads%2F2013%2F05%2Ffunny_gifs_catsmob_com_02694_002.gif&imgrefurl=https%3A%2F%2Fpersbaglio.wordpress.com%2F2013%2F05%2F03%2Fgatti-gif%2F&docid=hyYcO9PA776mYM&tbnid=2QNOQ9R8aMAq_M&vet=12ahUKEwjP2cWFptqNAxVLgf0HHTX4MoUQM3oECHAQAA..i&w=399&h=224&hcb=2&ved=2ahUKEwjP2cWFptqNAxVLgf0HHTX4MoUQM3oECHAQAA');
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
