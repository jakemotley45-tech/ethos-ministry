# Ethos Ministry website

A simple, mobile-friendly one-page site for Ethos Ministry. Visitors can open live stream links and submit a prayer card.

No build step is required. The site is plain HTML, CSS, and JavaScript.

## Files

- `index.html` — page structure
- `styles.css` — layout and design
- `script.js` — live stream links, optional YouTube embed, and prayer form behavior

## What to replace before going live

Open `script.js` and update the `CONFIG` object at the top:

```js
const CONFIG = {
  formspreeEndpoint: "",          // e.g. "https://formspree.io/f/xxxxxxxx"
  churchEmail: "Tonymarks7373@gmail.com",  // used for the prayer-card email fallback
  youtubeLiveUrl: "https://www.youtube.com/@thegrrgospelrockinradio9795/live",
  youtubeChannelUrl: "https://www.youtube.com/@thegrrgospelrockinradio9795",
  facebookLiveUrl: "https://www.facebook.com/share/g/1PnoaVJChJ/",
  youtubeEmbedId: ""              // optional, only after you verify a specific video ID
};
```

### Live stream links

The Watch Live buttons are already pointed at the church streams and gathering spaces:

- YouTube live stream: `https://www.youtube.com/@thegrrgospelrockinradio9795/live`
- YouTube channel: `https://www.youtube.com/@thegrrgospelrockinradio9795`
- Facebook group (Watch on Facebook): `https://www.facebook.com/share/g/1PnoaVJChJ/`

The on-page YouTube embed stays hidden until you set a verified `youtubeEmbedId` (the characters after `v=` in a YouTube URL). Leave it empty unless you have confirmed a real video ID. Do not guess one.

### Prayer form endpoint (recommended)

The form works without a server. If `formspreeEndpoint` is empty or still a placeholder, submitting the form opens the visitor’s email app with a pre-filled message to `churchEmail`.

To collect requests on the web instead of email:

1. Create a free form at [Formspree](https://formspree.io/) (or a similar service such as Basin or Getform).
2. Paste the form endpoint into `formspreeEndpoint`. Example: `https://formspree.io/f/xxxxxxxx`.
3. `churchEmail` is already set to Tonymarks7373@gmail.com for testing prayer cards. The footer church email is still a placeholder and is not shown on the page.

### Other placeholders on the page

Service time and the street address are already filled in:

- Sunday Worship at 12:30 PM
- 1101 Radio Ave, Harrison, AR 72601, with a Google Maps directions link

In the footer of `index.html`, these are still clearly marked placeholders:

- Phone number
- Church email

## How the prayer form works

Fields:

- Name (optional), plus a “pray anonymously” checkbox that clears and disables the name field
- Email (optional, for follow-up)
- Prayer request (required)
- “Share with the prayer team only” or “Okay to pray for publicly”
- “Watching online from” (city, optional)

After a successful submit (or after the email app is opened), the visitor sees a short thank-you message and can submit another card if they wish.

## Preview on your computer

From this folder:

```bash
# Any local static server works. For example:
python3 -m http.server 8080
```

Then open `http://localhost:8080` in a browser.

## Host for free

### GitHub Pages

1. Create a new GitHub repository and upload these files to the root of the repo (`index.html` should be at the top level, not inside another folder).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set Source to **Deploy from a branch**.
4. Choose the `main` branch and the `/ (root)` folder, then save.
5. After a minute or two, GitHub will give you a URL such as `https://your-username.github.io/your-repo-name/`.

### Netlify

1. Go to [Netlify Drop](https://app.netlify.com/drop) or [Netlify](https://www.netlify.com/).
2. Drag this whole folder onto the page, or connect the GitHub repository and deploy.
3. No build command is needed. The publish directory is the folder that contains `index.html`.
4. Netlify will give you a URL, which you can later point a custom domain to.

After hosting, test the YouTube and Facebook Watch buttons and submit a test prayer card.

## Install the app

The site is a Progressive Web App. On Android Chrome, a small “Install the app” prompt can add it to the home screen. On iPhone Safari, use Share, then Add to Home Screen. The prompt is dismissible and stays hidden once the app is already installed. A service worker caches the main pages and styles so the app shell can still open offline. Prayer form submissions and outside links (YouTube, Facebook, maps, fonts) are not cached.

## License

Built for Ethos Ministry. Update the footer contact details and stream links before sharing the site publicly.
