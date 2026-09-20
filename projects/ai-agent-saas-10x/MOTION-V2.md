# Motion V2 — Fluid Rebuild

This revision replaces the first batch's repeated reveal/lerp/drift pattern with a deterministic spring-driven motion system.

## Reference principles applied
- Continuous position and velocity through spring response rather than abrupt velocity changes.
- Purposeful motion: animation communicates routing, handoff, selection, processing, or resolution.
- Product fidelity: interactions behave like a real interface demo, not a slideshow.
- State-driven micro-interactions: contact reactions, press compression, pulse/settle, destination response.
- Camera safe copy lane: headline is separated from the authored product camera so reframing does not crop the marketing copy.

## Motion system
- Analytic damped spring response for entrances, target changes, and settle.
- Multi-target camera tracking with distinct framing states.
- Catmull-Rom curved paths for cursor/packet/orb travel.
- Interaction impulses only at semantic contact moments, avoiding constant idle wobble.
- Burst → breath → burst pacing with readable landing states.
- Individual choreography per concept; no shared one-size-fits-all reveal sequence.

## Concept-specific changes
1. Agent Inbox — requests physically route into agent lanes; cursor follows a curved path; lanes react at contact.
2. Research Map — query expands into evidence nodes; route draw and answer reveal are causally connected.
3. Meeting Copilot — transcript cadence drives action extraction and calendar handoff.
4. Revenue Agent — lead moves through qualification stages before outreach and booking resolve.
5. Support Resolution — ticket context builds into a drafted response and resolved state.
6. Finance Ops — invoice receives scan, anomaly reaction, approval chain, and cash-flow payoff.
7. Incident Agent — log build, root-cause isolation, remediation sequence, and health recovery are connected.
8. Daily Agent — signals feed a plan while an assistant orb tracks the workflow.
9. Agent Team — packet travels a curved multi-agent handoff path and each agent reacts on contact.
10. Knowledge Agent — documents collapse toward embeddings, search activates, beam transfers context into the final answer.

## Delivery
- 3840×2160 H.264 High Profile
- 24 fps
- 8 seconds each
- approximately 14.5–16.7 Mbps actual bitrate
- no branding, no audio
