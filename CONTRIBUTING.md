# Contributing to MAKHEX

Thank you for helping the next maker build more confidently.

## Project corrections
Use GitHub Discussions for questions and work logs. Create an issue or pull request for reproducible fixes to a BOM, wiring diagram, code sample, firmware version or safety note.

Include the exact manufacturer, board revision, SDK/library versions, expected versus observed behavior, and relevant test measurements. Separate unverified hypotheses from tested results; cite the upstream datasheet or vendor documentation.

## Product additions
Do not publish a product price, availability or checkout link until the qualification checklist in `docs/catalog-qualification.md` is completed.

## Local checks
```sh
npm ci
npm run check
npm run build
npm run qa
```

Never publish account keys, private checkout data or images without permission and a proper license.
