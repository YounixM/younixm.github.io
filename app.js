(() => {
  const root = document.documentElement;

  // Theme: persist across sessions, default to "dark" set on <html>.
  const THEME_KEY = "theme";
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") {
    root.setAttribute("data-theme", stored);
  }

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
