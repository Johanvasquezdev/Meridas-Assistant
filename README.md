# MERIDAS — AI Support Intelligence
### *Operational Evidence Intelligence System*

<p align="center">
  <img src="frontend/public/logo.png" alt="Meridas Logo" width="100" height="100" />
</p>

<p align="center">
  <strong>"Evidence first. Answer second."</strong>
</p>

<p align="center">
  <a href="#core-thesis"><img src="https://img.shields.io/badge/Thesis-Evidence%20First-9E1B32?style=for-the-badge" alt="Evidence First" /></a>
  <a href="#primary-rag-engine"><img src="https://img.shields.io/badge/Primary%20RAG-Cohere%20Command%20R%2B-C9A227?style=for-the-badge&logo=cohere" alt="Cohere Command R+" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/Backend-NestJS%2011-E0234E?style=for-the-badge&logo=nestjs" alt="NestJS" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/Frontend-Next.js%2016%20Turbopack-000000?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
  <a href="#relational-evidence-model"><img src="https://img.shields.io/badge/Database-PostgreSQL%20%7C%20Neon-00E599?style=for-the-badge&logo=postgresql" alt="PostgreSQL" /></a>
  <a href="#security--governance"><img src="https://img.shields.io/badge/Security-Zero%20Client%20Trust-151417?style=for-the-badge&logo=security" alt="Zero Client Trust" /></a>
</p>

---

## 1. Executive Summary & Product Thesis

**MERIDAS** is an enterprise-grade **Operational Evidence Intelligence System** designed for high-consequence operational, security, infrastructure, and administrative knowledge.

Unlike traditional conversational RAG assistants that optimize for *generating an answer at all costs*, MERIDAS optimizes for **whether an answer deserves to be given**.

This is a private operational system, not a public subscription product. The circuit that distinguishes it:

1. **Ingest writes the evidence graph.** A document becomes a source, a version, passages, and claims. A later revision of the same document stays active beside the previous one and opens a conflict.
2. **The chat reads that graph.** Retrieval drops passages whose version is `SUPERSEDED`. If evidence is missing or the active versions contradict, the answer is refused.
3. **Adjudication changes the next answer.** On the conflict desk a person declares which claim stays. The other version is marked `SUPERSEDED`, and the following question no longer retrieves it.

### Core Tenet: Evidence first. Answer second.

When an operator, systems engineer, or compliance officer queries MERIDAS:
1. **Evidence Verification Precedes Generation:** The system retrieves authoritative directives, extracts candidate atomic claims, and evaluates each claim through **Natural Language Inference (NLI)** before synthesizing an answer.
2. **Deterministic Tri-State Decision Gating:** Responses are explicitly classified into **`SUPPORTED`**, **`CONDITIONAL`**, or **`CANNOT_ESTABLISH`**. If evidence is missing, outdated, or conflicting, the system refuses to extrapolate and flags the gap.
3. **Proactive Conflict Detection:** Contradictions between active standard operating procedures (SOPs) and legacy/superseded directives are surfaced automatically to a human-in-the-loop **Conflict Investigation Desk** (`/dashboard/conflicts`).
4. **Cryptographic Auditability:** Every human adjudication, policy override, and directive resolution is immutably sealed with a **SHA-256 cryptographic audit receipt**.
5. **Zero-Leakage Perimeter Security:** Internal network metadata (RFC 1918 private IPs, hardware MAC addresses, credentials, and tokens) are scrubbed before payload dispatch to external LLMs.

---

## 2. Key Pillars & Capabilities

