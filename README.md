# Royal Crown Dental Care: website concepts

Two concept websites for **Royal Crown Dental Care**, the dental and implant clinic of Dr. Mohammed N. Hamid and Dr. Luvay M. Hamid in Husseini Manzil, off Haile Selassie Avenue, directly opposite the Royal Court Hotel in Mombasa CBD.

| | Concept | Folder | Follows | Look |
|---|---|---|---|---|
| A | Professional | `site-a-professional/` | [Dental Health, Home A](https://dental-health-clinic-template.webflow.io/homepage/home-a), made bright | Light Outfit type on white and sky blue, royal blue actions and the crown's gold. A laughing-patient film in the hero with the Google rating and live opening hours, a credentials ticker, six reasons in a floating card, a statement that lights up word by word, the clinic film that opens from a card to full width, a pinned rail of twelve treatment cards, "book by what you need" rows with a floating picture, real results beside a case list, both dentists, the real clinic in drifting columns, reviews, booking, questions, map, and a closing wall of smiling faces |
| B | Lively | `site-b-lively/` | [TNC Dento](https://tnc-dento.webflow.io/), made vibrant | Gabarito headlines and Figtree text on aqua, royal blue, sunny gold and coral. "Smile like royalty" with a bouncing crown and a collage of smiles that follows the pointer, stickers, icon cards, a filterable treatment grid, a three-tap smile quiz, tilted before-and-after cards, a dentist slider band, a belief slider, a two-minute brushing timer for kids, tip cards, a reviews belt, a sunny finale with a belt of smiling faces, confetti when a visit is booked |

`index.html` at the root is a chooser that links to both.

**Live:** https://23f3000111.github.io/royal-crown-dental-concepts/

## In both concepts

- **Booking** (`shared/js/booking.js`), five steps:
  1. Reason: check-up, toothache or emergency, implant consultation, crowns or dentures, veneers or whitening, filling or root canal, child's visit, extraction, something else. A toothache brings up the emergency numbers straight away.
  2. Dentist: Dr. Mohammed N. Hamid, Dr. Luvay M. Hamid (recommended for implants) or the first available; who the visit is for; first visit or returning.
  3. Day and time: the next twelve open days in Mombasa time, morning and afternoon slots that respect the lunch break and Saturday half day, some shown as taken, and "give me the earliest free time".
  4. Details: name, Kenyan mobile, email, child's name, medical cover, how to confirm (WhatsApp, call, SMS, email), notes, reminder, consent. Checked as you type.
  5. Review with edit links, then **Send on WhatsApp** (the whole request written out to the clinic's number) or **Send by email**. The confirmation shows a reference, a four-stage tracker, "Add to calendar" (an .ics file with a two-hour reminder), directions, print and "book another visit".
  The draft survives a reload, a returning visitor is greeted by name with their details filled in, and every "Book" button on the page (treatments, dentists, quiz, rows) fills in the reason and dentist first.
- **Question form**: name, mobile, email, topic, question with a counter, reply preference, consent; sends on WhatsApp or by email and shows a thank-you with a reference.
- **WhatsApp chat** (`shared/js/chat.js`) dressed as WhatsApp: green header, "online" and "typing…", ticks that turn blue, quick replies, treatment, dentist and before-and-after cards, a location bubble. Rule based with no server. It answers hours (live, in Mombasa time), location, prices, insurance, implants and every treatment, toothache (emergency numbers and first aid), nervous patients, children, pregnancy, braces, bad breath, gums and sensitivity, in English with Swahili and Arabic greetings. It **books a visit inside the chat** (reason, day, time, name, mobile) and hands it to WhatsApp or opens it in the booking form. "Continue on WhatsApp" passes the conversation to the real number.
- **Before and after sliders** (`shared/js/compare.js`): drag, click or use the arrow keys; each one sweeps once when it comes into view. Five real cases from the clinic's Facebook page, plus the three-step implant case inside the implant guide.
- **Pop-ups** (`shared/js/modals.js`): twelve treatment guides (what it is, who it's for, steps, time, aftercare, a question and answer, and the real case where there is one), both dentist profiles, each case at full size, four smile tips, and "Watch a visit", a five-chapter film that plays like stories.
- **Google Maps** embed of the clinic, directions link, live open, lunch-break or closed status, Facebook, Instagram, WhatsApp and Google links in the header, footer, visit section and chat.
- **Motion**: GSAP with ScrollTrigger and SplitText, Lenis smooth scrolling (wheel only). Split-line and letter reveals, clip-path wipes, scrubbed parallax, a pinned horizontal treatment rail (A), word-by-word statement (A), drifting columns (A), a pointer-led collage, bouncing stickers and confetti (B), velocity-aware marquees, magnetic buttons, hover tilts. `prefers-reduced-motion` turns it off and everything stays visible.
- Sans-serif only, bright throughout, laptop first (checked at 1440 × 900).

## Bookings and questions have no inbox yet

GitHub Pages cannot receive form posts, so a request is handed to WhatsApp (0722 901 521) or the email app, and also kept in the visitor's browser (`localStorage`: `rc-bookings`, `rc-questions`, `rc-patient`, with the unfinished form in `rc-booking-draft`). To receive requests directly, point `send()` in `shared/js/booking.js` (and the question form below it) at a form service such as Formspree or Web3Forms with a `fetch()` POST of `rec`, or at the clinic's practice-management system. Free and taken times are a demonstration (a fixed pattern per day); a live diary would replace `RC.slotTaken`.

## What is real and what to confirm with the client

**Real (from the clinic's own material):**
- The logo (lifted off the clinic's Facebook artwork; nothing redrawn), the entrance, signboard, treatment rooms, the panoramic and 3D scanner, the carved door and the reception (Facebook and Google Maps photos), the "smile" artwork room and the dentists at work (Google Maps photos).
- Five before-and-after cases and the implant case on the lower right first molar, all posted by the clinic on Facebook. They were cut from the posts, enlarged and lined up; the teeth were not retouched.
- Dr. Mohammed N. Hamid, BDS (Nairobi), Dental Surgeon, and Dr. Luvay M. Hamid, BDS (Nairobi), MSc Implantology (UK), Dental & Implant Surgeon (the clinic's signboard).
- Consultation hours Monday to Friday 8:30 am to 12:30 pm and 2:00 to 5:00 pm, Saturday 8:30 am to 12:30 pm (signboard; Google lists 8:30 to 5 without the break), Sunday closed (Google).
- Emergency numbers 0738 420 070 and 0722 901 521 (signboard and Facebook), landline 041 222 5429, royalcrowndentalcare@hotmail.com, Husseini Manzil, off Haile Selassie Avenue, opposite the Royal Court Hotel, P.O. Box 82458-80100 (Facebook, Google Maps, KEOnline).
- "Dental and Implant Clinic", 10K Facebook followers, 92% recommend (10 reviews) on Facebook, 4.4 stars from 14 Google reviews, and the five Google reviews quoted (names shortened to initials).
- 3D CT scan and modern X-ray in house (Google reviews and the scanner photo). Sinus lifts and bone grafts (the clinic's Facebook post of April 2026). Smile-tip topics: swallowed crowns, cavities, early loss of baby teeth, dummies (the clinic's Facebook shares).

**Written for the mockup, to confirm:**
- That 0722 901 521 takes WhatsApp (it is used for the chat hand-off and every request).
- The treatment list and every treatment description, step, timing and aftercare note (standard dental guidance, written for the pitch). Children's dentistry, whitening, veneers and dentures are assumed from "Cosmetic dentist" and the posted cases.
- Booking rules: 30-minute slots, at least an hour's notice, no Sunday bookings, the lunch break, and which reasons go to which dentist.
- Insurance wording ("many medical covers include dental care"): which insurers the clinic accepts.
- "Dr. Mohammed" and "Dr. Luvay" as short names, the dentist bios, and the family-practice story (one Google review mentions father, son and mother at reception).
- Who appears in the clinic's Google Maps treatment photos (the sites show them without names).
- The stock people and treatment photos and videos are illustrations, not the clinic's patients or staff (see CREDITS.md).

**Worth telling the client:** the Instagram account (@royalcrowndentalcare) has 112 followers and no posts, and there is no website today; KEOnline lists the clinic as unclaimed. A site with online booking would also give Google a link for the "Website" button on the Maps listing.

## Run locally

```bash
python tools/serve.py 8793 .     # or: python -m http.server 8793
# open http://127.0.0.1:8793/
```

Review tooling sits in `tools/` (scrapers, image and video pipelines, the before-and-after aligner, screenshots, the booking and chat flow test) and is kept out of the repository with the raw sources (`source-assets/`).
