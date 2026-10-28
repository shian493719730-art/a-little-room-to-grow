# A Little Room to Grow · integrated mirror

This is an independent website. The two previously published websites and the cam capcut project are preserved.

Flow: open the root URL → original 3D1 (flower on the right) → click its monitor Play button → complete original homepage, including the introduction and game → automatic transition to 3D2 after a winning result, or choose “End this visit” at any time → return to the homepage to review the ending, references, or resume.

`src/home-original.html` is an exact snapshot of the original homepage. The build adds only a separate integration bridge script; it does not rewrite or remove homepage content. Existing rules, support cards, animation, research, bilingual copy, credits and saved progress are retained. Saves on the new domain are independent of the old domain.

3D1 retains the original scene. 3D2 uses the original supplied logo, one original flower in the clear central desk area, and the requested floating title. A closing note distinguishes winning from leaving without completing the game.

Build: `node tests/build.mjs`. Deploy only `dist/`. The root `index.html` preserves the original standalone homepage for its existing regression tests.

## Published Play fix

Build the published single-file entry with `node tests/build-publish.mjs`. The entry embeds both 3D rooms, the complete original game, Three.js and the supplied logo. It includes a direct Play button, frame-identity messaging for opaque origins and a history fallback. The pixel-game source and rules are preserved. The original multi-file routes remain available.
