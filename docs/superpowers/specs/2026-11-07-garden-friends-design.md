# Mew Quest: Garden Friends

## Intent
Extend the existing gentle, linear garden platformer so Mew must greet every named cat before reaching Jenn. Add raised meeting places, lighter Dreamies, and Samuel at the doorstep. Preserve the current soft garden aesthetic, title page, approved Jenn illustration, chiptune soundtrack, controls (C jumps), safe checkpoint returns, and current Site audience.

## User requirements and agreed choices
- Automatic greetings (user selected this over a new greet button).
- Friendly greeting cats are Ernie, Rosie, Darwin, and Minka. Coco remains a moving black-and-white cat to avoid and jump over; Mew must not greet Coco.
- Coco patrols back and forth. Every friendly cat is stationary, including Darwin and Minka sitting together.
- Rosie is a tabby with white toes. Darwin is a brown tabby.
- Coco and Minka are black and white and must look different.
- Darwin and Minka sit together. Mew’s exact reply is `hi minka and darwin`; this counts for both cats.
- Keep the route linear; different platform heights require jumping to some cats.
- All four friendly-cat greetings are required for completion. Coco is excluded from greeting progress.
- Dreamies become a lighter brown.
- Samuel is a small boy beside Jenn, with blonde hair, brown eyes, and a Minecraft T-shirt. Mew must say `hi samuel`.

## Approaches
1. Automatic greetings on landing beside each encounter, with visible progress and a required-greetings finish check. Selected automatic interaction preserves the existing Ernie controls and works equally on touch.
2. Press a new greet key beside each cat. Rejected by the user’s automatic-greeting choice; adds a control and mobile button.

## Proposed route and builder choices
Three friendly meeting stops along the existing left-to-right journey: Rosie, Ernie near the midpoint, then Darwin and Minka together. Coco patrols a separate clear stretch of the route and must be jumped over. Exact platform spacing is a builder decision constrained by reachability tests and gradual difficulty. Some stops sit on raised garden ledges reached by stepping-stone platforms. The greeting proximity check requires Mew to be at the cat’s height, so running below or flying above does not count.

Coco: mostly black tuxedo, white chest and paws. Minka: mostly white with black ears, back/saddle patches and tail, plus a contrasting collar. Rosie: warm grey-brown tabby with conspicuous white toe tips. Darwin: deeper brown tabby. Ernie remains a bigger ginger tom with blue collar. All cats have readable name labels; only the four friendly cats have greeting speech bubbles. Friendly cats remain stationary and do not reset Mew. Coco moves back and forth and, like garden objects and falling, causes a safe checkpoint return on contact. Replace duplicate unnamed patrol cats with one distinct moving Coco, preserving the avoid-and-jump encounter.

Mew replies `hi rosie`, the existing `hi ernie`, and the requested combined `hi minka and darwin`. There is no `hi coco` greeting. Greeting bubbles follow Mew briefly. Cat progress is retained after safe returns and cleared on replay. The HUD lists progress and next/missing names. Optional small gates/signs may prevent continuing past an encounter without greeting, provided they are friendly, visibly explained, and cannot strand Mew or block the approach to the cat. Finish cannot trigger with a missing greeting.

## Samuel and the reunion
Samuel stands beside Jenn in the existing final garden area. His blonde hair, brown eyes, and green Minecraft-themed T-shirt with a blocky Creeper motif are rendered as a readable small illustrated character. Reaching the family after all cats have been greeted displays Mew’s `hi samuel` bubble for at least two seconds before the ending popup appears, so the popup does not hide her greeting. Pausing freezes this interval.

The final popup must still contain only this exact sentence, with no heading, footer, or replay button:

Mew is reunited with Jenn! Time to watch Coronation Street together on the sofa with some crisps and Dreamies :)

## Implementation scope
Continue dependency-free static HTML/CSS/Canvas/JavaScript. Separate shared encounter data, greeting rules, and character rendering where this reduces duplicated cat logic. Preserve original movement tuning unless reachability checks demonstrate a needed small adjustment. Keep rendering and collision geometry consistent. No accounts, backend, combat, physical harm, or branching map.

## Acceptance checks
- Every named cat is present, distinguishable, and supported by a reachable platform. Coco alone patrols; the four friendly cats remain stationary.
- Coco is safely jumpable, returns Mew to a checkpoint on contact, has no greeting, and is excluded from greeting progress.
- No greeting from the wrong height; landing near each encounter records it once.
- Combined Darwin/Minka encounter records both names with exact combined reply.
- Missing greetings prevent completion and clearly identify what remains; no route or gate soft-lock.
- Greetings survive checkpoint returns, pause consistently, and reset on replay.
- Every route gap and raised meeting ledge is reachable with existing jump/dash controls.
- Lighter rectangular Dreamies still collect once and remain optional.
- Samuel is grounded beside Jenn, `hi samuel` remains visible for at least two seconds, and completion still shows only the exact final sentence.
- Title screen, C jump, sound toggle/pause, and fallback rendering continue to work.
- Run all simulation and renderer integration tests; inspect desktop/mobile layout if browser infrastructure is available, otherwise report that limitation.
