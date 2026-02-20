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

## ✍️ Miten nämä toteutetaan teknisesti?
Kaikissa näissä tapauksissa sovelluksen koodin runko pysyy samana:
1.  **Backend**: Vaihda `api/server.py` tiedostossa `system_prompt` vastaamaan uutta roolia (esim. "Olet kokenut lakimies...").
2.  **Frontend**: Vaihda `pages/product.tsx` tiedostossa labelit (esim. "Patient Name" -> "Asiakkaan nimi", "Visit Notes" -> "Tapaamisen havainnot").
3.  **Docker & AWS**: Koska arkkitehtuuri on jo valmis, uuden version julkaisu on vain uusi `docker build` ja `push`.

**Tämä arkkitehtuuri on "Sveitsin linkkuveitsi" mille tahansa alalle, jossa asiantuntija täyttää manuaalisesti raportteja!**
