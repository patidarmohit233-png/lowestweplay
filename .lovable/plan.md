## Plan: Footer & Header Trust Signals

Enhance the site header and footer to maximize trust, improve navigation to policy pages, and incorporate sitewide trust signals.

### Header Updates
- Center and enlarge the brand logo for a more professional, official look.
- Add primary navigation links: "Buy & Sell ID" (pointing to escrow) and "Trust & Safety".
- Ensure the profile icon (for logged-in users) is prominent and functions as the primary account hub.
- Use a glassmorphism background for the header.

### Footer Updates
- Reorganize footer links into logical columns: Support, Legal, and Services.
- Add a "Trust & Safety" section in the footer with icons.
- Add trust badges directly into the footer:
  - **Secure Payment** (Lock icon)
  - **Instant Delivery** (Zap icon)
  - **24/7 Support** (Message icon)
  - **100% ID Safe** (Shield icon)
- Integrate the mandatory disclaimer into a high-trust banner at the very bottom.
- Add more prominent social/contact links.

### Visual Enhancements
- Use a soft purple/indigo theme for trust indicators.
- Apply `backdrop-blur` and subtle borders to all fixed/floating components.
- Ensure 100% mobile responsiveness.

### Technical Details
- File: `src/pages/Index.tsx` (Footer implementation)
- File: `src/components/ProfileMenu.tsx` (If header-related tweaks are needed)
- We will consolidate the `TRUST_BADGES` constant and reuse it in the footer.
