# Cricket CV fixes

## Issue 1: payment succeeds but CV stays locked / dashboard shows "Create Your CV"

Root causes found:
1. **CV saves failed silently before payment.** Profile photos (up to 5MB) were stored as text (~7MB),
   which exceeds Vercel's 4.5MB request limit. The save failed, the error was ignored, and the player
   went on to pay for a CV that didn't exist in the database.
2. **Payment verification trusted the CV ID sent by the browser.** When that ID wasn't in the database,
   the update changed 0 rows but the server still replied "success". `cv-get` also generated a new
   random CV ID on every request (including the 15-second background sync), so the ID could drift.

Fixes:
- `CVBuilderForm.tsx`: photos are resized to max 800px JPEG on upload.
- `App.tsx`: the CV is saved (and the save confirmed) before Razorpay opens; save errors are shown.
- `cv-verify-payment.ts` (rewritten): requires the player's login token and finds the CV from the session;
  if no CV row exists it creates one so the payment is never lost; errors if the update affects 0 rows;
  returns the updated CV so the dashboard updates immediately.
- `cv-get.ts` / `cv-save.ts`: stable CV ID per player (`cv_<userId>`).
- Each successful payment (first or renewal) sets edits to 5 of 5.

## Issue 2: admin dashboard doesn't show registered / verified players

Root cause: the admin "Cricket CVs" tab only read the `cvs` table. Players who registered and verified
but hadn't saved a CV were never shown.

Fixes:
- New endpoint `api-src/get-cv-users.ts` (registered in `api/index.ts`) lists every account with
  email-verified status, whether a CV exists, and payment status.
- Admin "Cricket CVs" tab now shows a **Registered Players** table above the saved CVs.

## Issue 3: players and admin don't receive emails

Root causes found:
1. **Email failures were invisible.** The site sends email through Resend, whose `emails.send()` does not
   throw on failure; it returns an error object that the code never checked. If the domain isn't verified
   in Resend, the API key is missing/wrong, or the "from" address isn't allowed, every email silently fails
   while the site still tells the player "check your inbox".
2. **No admin email existed.** There was no code anywhere that emails the admin about CV registrations.
3. **Players whose email never arrived were stuck.** Registering again returned "user already exists",
   and there was no way to get a new link.

Fixes:
- New `api-src/utils/send-email.ts`: checks Resend's response and logs the exact reason in Vercel logs.
- `cv-register.ts`: tells the player if the email could not be sent; registering again with an
  **unverified** email now updates their details and sends a fresh link.
- Admin notification emails for: new registration, email verified, payment received
  (sent to `ADMIN_NOTIFY_EMAIL`, default thecricketadvisor@gmail.com).
- `cv-verify-payment.ts` and `cv-forgot-password.ts` use the same checked helper.
- Optional `SITE_URL` variable so links always use the real domain.

The most likely underlying cause is a Resend setup problem, which code alone can't fix. See the
environment-variable checklist below.

## Before redeploying: Vercel environment variables (Settings > Environment Variables)

| Variable | Needed | Notes |
|---|---|---|
| `POSTGRES_URL` | Yes | Set automatically if Vercel Postgres is connected |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Yes | Live keys from Razorpay dashboard |
| `VITE_RAZORPAY_KEY_ID` | Yes | Same as RAZORPAY_KEY_ID (used by the browser) |
| `RESEND_API_KEY` | Yes | From resend.com > API Keys |
| `RESEND_FROM_EMAIL` | Yes | Must be on a domain **verified** in Resend, e.g. booking@thecricketadvisor.com |
| `ADMIN_NOTIFY_EMAIL` | New, optional | Admin inbox(es), comma-separated. Default thecricketadvisor@gmail.com |
| `SITE_URL` | New, optional | https://thecricketadvisor.com |
| `CV_JWT_SECRET`, `ADMIN_PASSWORD` | Strongly recommended | Long random values |

In Resend > Domains, `thecricketadvisor.com` must show **Verified** (DNS records added at the domain
registrar). Until it is, Resend only delivers to the Resend account owner's own email address.
Changing `VITE_` variables requires a redeploy to take effect.

## Security fixes made along the way
- Removed the `test_payment_id` bypass in `cv-verify-payment`, `verify-payment` and
  `verify-skills-assessment` (anyone could unlock a CV/assessment without paying).
- `cv-verify-payment` now checks with Razorpay that the payment is real, matches the order and is
  at least the CV price, and records each payment ID once (no replay for free renewals).
- `save-cv` (admin edit counter) had no authentication: anyone could mark any CV as paid. Now admin-only.
- `cv-renew-plan` reset edits for free with no payment. Now admin-only.
- `cv-login` / `cv-auth-check` overwrote blank profile fields with fake data (a fixed mobile number,
  DOB "28", etc.) on every login. Removed.
- Admin login error message no longer displays the default admin password.
- Fixed a stray `}` in the admin CV status badge class.

## Still recommended (not changed, need decisions/access)
- Set `ADMIN_PASSWORD` and `CV_JWT_SECRET` in Vercel, then remove the hardcoded fallback passwords
  (`cricket2026`, `admin123`, `coach2024`) from the admin endpoints and `utils/admin-auth.ts`.
- `api-src/debug-db.ts` has no authentication. Remove it from `api/index.ts` or protect it.
- `cv-users-db.json`, `assessments-db.json`, `cvs-db.json` contain personal data (and password hashes)
  and are committed to the repo. Remove them from Git history if the repo is or was ever public.
- `api-server.js` (local dev server only) was not updated; Vercel uses `api/index.ts`.

## Fixing players who already paid but are still locked
Confirm the payment in the Razorpay dashboard first, then in Vercel > Storage > Postgres > Query:

    UPDATE cvs
    SET payment_status = 'Paid', download_status = 'UNLOCKED', identity_locked = TRUE,
        edits_used = 0, edits_allowed = 5,
        cv_data = (cv_data::jsonb || '{"paymentStatus":"Paid","downloadStatus":"UNLOCKED","identityLocked":true,"editsUsed":0,"editsAllowed":5}'::jsonb)::text
    WHERE email = 'player@example.com';

If that updates 0 rows, the player's CV was never saved: ask them to log in and complete the CV
(it will save now), then run the query again.

## Testing checklist
1. Register a new player: verification email arrives (check spam) and the admin gets a notification.
   If the player sees "could not send the verification email", open Vercel > Logs and search `[Email]`
   for the exact Resend error.
2. Click the link: player shows as Verified in Admin > Cricket CVs > Registered Players; admin gets an email.
3. Create a CV with a large photo, pay: success page, download works, dashboard shows Locked / 5 edits.
4. Log out and back in: dashboard still shows the paid CV.
5. Use 5 edits, renew via payment: edits reset to 5.
