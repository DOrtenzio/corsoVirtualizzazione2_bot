require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Ottieni il token dalle variabili d'ambiente
const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('BOT_TOKEN non trovato nelle variabili d\'ambiente');
  process.exit(1);
}

// Crea una nuova istanza del bot
const bot = new TelegramBot(token, { polling: true });

// Gestisci il comando /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Ciao! Sono il tuo bot Telegram. Usa /help per vedere i comandi disponibili.');
});

// Gestisci il comando /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `
Comandi disponibili:
/start - Avvia il bot
/help - Mostra questo messaggio di aiuto
/info - Informazioni sul bot
`);
});

// Gestisci il comando /info
bot.onText(/\/info/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `
Bot creato durante il corso di Containerizzazione e Deployment.
Versione: 1.0.0
Ambiente: ${process.env.NODE_ENV || 'development'}
`);
});

// Gestisci messaggi non riconosciuti
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  
  // Ignora i comandi che abbiamo già gestito
  if (msg.text && (msg.text.startsWith('/start') || 
                   msg.text.startsWith('/help') || 
                   msg.text.startsWith('/info'))) {
    return;
  }
  
  bot.sendMessage(chatId, 'Non ho capito. Usa /help per vedere i comandi disponibili.');
});

console.log('Bot avviato con successo!');