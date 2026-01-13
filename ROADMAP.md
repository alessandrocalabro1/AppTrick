# APP-CREATOR Roadmap

## Phase 1: MVP (Completed)
- [x] Monorepo setup (Next.js + NestJS).
- [x] Basic Wizard for project creation.
- [x] Code Generation Engine (Template-based File System generation).
- [x] Database for Projects/Users (SQLite/Prisma).
- [x] Downloadable Assets (ZIP).

## Phase 2: Enhanced Generation & Preview (Next 2 Weeks)
- [ ] **Live Preview**: Mount generated apps in a sandbox (e.g., Docker containers or subdomains) so users can interact before downloading.
- [ ] **Smart Templates**: Use true AST (Abstract Syntax Tree) transformation instead of string replacement for more robust code generation.
- [ ] **AI Integration**: Connect LLM (OpenAI/Gemini) to parse "plain english" descriptions into the `config` JSON used by the generator.

## Phase 3: Marketplace & Community (Month 1-2)
- [ ] **Template Marketplace**: Allow users to submit their own starters.
- [ ] **Versioning**: Support "v2" generation of an existing project with diff/patch application (git-based).
- [ ] **Deploy Integration**: One-click deploy to Vercel/Netlify/AWS.

## Phase 4: Enterprise (Month 3+)
- [ ] **Teams & Org Management**.
- [ ] **Custom Cloud Providers**.
- [ ] **Audit Logs & Security Compliance checks**.
