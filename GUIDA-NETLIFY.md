# Guida Netlify + Admin

Questa versione del progetto funziona in due modalita:

1. `Deploy manuale` su Netlify: il sito pubblico si apre subito.
2. `GitHub + Netlify Identity + Git Gateway`: il pannello `/admin/` permette login e salvataggio.

Il pannello Admin reale richiede la seconda modalita.

## 1. Carica il progetto su GitHub

1. Crea un nuovo repository su GitHub, ad esempio `la-tito-map`.
2. Carica tutti i file di questa cartella nel repository.
3. Verifica che su GitHub siano presenti almeno:
   - `index.html`
   - `admin/index.html`
   - `admin/config.yml`
   - `content/site.json`
   - `content/locations.json`

## 2. Collega GitHub a Netlify

1. Entra in Netlify.
2. Seleziona `Add new project`.
3. Scegli `Import an existing project`.
4. Seleziona GitHub e autorizza Netlify.
5. Scegli il repository `la-tito-map`.
6. Lascia le impostazioni build predefinite.
7. Conferma il deploy.

Quando il deploy finisce, il sito pubblico sara online.

## 3. Attiva il login Admin

1. Apri il progetto su Netlify.
2. Vai in `Project configuration`.
3. Apri `Identity`.
4. Premi `Enable Identity`.
5. In `Registration preferences` scegli:
   - `Invite only` per uso privato consigliato
   - oppure `Open` se stai ancora facendo prove
6. Sempre in `Identity`, trova `Services`.
7. Attiva `Git Gateway`.

Nota importante:
Netlify segnala che Git Gateway e deprecato per nuove configurazioni, ma al momento continua a funzionare per siti che lo usano. Per un progetto semplice e gratuito con Decap CMS resta ancora la strada piu diretta.

## 4. Crea l'utente Admin

1. In `Identity`, apri la lista utenti.
2. Premi `Invite users`.
3. Inserisci la tua email.
4. Apri l'email ricevuta e imposta la password.

## 5. Apri il pannello

1. Vai su:
   - `https://TUO-SITO.netlify.app/admin/`
2. Accedi con email e password.
3. Troverai due sezioni:
   - `Impostazioni sito`
   - `Locali`

## 6. Cosa puoi modificare

### Impostazioni sito

- Titolo principale IT/EN/ES
- Testi descrizione birra IT/EN/ES
- Titolo e sottotitolo mappa IT/EN/ES
- Coordinate centro mappa
- Zoom mappa

### Locali

- Nome locale IT/EN/ES
- Categoria IT/EN/ES
- Indirizzo IT/EN/ES
- Informazioni IT/EN/ES
- Orari IT/EN/ES
- Coordinate marker
- Telefono, email, sito
- Foto
- PDF menu
- Link Google Maps
- Attivo / non attivo

## 7. Pubblica una modifica

1. Apri `/admin/`.
2. Modifica i contenuti.
3. Premi `Publish`.

Decap CMS salvera i file nel repository GitHub e Netlify pubblichera la nuova versione del sito.

## 8. Coordinate Area Feste gia corrette

Questa versione usa gia:

- Latitudine: `45.663861`
- Longitudine: `8.750750`

Il link Google Maps predefinito punta gia a quel punto.

## 9. Se il login non funziona

Controlla in questo ordine:

1. Il sito e stato creato partendo da GitHub, non da upload manuale.
2. `Identity` e attivo.
3. `Git Gateway` e attivo.
4. Hai accettato l'invito via email.
5. Stai aprendo proprio `/admin/` con slash finale.

## 10. Se vuoi evitare Git Gateway in futuro

Alternative possibili:

- backend GitHub con OAuth dedicato
- pannello custom con database/serverless

Per questa versione ho scelto Decap CMS + Netlify Identity perche e la soluzione gratuita piu semplice da pubblicare su Netlify con interfaccia reale gia pronta.
