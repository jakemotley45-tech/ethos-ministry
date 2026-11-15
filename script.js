/**
 * Ethos Ministry — site configuration
 * Replace the placeholder values below before going live.
 */
const CONFIG = {
  // Formspree (or similar) endpoint. Leave empty to use the email fallback.
  // Example: "https://formspree.io/f/xxxxxxxx"
  formspreeEndpoint: "",

  // Used for the mailto fallback when no form endpoint is configured.
  // PLACEHOLDER: replace with the church prayer email.
  churchEmail: "jakemotley45@gmail.com",

  // Stream and gathering links for Ethos Ministry / The GRR Gospel Rockin Radio.
  youtubeLiveUrl: "https://www.youtube.com/@thegrrgospelrockinradio9795/live",
  youtubeChannelUrl: "https://www.youtube.com/@thegrrgospelrockinradio9795",
  facebookLiveUrl: "https://www.facebook.com/share/g/1PnoaVJChJ/",

  // Optional: YouTube video or live ID only (the characters after v=).
  // Leave empty unless you have verified a specific video ID. Do not guess one.
  youtubeEmbedId: ""
};

const PLACEHOLDER_MARKERS = [
  "YOUR_LIVE_STREAM_ID",
  "YOUR_PAGE",
  "EXAMPLE-CHURCH-EMAIL",
  "xxxxxxxx"
];

function isConfigured(value) {
  if (!value || !String(value).trim()) return false;
  const text = String(value);
  return !PLACEHOLDER_MARKERS.some((marker) => text.includes(marker));
}

function applyConfig() {
  const ytLink = document.getElementById("youtube-live-link");
  const fbLink = document.getElementById("facebook-live-link");
  const channelLink = document.getElementById("youtube-channel-link");
  const embedWrap = document.getElementById("youtube-embed-wrap");
  const embed = document.getElementById("youtube-embed");
  const embedPlaceholder = document.getElementById("embed-placeholder");

  if (ytLink) ytLink.href = CONFIG.youtubeLiveUrl;
  if (fbLink && CONFIG.facebookLiveUrl) fbLink.href = CONFIG.facebookLiveUrl;
  if (channelLink && CONFIG.youtubeChannelUrl) channelLink.href = CONFIG.youtubeChannelUrl;

  if (isConfigured(CONFIG.youtubeEmbedId) && embed && embedWrap) {
    embed.src = "https://www.youtube.com/embed/" + encodeURIComponent(CONFIG.youtubeEmbedId);
    embedWrap.hidden = false;
    if (embedPlaceholder) embedPlaceholder.hidden = true;
  }
}

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  const close = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  };

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", close);
  });
}

function initAnonymousToggle() {
  const checkbox = document.getElementById("pray-anonymously");
  const nameInput = document.getElementById("prayer-name");
  if (!checkbox || !nameInput) return;

  const sync = () => {
    if (checkbox.checked) {
      nameInput.value = "";
      nameInput.disabled = true;
      nameInput.placeholder = "Name hidden — praying anonymously";
    } else {
      nameInput.disabled = false;
      nameInput.placeholder = "First and last name, if you like";
    }
  };

  checkbox.addEventListener("change", sync);
  sync();
}

function collectFormData(form) {
  const anonymous = form.anonymous.checked;
  const name = anonymous ? "Anonymous" : (form.name.value.trim() || "Not provided");
  const email = form.email.value.trim() || "Not provided";
  const request = form.request.value.trim();
  const visibility = form.visibility.value;
  const visibilityLabel =
    visibility === "okay-to-pray-publicly"
      ? "Okay to pray for publicly"
      : "Share with the prayer team only";
  const city = form.city.value.trim() || "Not provided";

  return { anonymous, name, email, request, visibility, visibilityLabel, city };
}

function buildMailto(data) {
  const subject = "Prayer card from Ethos Ministry website";
  const body = [
    "A prayer card was submitted from the Ethos Ministry website.",
    "",
    "Name: " + data.name,
    "Email: " + data.email,
    "Watching online from: " + data.city,
    "Visibility: " + data.visibilityLabel,
    "",
    "Prayer request:",
    data.request
  ].join("\r\n");

  return (
    "mailto:" +
    encodeURIComponent(CONFIG.churchEmail) +
    "?subject=" +
    encodeURIComponent(subject) +
    "&body=" +
    encodeURIComponent(body)
  );
}

