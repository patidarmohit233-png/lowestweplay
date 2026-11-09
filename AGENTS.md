# Project architecture decisions

- Keep customer review validation schemas in `src/lib/customer-reviews.ts`, while review submission and display live in a focused UI component so the homepage and admin moderation stay lightweight and separate.
- Enforce one lifetime customer review per case-insensitive WePlay ID in the database, because client-only limits can be bypassed.
- Enforce Amazon Pay voucher code format (exactly 14 alphanumeric characters) in both checkout and the submission RPC because client-side validation can be bypassed.