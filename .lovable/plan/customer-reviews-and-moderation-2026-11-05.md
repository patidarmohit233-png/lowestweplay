# Customer reviews and moderation

## Goal
Let verified visitors submit a written review, show it publicly only after approval, and let the admin approve or reject submissions. Show a 4.9-star rating card without showing a review count.

## Work
1. Add a customer-reviews store with reviewer WePlay ID/name, review text, rating, moderation status, and timestamps. New submissions always start pending. Add server-side validation and narrowly scoped public access: visitors can submit pending reviews and read approved reviews only.
2. Add a compact review form in the existing homepage reviews section for verified buyers. Validate rating and text with Zod, submit through a database function, and show a clear pending-review confirmation. Load and display only approved customer reviews; do not expose a total count.
3. Add a Reviews tab to the admin page with pending submissions and approve/reject actions, refreshing the list after each decision.
4. Replace the static review cards with approved customer submissions, add the requested 4.9-star card without a count, and remove the hard-coded review count from structured data.
5. Verify the review submission, pending visibility, approval/rejection, and public display flow; check the build and current diagnostics.

## Technical details
- Use an additive database migration through the project migration tool, including explicit grants and RLS policies.
- Use SECURITY DEFINER functions with fixed `search_path` for submissions and moderation/list operations; validate all inputs in both Zod and the database.
- Keep the existing admin sign-in/gate experience as requested. Important limitation: it is browser-only, so it does not securely restrict moderation database functions from determined callers; this follows the current admin access model.
- No generated images; use existing icons and semantic design tokens.
