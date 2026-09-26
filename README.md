<p align="center">
  <img src="assets/icons/icon-192.png" width="96" height="96" alt="LE Cyber-Docs shield logo">
</p>

<h1 align="center">LE Cyber-Docs</h1>

<p align="center">
  Quick links, checklists, forms and reference guides for law enforcement, built for the phone in your pocket and the desk computer at the station.
</p>

<p align="center">
  <a href="https://t3rminal-cmd.github.io/LE-CyberDocs/"><strong>Open the site →</strong></a>
</p>

---

## What's on the site

### Home: Quick Links
Each Quick Link opens a window (a bottom sheet on phones that you can swipe down to close).

| Quick Link | What it does |
|---|---|
| **Narcotics** | **Street Value** chart, a **Value Calculator**, and **Narcotic Complaints**: Cook County felony complaint forms (CCCR 0662) for cocaine, heroin, fentanyl, methamphetamine, synthetic drugs and cannabis. Each form shows its 720 ILCS citation, weight range and felony class, with search, a drug filter and one-tap download. |
| **DUI Guide** | **SFST** checklist (HGN, Walk and Turn, One-Leg Stand, alternate tests) that adds up the clues for you, a phase-by-phase **DUI Flow Chart**, and a link to DUI documents. |
| **Incident Reporting Guide** | Cheat sheet of incident types, with search and a category filter. |
| **Commonly Used UCR** | UCR codes grouped by category. Search by code or offense, and tap a code to copy it. |
| **Fueling Stations** | Stations by area with one-tap **Directions** (maps) and **Call** buttons. |
| **Miranda Warning** | The warnings to read before questioning, with the juvenile follow-up questions (FOP Lodge 7 Handbook 2024, p. 164). |
| **Shooting Order Request** | Log each supervisor's ordering statement with name, star and time. **Now** fills in the current time. **Download PDF**, **Print** or **Email PDF**. |

### Other pages
- **Forms**: state warrant and complaint templates with copy-to-clipboard buttons. More sections (subpoenas, consent, preservation, exigent circumstances) are being added.
- **Street Value Chart**: the full value chart plus the calculator on one page.
- **About / Contact**: the team, and a contact form.
- **Login / Sign Up**: placeholders only (see [Login](#login) below).

### Built-in tools
- **Print** any checklist window. It prints in light colors with every section expanded, a title and the date. Use "Save as PDF" in the print dialog to keep a copy.
- **Email PDF** turns a filled-in checklist into a PDF and opens your phone's share sheet or your mail app with it attached. You can save a department "Send to" address on each device.
- **"Now" buttons** fill in the current time, and date fields default to today.
- **Clear** resets just that window.
- **Dark / light theme** follows your device and can be switched with the moon/sun button. Your choice is remembered.
- **Page filter**: the search box in the menu filters the sections on the current page.
- **Add to Home Screen**: the site has its own icon when saved to an iPhone or Android home screen.

## Privacy
- **No accounts, no database, no tracking.** It's a static website.
- **Checklist answers stay on your device.** Print and Email PDF build the PDF in your browser. Email PDF hands it to your own share sheet or mail app, so nothing goes through this website or a third-party service.
- **Contact form** messages are delivered by [Formspree](https://formspree.io) to the site owners. Don't put case details in them.
- **Saved on your device (browser storage):** your theme choice and the department email address.

## Important
- This site is a **quick reference and guide only**. Always follow your department's policies and procedures.
- **Have charging documents reviewed by your ASA or supervisor before use.** Complaint citations and felony classes were checked against 720 ILCS but are not legal advice.
- **Street values come from HIDTA 2022.**
  - Prices shown with **≈** are estimates (the gram price × 454).
  - Prices marked **verify** need a current figure.

## Project layout
```
index.html                Home: carousel, Quick Links and every window
forms.html                Warrant / complaint templates
chart.html                Street value chart + calculator
about.html                Team + contact form
contact.html              Contact form
login.html, signup.html   Placeholder account pages
assets/
  css/styles.css          All site styles (themes, phone layout, print)
  css/login.css           Login / sign-up page styles
  js/main.js              All site behavior
  complaints/             Complaint PDFs: possession/, delivery/, other/
  icons/                  Favicon, home-screen icons, web manifest
  img/                    Carousel and team photos
.github/workflows/pages.yml   Publishes the site to GitHub Pages
```

It's plain HTML, CSS and JavaScript with no build step. The pages load these from CDNs:
- [Bootstrap 5.3](https://getbootstrap.com)
- [Bootstrap Icons](https://icons.getbootstrap.com)
- the Poppins font
- [jsPDF](https://github.com/parallax/jsPDF) for the PDFs

## Run it locally
```bash
git clone https://github.com/t3rminal-cmd/LE-CyberDocs.git
cd LE-CyberDocs
python3 -m http.server 8000
# open http://localhost:8000
```
Opening the HTML files directly also works. A local server is closer to how the live site behaves.

## Publishing
Every push to `main` runs **Deploy Site** (`.github/workflows/pages.yml`). It copies the HTML pages and `assets/` to GitHub Pages, and the site updates in about 20 seconds.

**One-time setup** (already done for this repo): Settings → Pages → Source: **GitHub Actions**.

## Updating content
| To change… | Edit |
|---|---|
| Street values / calculator drugs | `NARCOTIC_DATA` and `NARCOTIC_CATEGORIES` in `assets/js/main.js`. The chart tables, calculator menus and page filter are all built from it. |
| Complaint forms | Add or replace the PDF under `assets/complaints/`, then add a row to the Narcotic Complaints list in `index.html`. |
| UCR codes, incident types, fueling stations | The matching window in `index.html` (`#ucrModal`, `#incidentModal`, `#fuelModal`). |
| Contact form destination | The Formspree form ID in the `action` URL of the `js-contact-form` forms (`index.html`, `about.html`, `contact.html`). |
| Default department email for Email PDF | `DEPARTMENT_EMAIL` in `assets/js/main.js` (optional). Each device can still set its own. |
| Favicon / home-screen icon | `assets/icons/` |

## Login
Login and sign-up don't restrict anything yet. A static site can't check passwords by itself.

To limit the site to your department, put it behind an access service instead of writing a login page. For example, [Cloudflare Access](https://www.cloudflare.com/zero-trust/products/access/) can require a department email, and the site's code doesn't need to change.

## License
[MIT](LICENSE) © 2024 S3cureTangoDown. The shield icon is from [Bootstrap Icons](https://icons.getbootstrap.com) (MIT).
