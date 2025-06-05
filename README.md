# corsoVirtualizzazione2_bot

## Indice

1. [Cos'è corsoVirtualizzazione2_bot](#cosè-corsovirtualizzazione2_bot)
2. [A cosa serve](#a-cosa-serve)
3. [Funzionalità disponibili](#funzionalità-disponibili)
4. [Mechanismo di Auto-Ping per il Web Server](#mechanismo-di-auto-ping-per-il-web-server)
5. [Integrazione su Render come Web Service](#integrazione-su-render-come-web-service)
6. [Distribuzione come Immagine Docker](#distribuzione-come-immagine-docker)
7. [Configurazione delle variabili d'ambiente (.env)](#configurazione-delle-variabili-dambiente-env)
8. [Come iniziare](#come-iniziare)
9. [Autori](#autori)

---

## Cos'è corsoVirtualizzazione2_bot

**corsoVirtualizzazione2_bot** è un bot Telegram sviluppato per facilitare la gestione e l'automazione di attività nel contesto del corso di Virtualizzazione 2. Si tratta di un'applicazione Node.js che offre funzionalità tramite un web server Express, rendendo più semplice l'interazione e l'automazione di compiti ricorrenti legati al corso, come la gestione delle comunicazioni, l'organizzazione di incontri, giochi didattici e altre attività. Ovviamente esso funziona solo a titolo didattico, nonostante offre gestioni leggermente più professionali, come la gestione efficente tramite webhook.

---

## A cosa serve

Il progetto è pensato per:

- Automatizzare operazioni ripetitive relative al corso Virtualizzazione 2.
- Fornire una piattaforma centralizzata per le comunicazioni e le notifiche automatiche.
- Semplificare la gestione di attività come promemoria, invio di messaggi, oppure giochi didattici come l’impiccato.
- Offrire comandi rapidi, invio di immagini, sticker, gif e molto altro direttamente su Telegram.

---

## Funzionalità disponibili

Il bot offre i seguenti comandi principali tramite Telegram:

- `/start` — Avvia il bot e dà il benvenuto all’utente.
- `/help` — Mostra l’elenco dei comandi disponibili.
- `/info` — Fornisce informazioni sulla versione e sull'ambiente del bot.
- `/ciao` — Risponde in modo amichevole.
- `/getToken` — Comando scherzoso senza scopo reale.
- `/photos` — Invia una foto casuale.
- `/sticker` — Invia uno sticker.
- `/gif` — Invia una gif animata.
- `/impiccato` — Avvia il gioco dell’impiccato, per giocare con una parola casuale del dizionario italiano.

### Gioco dell’Impiccato

Il gioco dell’impiccato è implementato nel file `hangman.js` e utilizza un dizionario di parole italiane (`parole_italiane.txt`). Ogni chat (utente/gruppo) può avere una partita attiva e interagire con il bot inviando lettere per indovinare la parola. Il bot gestisce i tentativi rimasti, le lettere già giocate e la vittoria/sconfitta.

---

## Mechanismo di Auto-Ping per il Web Server

Un aspetto fondamentale di questo progetto è la sua capacità di mantenersi attivo anche su servizi di hosting gratuiti come Render, che tendono a fermare le applicazioni dopo un periodo di inattività per risparmiare risorse.

Per aggirare questo limite, il web server implementa un meccanismo di **auto-ping**: a intervalli regolari (ogni 5 minuti), il server effettua una richiesta HTTP verso sé stesso (`SELF_URL`). Questo "auto-ping" impedisce al servizio di hosting di considerare l'applicazione inattiva, mantenendo così il bot sempre operativo e pronto a rispondere alle richieste degli utenti o eseguire le operazioni programmate.

![image](https://github.com/user-attachments/assets/48a48bce-b23f-4c20-b9ba-8f1115cafd3b)

---

## Integrazione su Render come Web Service

Per utilizzare **corsoVirtualizzazione2_bot** su [Render](https://render.com) come Web Service:

1. Crea un nuovo servizio di tipo "Web Service" su Render, collegando il repository GitHub o utilizzando l'immagine Docker (vedi sezione successiva).
2. Imposta le seguenti variabili d'ambiente:
   - `BOT_TOKEN`: il token fornito da BotFather per il bot Telegram (obbligatoria).
   - `SELF_URL`: l’URL pubblico fornito da Render per il tuo servizio (obbligatoria per auto-ping e corretta impostazione del webhook).
   - `PORT`: la porta su cui avviare il server (opzionale, di default 3000; Render la imposta automaticamente, quindi salta al prossimo).
   - (Opzionale) `NODE_ENV`: ambiente di esecuzione, ad esempio "production" o "development".
3. Assicurati che il file `parole_italiane.txt` sia presente nella directory principale, necessario per il gioco dell’impiccato.
4. Il meccanismo di auto-ping manterrà attivo il bot anche con i limiti dei servizi gratuiti di Render.

---

## Distribuzione come Immagine Docker

**corsoVirtualizzazione2_bot** è anche disponibile come immagine Docker pubblica su Docker Hub:

```
docker pull dortenzio/telegram-bot:latest
```

Per eseguire il bot tramite Docker:

```bash
docker run -d \
  -e BOT_TOKEN="inserisci_il_tuo_token" \
  -e SELF_URL="https://tuo-servizio.onrender.com" \
  -e PORT=3000 \
  dortenzio/telegram-bot:latest
```

Assicurati di:
- Sostituire le variabili d'ambiente con i tuoi dati reali.
- Montare o includere il file `parole_italiane.txt` nella stessa directory di lavoro del container, se personalizzato.

---

## Configurazione delle variabili d'ambiente (.env)

Ecco un esempio di file `.env` da utilizzare in locale o su servizi cloud:

```
BOT_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SELF_URL=https://tuo-servizio.onrender.com
PORT=3000
NODE_ENV=production
```

> **Nota:**  
> Le uniche variabili obbligatorie al funzionamento sono `BOT_TOKEN` e `SELF_URL`.  
> `PORT` e `NODE_ENV` possono essere omesse o impostate a piacere secondo l’ambiente.

---

## Come iniziare

1. **Clona il repository:**
   ```bash
   git clone https://github.com/DOrtenzio/corsoVirtualizzazione2_bot.git
   ```
2. **Installa le dipendenze**:
   ```bash
   npm install
   ```
3. **Configura le variabili ambiente** come descritto sopra.
4. **Assicurati di avere il file `parole_italiane.txt`** nella directory principale, che comunque è importato in automatico di suo tramite il clone, ma un controllo in più non fa male 😉.
5. **Avvia il bot:**
   ```bash
   node index.js
   ```
6. **Verifica che il web server sia attivo** e risponda alle richieste.

---

## Autori

- [DOrtenzio](https://github.com/DOrtenzio)

> Su ispirazione dei mitici [Mastroianni](https://github.com/mastroiannim) e Felici

Contributi e suggerimenti sono benvenuti!
