# FAC outreach, version 2 (26 Oct 2026)

Version 1: about 65 emails to FAC auditees asking for a 20-minute call. Zero calls. This is the change.

## What changes and why

| Version 1 | Version 2 | Why |
|---|---|---|
| Ask: "book a 20-minute call" | Ask: "reply **yes** and I'll send it" | A call with a stranger is a big ask. A one-word reply is not. Get the reply first, the call second. |
| Offer: the service | Offer: the **retest note for their finding, already written** | Give something specific and useful before asking for anything. It proves you read their audit. |
| First paid step: $2,000 Review | First paid step: **$650 Finding Check**, fee credited if they go on | Under most finance directors' own sign-off limit. |
| Everyone with a finding | **Repeat findings first**, then audits accepted in the last 90 days | A repeat finding means the fix failed once. A recent audit means the corrective action plan is due now. |
| One email, or a sequence with the same ask | 3 emails, each giving something new | Each follow-up earns its place by adding value, not by repeating the ask. |

## Who to email first

1. Repeat finding (prior-year reference in the finding), in procurement, allowable costs, subrecipient monitoring, reporting, or cash management.
2. Audit accepted by the FAC in the last 90 days (corrective action plan still live).
3. Federal spend between $1M and $25M. Big enough to need help, small enough to have no compliance team.
4. Never anyone already emailed in version 1, until 30 days after their last email. Then they get the "reset" email below, once.

## Email 1, new prospects

**Subject:** [Finding number]: what your auditor will retest

Hi [first name],

Your [fiscal year] Single Audit lists [finding number] on [area] for [program][, a repeat of [prior finding number]].

I wrote a one-page note on what [auditor firm] is likely to test for that finding next year, and the record each test looks for. It is specific to your finding, and free.

Reply "yes" and I'll send it today.

Kelvin Fawehinmi
FOKT Consulting LLC · 30 N Gould St Ste R, Sheridan, WY 82801
foktconsulting.com · Reply "stop" and I won't write again.

## Email 2 (day 3, no reply)

**Subject:** Re: [Finding number]: what your auditor will retest

Hi [first name],

One line from the note, so you can judge if it's worth having: for [area] findings, the auditor usually samples [the specific record, e.g. "the quote comparison for purchases over the micro-purchase threshold"] dated after the fix. If that record does not exist for every sample, the finding repeats, even with a new policy.

The full note is yours if you reply "yes".

Kelvin

## Email 3 (day 7, no reply)

**Subject:** Re: [Finding number]: what your auditor will retest

Hi [first name],

Last note from me. If [finding number] is handled, I'm glad.

If it isn't, the fastest check is a one-week Finding Check: I read the finding, your procedures and a few transactions, and send a written list of what to fix before fieldwork. $650, credited in full if you go on to a full Findings Review. A sample of the output: foktconsulting.com/samples/test-map

Kelvin

## The "reset" email, for the 65 already contacted (once, 30 days after their last email)

**Subject:** I wrote the [finding number] note anyway

Hi [first name],

I wrote to you about [finding number] a few weeks ago. I went ahead and wrote the one-page retest note for it. Reply "yes" and I'll send it, no call needed.

Kelvin

## When someone replies "yes"

1. Send the note the same day, written for their finding. That is the actual sale.
2. End the note: "If you'd like this fixed before fieldwork, the Finding Check is $650 and takes a week. Reply and I'll send a one-page scope."
3. Only then offer a 20-minute call, for people who ask questions.

## Before the next batch: deliverability

SPF and DMARC on foktconsulting.com are set for Zoho. DKIM could not be confirmed from outside.

- In Zoho Mail admin, check **Email authentication → DKIM** is "Verified" for foktconsulting.com. If not, add the record Zoho gives you in Cloudflare DNS.
- Send from Zoho (kelvin@foktconsulting.com) only. If the other account sends through any other service (Gmail, Resend, an outreach tool), that service must be added to SPF and have its own DKIM, or emails land in spam.
- Send 20 to 30 a day at most, spread over the day. Plain text, no images, one link at most in email 1 (none is better).
- Send yourself one test first and check it lands in the Gmail inbox, not Promotions or Spam.

## Correction after reading the Sent folder (26 Oct 2026)

I wrote the table above before seeing the real emails, and part of it is wrong. Version 1 was not a generic "book a call" pitch. It quoted the auditor's own words, gave the audit acceptance date and the funder decision deadline, and already offered the free retest note ("Want me to send it?") with the call link only as an alternative. The two asks were already close to "reply yes".

What the mailbox actually shows (Zoho, kelvin@foktconsulting.com):

- About 50 first-touch emails sent 15 to 23 October, plus follow-ups. 94 items in Sent.
- 2 replies, both hard opt-outs ("not interested, please remove me" and "No. Go away"). Those two addresses must never be emailed again. One out-of-office reply. One bounce (hnkop.org).
- 0 positive replies. At typical cold B2B response rates of 1 to 3 percent positive, about 50 emails is too few to conclude the offer is broken. Expect the first positive reply somewhere between 100 and 300 well-targeted sends.

What probably still helps, in order of confidence:

1. **Shorter first email.** Version 1 is about 190 words with six bullets. Bullets headed "What I do" and "Why me" read as a template. Target 60 to 80 words, no bullets, one quote from their audit, one ask.
2. **Keep the opening exactly as it is** (the quote, the dates). That is the strongest part.
3. **Add the $650 Finding Check only in email 2 or 3**, never in the first email.
4. **Honor opt-outs permanently**: keep a suppression list (opt-outs and bounces) and check every batch against it before sending.
5. **Verify DKIM in Zoho** (SPF and DMARC are in place). The DMARC reports arrive as zipped attachments that could not be read from the web page. Unzip one to see pass or fail per sending source.