```mermaid
flowchart TD
    subgraph Ingestion["1. Operational Ingestion"]
        SOP["Authoritative SOPs & Directives"] --> Chunking["Semantic Passage Chunking"]
        Chunking --> Extraction["Atomic Claim Extraction"]
        Extraction --> Versioning["Version Control & Perimeter Tagging"]
    end

    subgraph Verification["2. Dual-Engine Verification"]
        UserQ["Operator Query"] --> Perimeter["Perimeter Filter (Site + System)"]
        Perimeter --> HybridSearch["Pinecone Vector + Relational Retrieval"]
        HybridSearch --> Passages["Authoritative Passages"]
        Passages --> Cohere["Cohere Command R+ (Native Grounding)"]
        Passages --> NLI["Claim-Level NLI Verification Engine"]
        NLI --> Contradiction{"Contradiction Detected?"}
    end

    subgraph Decision["3. Tri-State Decision Gating"]
        Contradiction -- "Yes" --> CannotEstablish["CANNOT_ESTABLISH (Flagged to Conflict Desk)"]
        Contradiction -- "No (Score >= 0.85)" --> Supported["SUPPORTED (Authoritative & Verified)"]
        Contradiction -- "No (Boundary Limited)" --> Conditional["CONDITIONAL (Scope Limited)"]
    end

    subgraph Governance["4. Human Adjudication & Audit"]
        CannotEstablish --> ConflictDesk["Conflict Investigation Desk"]
        ConflictDesk --> HumanDecision["Human Review & Policy Override"]
        HumanDecision --> SHA["SHA-256 Cryptographic Audit Ledger"]
    end
```

### A. Deterministic Tri-State Decision Matrix

| Decision State | Meaning | System Behavior |
| :--- | :--- | :--- |
| **`SUPPORTED`** | 100% of candidate claims are strictly entailed by active, non-superseded documentation with $\ge 85\%$ NLI confidence. | Certified answer delivered with precise document citations and atomic claim badges. |
| **`CONDITIONAL`** | Claims are valid only under specific physical sites, environments, or temporal windows. | Answer issued with prominent boundary restriction warnings and perimeter disclosures. |
| **`CANNOT_ESTABLISH`** | Knowledge gap detected, evidence is absent, or conflicting directives exist across versions. | Complete refusal to speculate. Prompts the operator with the specific missing evidence gap and routes the inquiry to custodians. |

### B. Proactive Conflict Investigation Desk (`/dashboard/conflicts`)
- Automatically compares claims across document versions (e.g. *VPN Gateway v2.4* vs *VPN Gateway v3.0*).
- Displays side-by-side claim contradictions, source metadata, and severity levels.
- Enables operational custodians to adjudicate conflicts:
  - **`OVERRIDE_AUTHORITY`**: Designates one source version as the binding operational truth.
  - **`MARK_FALSE_POSITIVE`**: Reconciles semantic nuances or distinct perimeter scopes.
  - **`REQUEST_DOC_UPDATE`**: Dispatches a remediation ticket to the document owner.

### C. Multi-Dimensional Perimeter Scoping
Inquiries can be filtered by:
- **Physical Site:** `HQ`, `Regional East`, `Regional West`, `Datacenter`, `Remote`.
- **Target System:** `Zero-Trust / VPN`, `Hardware Custody`, `Server Decommissioning`, `Identity & Access`.

### D. Apple Human Interface Guidelines (HIG) Design Language
- **Palette:** Charcoal (`#151417`), Deep Crimson (`#9E1B32`), Accent Gold (`#C9A227`), and Warm Ivory (`#F7F3EA`).
- **Surface Elevation:** Continuous squircles (`border-radius: 12px-24px`), zero harsh borders, specular inset highlights (`inset 0 1px 0 0 rgba(255,255,255,0.08)`), and ambient depth shadows.
- **Typography:** Negative letter-spacing tracking (`-0.03em`) on headers with high-legibility tabular figures for operational metrics.

---

## 3. Relational Evidence Data Model

The database tier is designed around a fine-grained, auditable evidence graph:

