# Agentic AI SaaS Motion Batch

Branch-only production package for ten individual 8-second SaaS motion explainers.

## Concepts

1. Autonomous Task Orchestrator
2. Multi-Agent Collaboration
3. Tool-Calling Agent
4. Planning + Reflection Loop
5. RAG Knowledge Agent
6. Human-in-the-Loop Approval
7. Persistent Memory
8. Self-Healing Workflow
9. Agentic Customer Support
10. Agentic Data Analyst

## Art direction

- Light UI
- Vibrant concept-specific accent palettes
- Minimalist modern vector/SVG construction
- Brand-agnostic surfaces and copy
- Internal micro-motion on active UI elements
- Authored camera/framing changes and readable holds
- Deterministic 8-second timeline via `window.OPENER.seek(t)`

## Delivery target

Each concept is rendered independently to:

- 3840 x 2160
- 30 fps
- H.264 MP4
- CRF 10, medium preset
- no audio
- five representative QA frames
- FFprobe metadata and repository technical-verification report

The encoded source is stored as `batch.html.gz.b64` only to keep the temporary
project payload compact for connector-based branch transfer. The CI workflow decodes
it to a temporary HTML scene before rendering. Generated MP4 media is uploaded as
workflow artifacts and is not committed to the repository.
