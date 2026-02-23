---
description: ContractSense AI Initial Scaffolding
---
Tämä workflow alustaa automaattisesti ContractSense AI -projektin puhtaan ydinrakenteen (Backend-kansiot, peruskirjastot ja ympäristömuuttujien pohjat).

1. Luodaan ammattimainen Backend-kansiorakenne
// turbo
```powershell
mkdir -p api/routers
mkdir -p api/agents
mkdir -p api/rag
mkdir -p api/models
mkdir -p api/middleware
```

2. Luodaan Python-riippuvuudet (requirements.txt) Senior-tason työkaluilla
// turbo
```powershell
echo "fastapi" > requirements.txt
echo "uvicorn" >> requirements.txt
echo "PyMuPDF" >> requirements.txt
echo "langfuse" >> requirements.txt
echo "openai" >> requirements.txt
echo "langchain" >> requirements.txt
echo "chromadb" >> requirements.txt
echo "slowapi" >> requirements.txt
echo "pydantic" >> requirements.txt
```

3. Luodaan Backendin juuritiedosto (api/server.py)
// turbo
```powershell
echo "from fastapi import FastAPI" > api/server.py
echo "" >> api/server.py
echo "app = FastAPI(title='ContractSense AI', version='1.0.0')" >> api/server.py
```

4. Luodaan ympäristömuuttujien pohja (.env.example) tietoturvaa varten
// turbo
```powershell
echo "OPENROUTER_API_KEY=sk-or-v1-..." > .env.example
echo "DEMO_MAX_REQUESTS_PER_DAY=3" >> .env.example
echo "MAX_PDF_SIZE_MB=5" >> .env.example
```

5. Asennetaan Next.js (Frontend) täysin tyhjänä ja valmiina Tailwindillä
// turbo
```powershell
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app=false --src-dir=false --import-alias "@/*" --use-npm
```