```mermaid
erDiagram
    TENANT ||--o{ SOURCE : owns
    SOURCE ||--o{ SOURCE_VERSION : versions
    SOURCE_VERSION ||--o{ PASSAGE : segments
    PASSAGE ||--o{ CLAIM : generates
    CLAIM ||--o{ EVIDENCE_LINK : evaluates
    ASSESSMENT ||--o{ EVIDENCE_LINK : contains
    QUESTION ||--o{ ASSESSMENT : receives
    CLAIM ||--o{ CONFLICT : claim_a
    CLAIM ||--o{ CONFLICT : claim_b
    CONFLICT ||--o{ REVIEW_DECISION : adjudicates
    TENANT ||--o{ AUDIT_EVENT : logs
```

### Relational Entities (`prisma/schema.prisma`)

- **`Source`**: Operational directive container (e.g. *GlobalProtect VPN SOP*), carrying domain classification, authority rank, owner email, and perimeter tags (`scopeSite`, `scopeSystem`).
- **`SourceVersion`**: Revision tracking with immutable `fileHash`, `effectiveDate`, `expirationDate`, status (`ACTIVE`, `SUPERSEDED`, `QUARANTINED`, `DRAFT`), and supersession pointers.
- **`Passage`**: Discrete text units with character offsets, section headings, and vector indexing metadata.
- **`Claim`**: Atomic factual assertions extracted from passages with scoped validity keys.
- **`Conflict`**: Detected contradictions between claims, tagged by type (`DIRECT_CONTRADICTION`, `TEMPORAL_SUPERSEDED`, `SCOPE_OVERLAP`) and severity (`LOW`, `MEDIUM`, `HIGH`).
- **`ReviewDecision`**: Formal human-in-the-loop resolutions with rationale and scope overrides.
- **`AuditEvent`**: Cryptographically sealed log with SHA-256 payload checksums.

---

## 4. Tech Stack & Model Topology

### Technology Architecture

| Tier | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16 (Turbopack, App Router), React 19, Tailwind CSS v4, Lucide Icons, Framer Motion |
| **Backend** | NestJS 11, TypeScript 5, Express, Helmet, RxJS, Node.js 22 |
| **Primary RAG / NLI** | **Cohere Client V2** (`cohere-ai` v8.1.0) with **Command R+ (`command-a-plus-05-2026`)** |
| **Fallback LLMs** | Groq (`llama-3.3-70b-versatile`), Google Gemini (`gemini-2.0-flash`), OpenAI (`gpt-4o`) |
| **Vector Engine** | Pinecone Vector Store (768-dimensional cosine index) |
| **Database & ORM** | PostgreSQL (Neon AWS Serverless) with Prisma ORM |
| **Authentication** | Clerk (JWT token verification with zero-trust tenant resolution) |
| **Communications** | Brevo (Transactional email & notifications), ElevenLabs (Voice synthesis) |

---

## 5. Getting Started (Local Development)

