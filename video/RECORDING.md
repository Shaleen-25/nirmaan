# Record your own narration

Listen to `out/nirmaan-demo-guide.mp4` on earphones for pace, then record the lines below **in one take**.

- Phone voice memo is fine. Quiet room (curtains, bed, closet), phone a hand's width from your mouth.
- **Pause 2–3 seconds between lines** (count "one-thousand-two"). That's how the lines get split; pauses *inside* a line should stay short.
- Don't worry about matching the guide's timing exactly. The video re-times every scene to your pace.
- Fluffed a line? Pause, and re-read the **whole line**. Then tell me which line had a retake.
- Save it as `video/public/vo-full/narration.m4a` (or .mp3/.wav), then from `video/` run `npm run align`, `npm run script` and `npm run render`.

`npm run align` transcribes the take (ElevenLabs Scribe, cached as `narration.transcript.json`), matches it to the script even where you ad-lib, cuts one clip per line on word boundaries, drops false starts that trail off ("I know it's…"), and levels the voice. Every visual cue and caption is then timed to your actual words. The line text in `src/vo-lines.json` is updated to what you said, so the table below is the original script.

| # | Line |
|---|---|
| 1 | Be honest. Does every chai-sutta break at the office, every house party with friends, end with the same question… where the hell is all my tax money going? |
| 2 | Here's the thing. There are three Indias. India 1: the ultra-rich. They invest, they create jobs, so the government listens. India 3: the underprivileged. They get schemes and subsidies to lift them out of poverty. And then there's India 2. Us. The salaried, corporate crowd. |
| 3 | We pay up to 30% tax. We still pay for our own water, security and schools. And we get zero say in how a single rupee is spent. |
| 4 | What if you could choose? |
| 5 | A jogging track in your neighbourhood park. EV chargers, because you're betting big on electric. Garbage trucks that actually show up. Or India's own chip labs. |
| 6 | Meet Nirmaan. Your tax. Your say. |
| 7 | Now, not every rupee can be opened up. Defence, interest, the states' share: that 90% keeps India running. |
| 8 | But the debatable slice could be decided by the people who pay for it. Nirmaan starts with 10%. |
| 9 | Say you pay ₹8 lakh in income tax. Nirmaan tears off your 10%: ₹80,000, yours to direct. |
| 10 | Browse projects in the city you live in, the hometown you grew up in, or across India. Back the jogging loop by your lake, fast chargers for the nation, a library back home, and India's chip labs. |
| 11 | Split it however you like. No quotas. |
| 12 | Hit confirm, and your money is minted as purpose-bound e-Rupee: digital rupees that can only be spent on the project you picked. |
| 13 | Then, the best part. Watch your money ride the Money Metro: wallet, escrow, agency, vendor… until your project goes live. Every hop on a public ledger. Every milestone with geotagged proof. |
| 14 | Don't see your idea? Pitch it. Turn it into a campaign, share it with your society group and your running club, and rally verified vouches. |
| 15 | So when the government plans next year's budget, there's already a ranked list of what India's taxpayers want built. That's the feedback loop. |
| 16 | For the government, it means transparent governance, and the trust of the generation that pays for it. |
| 17 | For you, it's the pride of knowing you're not just paying for India. You're building it. |
| 18 | I know, it's a far-fetched idea, and you're probably already thinking of ten edge cases. Good. Shoot them my way. |
| 19 | I'm building this in public, and your feedback shapes what comes next. Try it. Break it. Tell me what you think. |
| 20 | Nirmaan. Your tax. Your say. |
