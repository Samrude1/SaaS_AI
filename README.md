# 🏥 MediNotes Pro — AI-Powered Healthcare Assistant

**MediNotes Pro** on ammattitasoinen SaaS-sovellus, joka on suunniteltu auttamaan lääkäreitä ja terveydenhuollon ammattilaisia optimoimaan potilaskirjausten tekemistä. Sovellus muuntaa vapaamuotoiset vastaanotto-muistiinpanot jäsennellyksi lääketieteelliseksi dokumentaatioksi ja potilasviestinnäksi.

![Status](https://img.shields.io/badge/Status-Cloud%20Production-success?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)
![AWS](https://img.shields.io/badge/AWS-App%20Runner-FF9900?style=for-the-badge&logo=amazon-aws)
![AI](https://img.shields.io/badge/AI-Gemini%202.5%20Flash--Lite-4285F4?style=for-the-badge&logo=google-gemini)

---

## ✨ Tärkeimmät ominaisuudet

- **📋 Automaattiset yhteenvedot**: Luo lääketieteelliset yhteenvedot suoraan potilaskertomukseen.
- **🚀 Jatkotoimenpiteet**: Tunnistaa automaattisesti lääkärin määräämät jatko-ohjeet ja tutkimukset.
- **📧 Potilasystävällinen viestintä**: Luonnostelee selkokielisen sähköpostiviestin potilaalle ymmärrettävässä muodossa.
- **🛡️ Turvallinen arkkitehtuuri**: Käyttäjänhallinta ja suojatut rajapinnat (Clerk Auth).
- **⚡ Reaaliaikainen analyysi**: Hyödyntää striimaavaa tekoälyä (Server-Sent Events) välittömään palautteeseen.
- **🐳 Kontitettu julkaisu**: Toimii identtisesti missä tahansa ympäristössä Dockerin avulla.

---

## 🛠️ Tekninen toteutus

### Arkkitehtuuri
Sovellus käyttää **unified container** -mallia, jossa Python-backend tarjoilee sekä API-rajapinnan että staattisesti käännetyn Next.js-frontendin.

### Frontend (Next.js)
- **Staattinen export**: Optimoitu suorituskyky ja itsenäinen jakelu.
- **Käyttöliittymä**: Moderni Dark Mode, Glassmorphism ja Framer Motion -animaatiot.
- **Autentikaatio**: Clerk Provider integraatio.

### Backend (FastAPI)
- **AI-moottori**: Google Gemini 2.5 Flash-Lite (optimoitu nopeuteen ja ilmaisversion korkeisiin käyttövaroihin).
- **Turvallisuus**: JWT-validointi jokaisessa pyynnössä.
- **Health Checks**: AWS App Runner -yhteensopiva valvonta.

---

## 🚀 Käyttöönotto (Docker)

1. **Konfiguroi ympäristö**: Kopioi `.env.local` arvot `.env` -tiedostoon.
2. **Rakenna kuva**:
   ```powershell
   docker build --platform linux/amd64 -t medinotes-pro .
   ```
3. **Aja paikallisesti**:
   ```powershell
   docker run -p 8000:8000 --env-file .env medinotes-pro
   ```

---

## ☁️ Pilvijulkaisu (AWS)
Tämä projekti on suunniteltu julkaistavaksi **AWS App Runner** -palveluun käyttäen **Amazon ECR** -konttirekisteriä. Tarkemmat ohjeet siirtoon löytyvät tiedostosta [docs/vercel-to-aws-migration.md](./docs/vercel-to-aws-migration.md).

---

**Kehittäjä**: Sami Rautanen  
**Projektin tila**: Tuotantovalmis pilvijulkaisu
