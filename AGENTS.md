# Project architecture decisions

- Keep customer review validation schemas in `src/lib/customer-reviews.ts`, while review submission and display live in a focused UI component so the homepage and admin moderation stay lightweight and separate.
- Enforce one lifetime customer review per case-insensitive WePlay ID in the database, because client-only limits can be bypassed.
- Normalize Amazon Pay pasted codes by removing separators and limiting to 14 alphanumeric characters; enforce the exact format in checkout and the submission RPC because client-side validation can be bypassed.
- Keep legacy order/payment RPCs until all live website deployments are confirmed updated, because older clients may still call them.