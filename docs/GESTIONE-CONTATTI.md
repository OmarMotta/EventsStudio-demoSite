# Events Studio — gestione dei contatti

## Come funziona

Il visitatore compila Contattaci. Il server controlla i campi, la privacy e gli invii ripetuti, poi inoltra una richiesta firmata a Netlify Forms. La richiesta viene gestita da Netlify e la notifica configurata nel pannello viene inviata a **events_studiopz@hotmail.com**.

La notifica non è una garanzia di consegna della posta: filtri antispam, casella piena, quote del piano o guasti possono impedirla. Controllare periodicamente anche Netlify Forms. Non esiste una garanzia di assenza assoluta di guasti.

Non viene inviata un’email automatica al visitatore: il titolare risponde personalmente. Nessun servizio di email aggiuntivo è stato introdotto.

## Leggere e rispondere, anche da telefono

1. Aprire la posta di **events_studiopz@hotmail.com** con Outlook o l’app già utilizzata dal titolare.
2. Cercare la notifica di una nuova richiesta dal sito Events Studio.
3. Leggere i dati e il messaggio del visitatore.
4. Premere **Rispondi** e verificare che il destinatario sia l’indirizzo del visitatore. Il campo del modulo si chiama `email`, così Netlify può impostarlo come Reply-To.
5. Se l’indirizzo di risposta non è quello del visitatore, copiarlo dai dati della richiesta. Non rispondere a `formresponses@netlify.com`.
6. Alla prima prova controllare anche **Posta indesiderata**, e segnare come attendibili le notifiche legittime.

Non occorre dare al titolare accesso alla posta di chi sviluppa il sito. Per la sola gestione via email non occorre neppure dargli accesso al pannello Netlify.

## Consultare le richieste su Netlify

Con un account autorizzato nel progetto, aprire **Netlify → eventsstudio-demo → Forms → events-studio-contatti**. Da qui si possono leggere le richieste, controllare quelle classificate come spam ed eliminare quelle non più necessarie. Le voci esatte possono cambiare con l’interfaccia Netlify.

Il titolare deve avere un proprio accesso autorizzato se deve gestire anche l’archivio Netlify. Usare account personali e autenticazione a più fattori, evitando password condivise.

## Notifiche da mantenere configurate

In **Forms → Submission notifications**:

- Evento: **New form submission**.
- Destinatario: **events_studiopz@hotmail.com**.
- Oggetto consigliato: **Nuova richiesta dal sito Events Studio**.
- Modulo: `events-studio-contatti`, oppure **Any form** se è l’unico modulo del sito.

Il codice non cambia il destinatario nel pannello. Verificare che l’impostazione inserita sia stata salvata. Valutare quote e condizioni del piano in uso direttamente nell’account Netlify; non sono state ipotizzate soglie gratuite.

## Conservazione: 12 mesi dall’ultimo contatto

Per richieste che non diventano un incarico, il titolare ha scelto **12 mesi dall’ultimo contatto**. Non significa 12 mesi dalla prima richiesta se la conversazione prosegue.

Controllare le scadenze regolarmente, per esempio ogni settimana, senza prolungare il termine previsto. Eliminare le richieste scadute da Netlify e le relative email, allegati o esportazioni operative. Gestire anche cestino e copie secondo le impostazioni effettive dei servizi. Una cancellazione su Netlify non elimina la notifica dalla posta, e viceversa.

Questa cancellazione dei contatti è una responsabilità del titolare e **non è automatizzata dal sito**. Le richieste che danno luogo a un incarico, gli obblighi di legge e le eventuali esigenze documentate di tutela di diritti seguono le relative regole, limitatamente ai dati necessari.

La sola pulizia automatica implementata riguarda il registro tecnico per duplicati e limiti antispam: dati destinati alla cancellazione dopo 48 ore, con esecuzione giornaliera normalmente entro 72 ore. Non contiene il testo delle richieste o gli indirizzi IP in chiaro. Controllare l’esito della funzione `contact-cleanup` se sono segnalati guasti.

## Se il visitatore segnala un problema

- **Errore nei campi:** correggere quelli evidenziati. La data evento si può lasciare vuota.
- **Troppi tentativi:** attendere qualche minuto; il limite è cinque nuove richieste ogni dieci minuti per indirizzo IP. Una rete condivisa può raggiungerlo con più persone.
- **Connessione interrotta o esito incerto:** il sito non cancella i campi e offre **Verifica esito**. Un risultato incerto non significa che non sia arrivato nulla.
- **Riferimento della richiesta:** cercarlo nei dati Netlify o nelle email prima di chiedere un nuovo invio. Il sistema evita reinvii automatici di richieste identiche durante il periodo di conservazione del registro tecnico.
- **Nessuna email:** controllare prima Netlify Forms, poi spam, impostazione della notifica, spazio della casella e stato/quote Netlify.
- **Servizio non disponibile:** usare telefono o email già presenti sul sito.

Non incollare dati dei visitatori nei log di assistenza o in chat pubbliche. Per indagare usare prima il solo riferimento della richiesta.

## Privacy e responsabilità del titolare

La pagina `/privacy` identifica Carmine Delle Donne per Events Studio, P.IVA 02157470762, e usa come recapito postale Via Genova 3, Potenza, già indicato nei dati societari del sito. L’indirizzo operativo in Via Angilla Vecchia 6 rimane nella sezione Dove trovarci. Prima della pubblicazione controllare che identità e recapito postale siano corretti.

Sono confermati l’uso per sole richieste/preventivi e il recapito privacy **events_studiopz@hotmail.com**. Non viene raccolto un consenso marketing. La checkbox attesta la lettura dell’informativa.

Il titolare deve verificare le condizioni applicabili a Netlify e alla propria casella Microsoft/Hotmail, i ruoli dei fornitori, eventuali trasferimenti, gli accessi autorizzati e la gestione delle richieste di accesso/cancellazione. Il testo predisposto non certifica automaticamente la conformità di tutti i trattamenti aziendali.

La pagina contatti contiene già una mappa Google caricata con la pagina: è descritta nell’informativa, ma la gestione di cookie/consenso dell’intero sito richiede una verifica separata. Non è stato inventato un testo di cookie policy né modificata la mappa preesistente.
