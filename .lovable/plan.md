## Goal

Turn the Wonder Canvas from "one long AI card" into the original **Curio adventure loop**:

```text
Question → Spark Answer → Deep Dive (one section at a time) → Quiz/Activity → Make Mode → Reward
```

One seamless adventure, not a pile of AI widgets. Text gets much shorter, visuals and taps carry the load.

## What changes for the child

**1. The ask screen (feed level)**
- Big prompt "What do you want to explore today?" with text + voice input (voice already exists) and an image-upload ask ("What's this?").
- **Mood Sparks**: Explore / Build / Challenge / Calm — a single tap that shapes the tone and the type of deep dive generated.
- Curio history strip: reopen any earlier question and continue it.
- Daily challenge + Surprise me stay.

**2. Spark Answer (instant, ~40 words)**
- Arrives in ~1 second: one punchy answer line, one surprising fact, one generated illustration.
- Below it: **Table of Contents card** showing 3-5 deep-dive section titles with emoji, plus a big **Start Deep Dive** button. No wall of text on arrival.

**3. Progressive Deep Dive**
- One section on screen at a time. Each section = a headline, 2-3 sentences max, an image or diagram, then a **Continue** button.
- Per-section action chips: *Explain with a story* · *Show me a picture* · *Read aloud* · *Simpler / Go deeper*.
- Heavier generations (image, story, longer content) show a one-tap permission prompt first, so nothing expensive fires unasked.
- A slim progress bar shows how far through the Curio the child is.

**4. Quick learning interactions (interleaved, one at a time)**
- Mid-dive checkpoints rotate between: multiple-choice question, flip card, myth-vs-fact card, riddle. Never more than one on screen.
- Instant correct/incorrect feedback with a one-line explanation, combo streak and Sparks (already built, reused).

**5. Make Mode finale**
- Every Curio ends with one Make action matched to the topic and mood: make a comic, write a story, design a poster, create a quiz, build an explainer, or a printable/offline mini-project with "Mark as complete" + optional photo proof.
- Output saves to the **Trophy Shelf** (extends the existing Journal drawer).

**6. Rewards**
- Sparks, badges, streak already exist. Add: quest completion card at the end of a Curio, certificate option, and a "Proud Moment" card surfaced to the parent zone.

## Technical plan

**Edge functions**
- `wonder-spark` (new): tiny, fast call — returns `{answer, wow_fact, sections[]}` only. Gemini Flash, streamed. This is what makes the first response feel instant.
- `wonder-section` (new): generates one deep-dive section on demand `{heading, body(2-3 sentences), image_prompt, checkpoint?}` where checkpoint is a quiz / flip card / myth-fact / riddle chosen by rotation.
- `wonder-make` (new): generates the Make Mode brief (comic panels, story, poster copy, printable steps).
- Images: reuse the existing `generate-contextual-image-fast` function, called per section behind the permission prompt.
- Keep `wonder-explain` for the "give me everything" path but stop using it as the default entry.

**Frontend**
- Split the 1,260-line `WonderCanvas.tsx` into: `WonderAsk` (prompt + mood + history), `CurioThread` (spark answer + TOC + dive state machine), `DiveSection`, `Checkpoint` (quiz/flip/myth/riddle variants), `MakeMode`, `TrophyShelf`. Existing sparks/badges/streak/TTS/journal logic moves into a `useCurioProgress` hook unchanged.
- Curio state machine: `spark → toc → section[i] → checkpoint → … → make → reward`.
- Persistence: Curio threads saved so history reopen works (localStorage first, backend table if you want them across devices).

**Design**
- Midnight Playground palette, glassmorphism, Space Grotesk/DM Sans — unchanged. Single-column, large touch targets, one decision per screen.

## Trade-offs

- Per-section generation means more LLM calls per Curio, but each is small and only fires when the child taps Continue — total cost is similar and perceived speed is far better.
- Images cost the most; the permission prompt keeps them opt-in rather than auto-generating for every section.
- Generated video and mini-podcasts from the original spec are **out of scope for this pass** — they're slow and expensive; audio narration is covered by read-aloud. Can be added later.

## Order of work

1. `wonder-spark` + new ask screen with Mood Sparks and instant Spark Answer + TOC.
2. `wonder-section` + progressive dive with Continue, action chips, permission prompts, images.
3. Checkpoint components (quiz, flip card, myth-vs-fact, riddle) interleaved one at a time.
4. `wonder-make` + Make Mode, Trophy Shelf, quest completion, certificate, Proud Moment.
5. Curio history and continue-earlier-thread.
