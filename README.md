# 🤝 MeetingMind Pro — Enterprise AI Meeting Intelligence

**MeetingMind Pro** is a high-performance SaaS application designed to transform raw, unstructured meeting notes into professional, actionable summaries. It leverages state-of-the-art LLMs via **OpenRouter**, featuring real-time reasoning visualization and cross-model performance tracking.

---

## 🏗️ Technical Architecture

The application is built on a **Unified Container Architecture**, optimized for cost-effective deployment on **AWS App Runner**.

- **Frontend**: Next.js 16.1.6 (Pages Router) using Static HTML Export for maximum performance.
- **Backend**: FastAPI (Python 3.12) serving both the API and the static frontend assets.
- **AI Integration**: Unified OpenRouter interface supporting Gemini, Claude, GPT-4o, and DeepSeek.
- **Security**: Robust JWT-based authentication via **Clerk**.
- **Communication**: Server-Sent Events (SSE) for low-latency, real-time token streaming.

### Project Structure
```text
.
├── api/                # FastAPI Backend
│   └── server.py       # Core logic, SSE streaming & Auth
├── pages/              # Next.js Frontend
│   └── product.tsx     # Main AI Dashboard & SSE Client
├── docs/               # Technical documentation & guides
├── public/             # Static assets
├── Dockerfile          # Multi-stage production build
└── requirements.txt    # Python dependencies
```

---

## 🧠 AI Engineering Features

### 1. Multi-Model Support (OpenRouter)
Seamlessly switch between top-tier models with a single implementation.
- **Reasoning Models**: DeepSeek R1 & o1 support with native **Chain-of-Thought** visualization.
- **Performance Models**: Gemini 2.5 Flash & Claude 3.5 Sonnet.

### 2. Transparent Reasoning (CoT)
One of the core portfolio highlights is the **Real-Time Cognitive Process** view. The system parses specific reasoning tokens from the SSE stream and renders them in a dedicated terminal-style UI, allowing users to see the AI's internal logic before the final output.

### 3. Dynamic Multi-Agent Orchestration (LLM Mesh)
A sophisticated multi-stage orchestration that demonstrates advanced AI agent patterns:
- **Master Orchestrator (GPT-4o)**: Analyzes the raw notes and dynamically defines 3 expert personas tailored to the meeting's context.
- **Expert Analysis (Gemini 2.5 Flash)**: The 3 agents perform parallel, focused deep-dives from their unique perspectives.
- **Synthetic Finalization (Claude 3.5 Sonnet)**: A lead facilitator synthesizes the agent insights and original notes into a cohesive, executive-level report.
- **Real-time Visualization**: Users can monitor the expert team creation and individual agent analyses through a dedicated UI panel.

### 4. Observability & Latency Tracking
The backend tracks end-to-end processing time for every request, providing visibility into model performance and latency metrics directly in the UI.

---

## � Future Roadmap & Enterprise Strategy
Designed with scalability and cost-efficiency in mind, the platform is ready for the next level of Agentic Workflows:
- **Cost-Optimized Routing**: Implementation of a "Router Agent" to dynamically select models based on context length and task complexity (e.g., Flash models for simple notes, Gemini 3.1 Pro for massive technical documentation).
- **Autonomous Quality Verification (Self-Correction)**: Integrating a "Reviewer Agent" to perform a critique-and-refine loop on agent outputs before final synthesis.
- **Future-Ready Architecture**: The LLM Mesh is model-agnostic, allowing seamless hot-swapping to Gemini 3.1 Pro or future O1 reasoning models without breaking the orchestration logic.
- **RAG Integration**: Connecting meeting intelligence to a Vector Database for cross-meeting context and historical decision tracking.

---

## �🛡️ Security & Authentication

Security is "Secure by Default":
- **Clerk Integration**: Full user lifecycle management.
- **JWT Validation**: The FastAPI backend validates every incoming request's Bearer token against Clerk's JWKS.
- **Environment Isolation**: Secure handling of API keys and environment-specific bypasses for local development.

---

## 🚀 Installation & Local Development

### Prerequisites
- Docker Desktop
- OpenRouter API Key
- Clerk Publishable & Secret Keys

### Environment Setup
Create a `.env` file in the root:
```env
OPENROUTER_API_KEY=sk-or-v1-...
CLERK_JWKS_URL=https://.../.well-known/jwks.json
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
ENVIRONMENT=development
```

### Building the Unified Container
Next.js static export requires the Clerk Publishable Key at build time for prerendering. Use the following command in PowerShell:

```powershell
# Extract key from .env and build
$env:NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = (Get-Content .env | Select-String "^NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=").ToString().Split("=")[1]; `
docker build --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$env:NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY --platform linux/amd64 -t meetingmind-pro .
```

### Running Locally
```powershell
docker run -p 8000:8000 --env-file .env meetingmind-pro
```
Access the application at `http://localhost:8000`.

---

## ☁️ Deployment

The project is optimized for **AWS App Runner**:
1. Build the Docker image for `linux/amd64`.
2. Push to **Amazon ECR**.
3. Deploy as a service to App Runner, mapping port `8000`.

For detailed migration steps, see [docs/vercel-to-aws-migration.md](./docs/vercel-to-aws-migration.md).

---

**Developed by**: Sami Rautanen  
**Positioning**: AI Engineer / SaaS Multi-Model Platform 🚀