function showThankYou() {
  const form = document.getElementById("prayer-form");
  const thanks = document.getElementById("thank-you");
  if (form) form.hidden = true;
  if (thanks) {
    thanks.hidden = false;
    thanks.scrollIntoView({ behavior: "smooth", block: "start" });
    const heading = thanks.querySelector("h3");
    if (heading) heading.focus?.();
  }
}

function resetFormView() {
  const form = document.getElementById("prayer-form");
  const thanks = document.getElementById("thank-you");
  const request = document.getElementById("prayer-request");
  const error = document.getElementById("request-error");
  if (thanks) thanks.hidden = true;
  if (form) {
    form.reset();
    form.hidden = false;
    initAnonymousToggle();
    if (request) request.classList.remove("invalid");
    if (error) error.hidden = true;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    const name = document.getElementById("prayer-name");
    if (name && !name.disabled) name.focus();
    else if (request) request.focus();
  }
}

async function submitViaEndpoint(data) {
  const payload = {
    name: data.name,
    email: data.email === "Not provided" ? "" : data.email,
    request: data.request,
    visibility: data.visibilityLabel,
    city: data.city === "Not provided" ? "" : data.city,
    anonymous: data.anonymous ? "yes" : "no",
    _subject: "Prayer card from Ethos Ministry website"
  };

  const response = await fetch(CONFIG.formspreeEndpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Form endpoint returned " + response.status);
  }
}

function setSubmitting(isSubmitting) {
  const button = document.getElementById("prayer-submit");
  if (!button) return;
  button.disabled = isSubmitting;
  button.textContent = isSubmitting ? "Sending…" : "Submit a Prayer Card";
}

function initForm() {
  const form = document.getElementById("prayer-form");
  const request = document.getElementById("prayer-request");
  const error = document.getElementById("request-error");
  const another = document.getElementById("submit-another");
  if (!form || !request) return;

  request.addEventListener("input", () => {
    if (request.value.trim()) {
      request.classList.remove("invalid");
      if (error) error.hidden = true;
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = collectFormData(form);

    if (!data.request) {
      request.classList.add("invalid");
      if (error) error.hidden = false;
      request.focus();
      return;
    }

    setSubmitting(true);

    try {
      if (isConfigured(CONFIG.formspreeEndpoint)) {
        await submitViaEndpoint(data);
        showThankYou();
      } else {
        window.location.href = buildMailto(data);
        showThankYou();
      }
    } catch (err) {
      console.warn("Form endpoint failed; opening email instead.", err);
      window.location.href = buildMailto(data);
      showThankYou();
    } finally {
      setSubmitting(false);
    }
  });

  if (another) another.addEventListener("click", resetFormView);
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function isIosSafari() {
  const ua = window.navigator.userAgent || "";
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isSafari = /safari/i.test(ua) && !/crios|fxios|edgios/i.test(ua);
  return isIOS && isSafari;
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("./sw.js").catch((err) => {
    console.warn("Service worker registration failed.", err);
  });
}

function initInstallPrompt() {
  const banner = document.getElementById("install-banner");
  const button = document.getElementById("install-button");
  const copy = document.getElementById("install-copy");
  const dismiss = document.getElementById("install-dismiss");
  if (!banner) return;

  if (isStandalone() || localStorage.getItem("ethos-install-dismissed") === "1") {
    return;
  }

  let deferredPrompt = null;

  if (isIosSafari()) {
    if (copy) copy.textContent = "Tap Share, then Add to Home Screen";
    if (button) button.hidden = true;
    banner.hidden = false;
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    if (copy) copy.textContent = "Install Ethos Ministry for quicker access on your phone.";
    if (button) button.hidden = false;
    banner.hidden = false;
  });

  if (button) {
    button.addEventListener("click", async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice.catch(() => {});
      deferredPrompt = null;
      banner.hidden = true;
    });
  }

  if (dismiss) {
    dismiss.addEventListener("click", () => {
      banner.hidden = true;
      localStorage.setItem("ethos-install-dismissed", "1");
    });
  }

  window.addEventListener("appinstalled", () => {
    banner.hidden = true;
    deferredPrompt = null;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  initNav();
  initAnonymousToggle();
  initForm();
  registerServiceWorker();
  initInstallPrompt();
});
