# Project architecture decisions

- Keep customer review validation schemas in `src/lib/customer-reviews.ts`, while review submission and display live in a focused UI component so the homepage and admin moderation stay lightweight and separate.
- Enforce one lifetime customer review per case-insensitive WePlay ID in the database, because client-only limits can be bypassed.
- Keep restricted-plan refund eligibility helpers in `src/lib/refunds.ts` and enforce the same restriction in database RPCs, because browser-only checks are bypassable.
- Keep supported voucher payment methods and their customer-facing labels/instructions in `src/lib/payment-methods.ts`, and validate the selected method in the order-creation RPC so checkout and stored orders stay aligned.