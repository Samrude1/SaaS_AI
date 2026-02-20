# Sovelluksen jatkokehitys: Muita käyttökohteita (Use Cases)

MediNotes Pro -sovelluksen perusarkkitehtuuri (**Vapaat muistiinpanot -> Jäsennelty data -> Toimenpiteet -> Viesti**) on erittäin tehokas prosessi monella muullakin alalla. Tässä on ideoita, miten voit muokata tätä sovellusta muihin tarkoituksiin vain muuttamalla "System Promptia" ja käyttöliittymän tekstejä:

## 1. ⚖️ Legal-assistentti (Lakitiede)
Lakihenkilö tekee muistiinpanoja asiakastapaamisesta. Sovellus tuottaa:
- **Yhteenveto**: Tapauksen keskeiset faktoihin perustuvat kohdat.
- **Seuraavat askeleet**: Mitä lakeja tai ennakkotapauksia on tutkittava, mitä dokumentteja asiakkaan on toimitettava.
- **Viesti**: Ammattimainen ja kohtelias sähköpostiluonnos asiakkaalle tapaamisen perusteella.

## 2. 📋 Projektipäällikön Kokousapurin (PM Assistant)
Tiimin kokousmuistiinpanot syötetään sovellukseen. Sovellus tuottaa:
- **Päätökset**: Mitä kokouksessa sovittiin.
- **Action Items**: Kuka tekee, mitä tekee ja mihin mennessä (lippunumerot esim. Jiraan).
- **Yhteenveto**: Lyhyt "tl;dr" koko tiimille tai sidosryhmille Slackiin.

## 3. 🏗️ Rakennus- tai Kiinteistötarkastus (Site Survey)
Rakennustarkastaja kävelee kohteessa ja kirjoittaa ranskalaisten viivojen sijasta vapaata tekstiä havainnoista. Sovellus tuottaa:
- **Raportti**: Tekninen kuvaus kohteen kunnosta eri kategorioissa.
- **Korjauslista**: Mitkä asiat vaativat välitöntä huomiota ja hinta-arviot.
- **Asiakasyhteenveto**: Selkeä selostus asunnon omistajalle remonttitarpeista.

## 4. 👟 Personal Trainer / Ravintovalmentaja (Coaching)
Valmennustapaamisen huomiot syötetään sovellukseen. Sovellus tuottaa:
- **Treenipäivitys**: Mitä muutoksia saliohjelmaan tehdään.
- **Ravinto-ohje**: Päivitetyt kalorit ja makrot seuraavalle viikolle.
- **Motivaatioviesti**: Kannustava ja henkilökohtainen palaute asiakkaalle.

## ✅ Miten muokata tämä sovellus muihin tarkoituksiin?
Kaikissa yllä olevissa tapauksissa sovelluksen koodin runko pysyy samana:
1.  **Backend**: Vaihda `api/server.py` tiedostossa `system_prompt` vastaamaan uutta roolia.
2.  **Frontend**: Vaihda `pages/product.tsx` tiedostossa lomakkeen labelit.
3.  **Docker & AWS**: Arkkitehtuuri on jo valmis — uuden version julkaisu on vain uusi `docker build` ja `push`.

---

## 🎯 Portfolion vahvistaminen AI Engineer -roolia varten

Seuraavat lisäykset nostavat tämän projektin harjoituksesta vakavasti otettavaksi portfoliotyöksi. Ne on järjestetty vaikutusten mukaan, tärkeimmät ensin.

### 1. 🧠 Vaihda tai vertaile AI-malleja (High Impact)
Nykyinen toteutus käyttää Geminiä. AI Engineer osaa valita oikean työkalun oikeaan tehtävään. Lisää README:hen (tai erilliseen raporttiin) **Model Comparison** -näkökulma:
- Testaa sama prompt **GPT-4o**:lla, **Gemini 2.5 Flash-Litella** ja **Anthropic Claudella**.
- Dokumentoi tulokset: Laatu, nopeus, hinta per 1000 pyyntöä.
- Toteuta sovellukseen dropdown-valitsin, jolla käyttäjä voi valita mallin.
- **Miksi tärkeää?** AI Engineer -roolissa tärkein taito on juuri tämä vertailu ja perusteleminen.

### 2. 📊 Observability & Logging (High Impact)
Tuotantosovelluksessa pitää tietää, mitä tapahtuu. Lisää:
- **Token-laskuri**: Laske ja lokita jokaisen pyynnön token-kulutus ja hinta.
- **Latency-mittari**: Kirjaa kuinka kauan kukin API-kutsu kestää.
- **Virheloki**: Lähetä virheet esim. Sentry-palveluun (ilmainen tier).
- **Miksi tärkeää?** Ilman tätä et voi optimoida sovellusta tuotannossa. Tämä erottaa harrastajaprojektin oikeasta tuotantosovelluksesta.

### 3. 🧪 Prompt Engineering -dokumentaatio (Medium Impact)
AI Engineerin arvokkain taito on prompting. Luo `docs/prompt-engineering.md`:
- Mikä oli alkuperäinen prompt ja miksi se ei toiminut?
- Mitä muutoksia tehtiin ja miksi?
- Näytä konkreettisesti, miten promptin muutos paransi tulosta.
- **Miksi tärkeää?** Tämä osoittaa, että osaat tehdä systemaattista insinöörityötä AI:n kanssa.

### 4. 🔍 RAG (Retrieval-Augmented Generation) -lisäys (High Impact)
Tämä on yksi haetuin AI Engineer -taito. Lisää sovellukseen:
- Mahdollisuus ladata PDF-dokumentti (esim. hoitosuositus tai lakipykälä).
- Tekoäly viittaa yhteenvedossaan ladattuun dokumenttiin.
- Teknisesti: `LangChain` tai `LlamaIndex` + vector store (esim. ChromaDB).
- **Miksi tärkeää?** RAG on se juttu, jota yritykset rakentavat eniten tällä hetkellä.

### 5. ✅ Testit ja CI/CD (Medium Impact)
Ammattimaiseen projektiin kuuluu automaattiset testit:
- Kirjoita muutama yksikkötesti Python-backendille (`pytest`).
- Lisää GitHub Actions -tiedosto, joka ajaa testit automaattisesti joka `git push` yhteydessä.
- **Miksi tärkeää?** Osoittaa, että tunnet ohjelmistokehityksen parhaat käytännöt.

---

### Prioriteettisuositus
Jos sinulla on aikaa tehdä vain yksi asia, valitse **Model Comparison** (kohta 1). Se on konkreettisin osoitus siitä, mitä AI Engineer oikeasti tekee päivittäin.

