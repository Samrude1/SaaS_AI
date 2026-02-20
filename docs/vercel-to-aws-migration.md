# Opas: Vercel-projektin muuntaminen Docker/AWS-ympäristöön

Tämä dokumentti kuvaa vaiheet, joilla Next.js + FastAPI -projekti (kuten Vercel-pohjaiset SaaS-aihiot) muutetaan yhdeksi Docker-kontiksi AWS App Runner -julkaisua varten.

## 1. Miksi tämä muutos tehdään?
Vercelissä frontend ja backend ovat erillisiä (Serverless Functions). AWS App Runnerissa on usein kustannustehokkaampaa ja hallittavampaa ajaa sovellusta yhtenä konttina, jossa Python-palvelin tarjoilee sekä API:n että staattisen frontendin.

---

## 2. Vaihe 1: Frontendin muuttaminen staattiseksi
Next.js on konfiguroitava "export"-tilaan, jolloin se tuottaa HTML/JS-tiedostoja, joita mikä tahansa palvelin voi tarjoilla.

**Tiedosto:** `next.config.ts` (tai `.js`)
```typescript
const nextConfig = {
  output: 'export',  // Tuottaa 'out' -kansion buildin yhteydessä
  images: {
    unoptimized: true  // Staattinen export vaatii tämän
  },
  // Ohita lint/tyypit buildissa jos tarpeen nopeuden vuoksi
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};
```

---

## 3. Vaihe 2: Unified Backend (FastAPI)
Luodaan uusi palvelintiedosto, joka osaa tarjoilla frontend-tiedostot ja hoitaa API-pyynnöt.

**Tiedosto:** `api/server.py`
Keskeiset asiat:
1. **CORS-asetukset**: Salli pyynnöt oikeista lähteistä.
2. **API-endpointit**: Siirrä ne erilliseen polkuun (esim. `/api/consultation`), jotta ne eivät mene ristiin staattisten tiedostojen kanssa.
3. **Staattisten tiedostojen tarjoilu**:
   ```python
   from fastapi.staticfiles import StaticFiles
   from fastapi.responses import FileResponse
   from pathlib import Path

   # Serve static files (Next.js export) - TÄMÄ TULEE VIIMEISEKSI
   static_path = Path("static")
   if static_path.exists():
       @app.get("/")
       async def serve_root():
           return FileResponse(static_path / "index.html")
       app.mount("/", StaticFiles(directory="static", html=True), name="static")
   ```

---

## 4. Vaihe 3: Docker-konfiguraatio (Multi-stage Build)
Multi-stage build mahdollistaa sen, että emme jätä Node.js-työkaluja lopulliseen Python-konttiin, mikä pitää koon pienenä.

**Tiedosto:** `Dockerfile`
1. **Stage 1 (Node)**: Asenna riippuvuudet, aja `npm run build`.
2. **Stage 2 (Python)**: Asenna Python-kirjastot ja kopioi `api/server.py` sekä frontendin `out/` -kansio.

**Tiedosto:** `.dockerignore`
Varmista, että jätät pois:
- `node_modules`
- `.next`
- `.env.local`
- `.git`

---

## 5. Vaihe 4: Paikallinen testaus (Powershell)
Varmista aina toimivuus kontissa ennen AWS-julkaisua.

```powershell
# 1. Rakenna kuva
docker build -t sovellus-nimi .

# 2. Aja kontti salaisuuksien kanssa
docker run -p 8000:8000 `
  --name testi-ajo `
  -e GOOGLE_API_KEY=avain `
  -e CLERK_SECRET_KEY=avain `
  sovellus-nimi
```

---

## 6. Vaihe 5: AWS App Runner -valmistelut
1. **ECR (Elastic Container Registry)**: Luo repon nimi, tägää paikallinen kuva AWS-osoitteella ja työnnä se (`docker push`).
2. **App Runner**: Luo palvelu, valitse ECR-kuva, aseta portiksi **8000** ja lisää tarvittavat Environment Variables -muuttujat.
3. **Health Check**: Aseta poluksi `/health` (varmista että se on määritelty `server.py`:ssä).

---

## Yhteenveto muutoksista tässä projektissa:
- `pages/product.tsx`: `fetchEventSource('/api')` -> `fetchEventSource('/api/consultation')`.
- `next.config.ts`: `output: 'export'`.
- `api/server.py`: Uusi tuotantopalvelin static-tuella.
- `Dockerfile`: Multi-stage build (Node -> Python).