### Prerequisites
- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **Package Manager**: `npm` (v10+)
- **PostgreSQL**: Neon cloud database or local PostgreSQL 16+
- **Cohere API Key**: Production or trial key from [Cohere Dashboard](https://dashboard.cohere.com/)
- **Clerk Account**: For application authentication

---

### Step 1: Clone & Install Dependencies

```bash
git clone https://github.com/Johanvasquezdev/supportmind-ai.git meridas
cd meridas

# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

---

### Step 2: Configure Environment Variables

#### Backend (`backend/.env`)
Create `backend/.env` with the following configuration:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-sample.us-east-1.aws.neon.tech/supportmind?sslmode=require"

# Server Ports & CORS
PORT=3001
FRONTEND_URL="http://localhost:3000"
NODE_ENV="development"

# Clerk Authentication
CLERK_SECRET_KEY="sk_test_..."
JWT_SECRET="generate-a-strong-32-byte-secret"
JWT_EXPIRES_IN="7d"

# Primary RAG Engine: Cohere Command R+
COHERE_API_KEY="your-cohere-api-key"
COHERE_CHAT_MODEL="command-a-plus-05-2026"

# Secondary / Fallback Providers
GEMINI_API_KEY="your-gemini-key"
GEMINI_CHAT_MODEL="gemini-2.0-flash"
GROQ_API_KEY="your-groq-key"
GROQ_CHAT_MODEL="llama-3.3-70b-versatile"

# Vector Store (Pinecone)
PINECONE_API_KEY="your-pinecone-key"
PINECONE_INDEX_NAME="supportmind"
EMBEDDING_MODEL="gemini-embedding-001"
EMBEDDING_DIMENSIONS=768

# Communications
BREVO_API_KEY="xkeysib-..."
```

#### Frontend (`frontend/.env.local`)
Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=Meridas
NEXT_PUBLIC_APP_VERSION=1.0.0

# Clerk Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard/chat
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard/chat
```

---

### Step 3: Synchronize Database & Ingest Pilot Corpus

Synchronize the relational schema with PostgreSQL:

```bash
cd backend
npx prisma db push
npx prisma generate
```

Ingest the 5 normative operational pilot directives, generate source versions, extract atomic claims, and seed the active contradiction:

```bash
npx ts-node seeds/seed-operational-pilot.ts
```

> **Ingested Pilot Corpus:**
> 1. `VPN-GlobalProtect-v3.0-Active-HQ.md` (`ACTIVE` — Port 8443, Duo Mobile Push MFA)
> 2. `VPN-GlobalProtect-v2.4-Superseded.md` (`SUPERSEDED` — Port 443, SMS OTP)
> 3. `Hardware-Custody-15-Day-Policy.md` (`ACTIVE` — 15-day maximum retention, warehouse check-in)
> 4. `Emergency-Server-Decommissioning.md` (`ACTIVE` — Mandatory dual-authorization)
> 5. `Zero-Trust-Access-Regional-Pilot.md` (`ACTIVE` — Regional pilot boundaries)

---

### Step 4: Launch Development Servers

#### Terminal 1 — Backend (Port 3001)
```bash
cd backend
npm run start:dev
```

#### Terminal 2 — Frontend (Port 3000)
```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Testing the Pilot Inquiries

You can test the system directly in the UI at [http://localhost:3000/dashboard/chat](http://localhost:3000/dashboard/chat) or via the direct evaluation CLI:

```bash
cd backend
npx ts-node --transpile-only scripts/run-pilot-direct.ts
```

### Pre-Configured Test Cases

#### Inquiry 1: VPN Gateway Configuration
- **Question:** *"What is the active port and MFA method for GlobalProtect VPN?"*
- **Perimeter:** Site = `HQ`, System = `VPN`
- **Expected Outcome:** `SUPPORTED`
  - *Claim 1:* Active port is 8443 (Score: $98\%$, citing *VPN v3.0 Active HQ*).
  - *Claim 2:* Mandatory MFA is Duo Mobile Hardware Push (Score: $97\%$, citing *VPN v3.0 Active HQ*).

#### Inquiry 2: Physical Hardware Custody
- **Question:** *"Can an engineer retain a lab laptop for 3 weeks without warehouse check-in?"*
- **Perimeter:** Site = `Lab`, System = `Hardware`
- **Expected Outcome:** `SUPPORTED` (Negative Rule Entailment)
  - Cites Section 1.1: Maximum physical retention is strictly 15 calendar days.
  - Requires physical presentation to Johan Vasquez at the warehouse upon day 15.

#### Inquiry 3: Emergency Server Decommissioning
- **Question:** *"What authorization is required for an emergency server decommissioning?"*
- **Perimeter:** Site = `Datacenter`, System = `Compute`
- **Expected Outcome:** `SUPPORTED`
  - Explicit written dual-authorization required.
  - Signatory 1: Johan Vasquez (Lead Systems Custodian).
  - Signatory 2: Director of Infrastructure Operations or CISO.

---

## 7. Conflict Investigation Desk Walkthrough

Navigate to [http://localhost:3000/dashboard/conflicts](http://localhost:3000/dashboard/conflicts):

1. **Review Inconsistencies:** The dashboard displays the live detected contradiction between **VPN v2.4 (Superseded)** and **VPN v3.0 (Active HQ)** regarding Gateway Port (443 vs 8443) and MFA (SMS vs Duo Push).
2. **Launch Adjudication:** Click **"Adjudicate Conflict"**.
3. **Choose Resolution Action:**
   - `OVERRIDE_AUTHORITY`: Confirms v3.0 supersedes v2.4 permanently.
   - `MARK_FALSE_POSITIVE`: Confirms valid temporal coexistence.
   - `REQUEST_DOC_UPDATE`: Triggers custodian notification.
4. **Log Immutable Audit:** Enter the operational rationale and submit. The system generates a cryptographic SHA-256 receipt:
   ```json
   {
     "conflictId": "d6ad7f00-c56c-4757-b75d-2ddccd390c5b",
     "action": "OVERRIDE_AUTHORITY",
     "actor": "johan.vasquez@bluehawk.tech",
     "checksumSha256": "8f3b...e71a",
     "timestamp": "2026-09-28T01:10:44Z"
   }
   ```

---

## 8. API Reference

All protected endpoints require a Clerk Bearer Token in the `Authorization` header.

### Operational Chat & Verification

```http
POST /chat
Content-Type: application/json
Authorization: Bearer <clerk-session-token>

{
  "message": "What is the active port for GlobalProtect VPN?",
  "conversationId": "optional-uuid",
  "mode": "answer"
}
```

```http
POST /chat/stream
Content-Type: application/json
Authorization: Bearer <clerk-session-token>

# Emits text/event-stream chunks:
# data: {"type":"token","content":"Active"}
# data: {"type":"done","decisionState":"SUPPORTED","evaluations":[...]}
```

### Conflict Desk

```http
GET /conflicts?status=DETECTED
Authorization: Bearer <clerk-session-token>
```

```http
POST /conflicts/:id/resolve
Content-Type: application/json
Authorization: Bearer <clerk-session-token>

{
  "decision": "OVERRIDE_AUTHORITY",
  "rationale": "SOP v3.0 has officially replaced v2.4 across all HQ ingress gateways."
}
```

---

## 9. Security, Privacy & Legal Governance

Compliant with [`docs/POLITICS.md`](docs/POLITICS.md) and [`docs/SECURITY_GENERAL.md`](docs/SECURITY_GENERAL.md):

- **Zero Client Trust:** Tenant IDs, user permissions, and rate limits are resolved exclusively from cryptographic server tokens.
- **Zero-Leakage Sanitization:** Automatic regex scrubbing for:
  - Private IPv4 addresses: `10.x.x.x`, `172.16-31.x.x`, `192.168.x.x`
  - Hardware MAC addresses: `XX:XX:XX:XX:XX:XX`
  - Bearer tokens and API keys
- **Dedicated Legal Endpoints:**
  - **Terms of Use:** [http://localhost:3000/terms](http://localhost:3000/terms)
  - **Privacy Policy:** [http://localhost:3000/privacy](http://localhost:3000/privacy)

---

## 10. Automated Tests & Quality Assurance

MERIDAS enforces continuous testing across unit, integration, and security layers:

```bash
# Run backend test suites (102 tests green)
cd backend
npm test -- --runInBand

# Compile backend TypeScript
npm run build

# Compile Next.js frontend (0 lint / type errors)
cd ../frontend
npm run build
```

---

## 11. Authors & Custodians

- **Johan Vasquez** — *Lead Architect & Systems Custodian*
- **Operational Systems Security Directorate** — *Infrastructure & Governance Oversight*

---

## 12. License

Proprietary software. All rights reserved. See [LICENSE](LICENSE).

The source is not open source. You may not copy, modify, distribute, sublicense, or run it except with written permission from the copyright holder. Paying for the hosted service does not grant a right to the source code. Third-party dependencies remain under their own licenses.
