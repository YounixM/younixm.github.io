(() => {
  const root = document.documentElement;

  // Theme: persist across sessions, default to "dark" set on <html>.
  const THEME_KEY = "theme";
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") {
    root.setAttribute("data-theme", stored);
  }

  // Favicon: regenerated as a data URL so it tracks the site's theme + accent.
  const iconLink = document.querySelector('link[rel="icon"]');
  const appleIconLink = document.querySelector('link[rel="apple-touch-icon"]');
  const updateFavicon = () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    const bg = isDark ? "oklch(0.17 0.005 70)" : "oklch(0.985 0.005 80)";
    const accent = getComputedStyle(root).getPropertyValue("--accent").trim()
      || "oklch(0.78 0.16 55)";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">`
      + `<rect width="32" height="32" rx="7" fill="${bg}"/>`
      + `<circle cx="16" cy="16" r="10" fill="${accent}" opacity="0.18"/>`
      + `<circle cx="16" cy="16" r="5" fill="${accent}"/>`
      + `</svg>`;
    const url = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    if (iconLink) iconLink.href = url;
    if (appleIconLink) appleIconLink.href = url;
  };

  const toggle = document.getElementById("theme-toggle");
  const syncToggle = () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    toggle.setAttribute("aria-checked", String(isDark));
    toggle.title = isDark ? "Switch to light" : "Switch to dark";
  };
  syncToggle();
  toggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
    syncToggle();
    updateFavicon();
  });

  // Accent color picker: persist + apply --accent (--accent-soft is derived
  // from --accent in CSS via color-mix, so it tracks theme automatically).
  const ACCENTS = {
    orange: "oklch(0.78 0.16 55)",
    lime:   "oklch(0.85 0.18 130)",
    forest: "oklch(0.55 0.13 150)",
    ocean:  "oklch(0.65 0.13 235)",
    purple: "oklch(0.62 0.18 295)"
  };
  const ACCENT_KEY = "accent";
  const accentPicker = document.querySelector(".accent-picker");
  const accentTrigger = document.getElementById("accent-trigger");
  const accentButtons = document.querySelectorAll(".accent-menu button");

  const applyAccent = (name) => {
    const color = ACCENTS[name];
    if (!color) return;
    root.style.setProperty("--accent", color);
    accentButtons.forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.accent === name));
    });
    updateFavicon();
  };

  const setAccentMenuOpen = (open) => {
    accentPicker.dataset.open = String(open);
    accentTrigger.setAttribute("aria-expanded", String(open));
  };

  const storedAccent = localStorage.getItem(ACCENT_KEY);
  if (storedAccent && ACCENTS[storedAccent]) applyAccent(storedAccent);
  updateFavicon();

  accentTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    setAccentMenuOpen(accentPicker.dataset.open !== "true");
  });

  accentButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.accent;
      applyAccent(name);
      localStorage.setItem(ACCENT_KEY, name);
      setAccentMenuOpen(false);
    });
  });

  document.addEventListener("click", (e) => {
    if (!accentPicker.contains(e.target)) setAccentMenuOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setAccentMenuOpen(false);
  });

  // Live IST clock in the hero meta pill.
  const timeEl = document.getElementById("ist-time");
  if (timeEl) {
    const fmt = () => {
      const opts = { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false };
      timeEl.textContent = new Date().toLocaleTimeString("en-IN", opts) + " IST";
    };
    fmt();
    setInterval(fmt, 30000);
  }

  // Reveal-on-scroll. Reduced-motion is handled by CSS — this just adds .in.
  const els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el) => el.classList.add("in"));
  }
})();
