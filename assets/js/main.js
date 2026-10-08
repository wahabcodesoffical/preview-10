/* UNPARALLELED ROOFING — demo concept interactions
   - Mobile nav toggle + active link states
   - Sticky header state
   - GSAP premium motion (hero intro, parallax, reveals, marquee)
   - Demo quote form (non-functional by design)
*/
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");

  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    menu.classList.remove("is-open");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Demo quote form (does NOT send data anywhere) ---------- */
  var form = document.getElementById("quote-form");
  var notice = document.getElementById("form-notice");
  if (form && notice) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // demo only — no backend, no data collection
      notice.hidden = false;
      notice.setAttribute("tabindex", "-1");
      notice.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "nearest" });
      notice.focus({ preventScroll: true });
    });
  }

  /* ---------- GSAP premium motion ---------- */
  var hasGsap = typeof window.gsap !== "undefined";
  var root = document.documentElement;

  if (!hasGsap || prefersReduced) {
    root.classList.add("no-anim"); // content stays fully visible
    return;
  }
  root.classList.add("js-anim");

  var hasTrigger = typeof window.ScrollTrigger !== "undefined";
  if (hasTrigger) gsap.registerPlugin(ScrollTrigger);

  /* Hero intro: staggered rise */
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .to("[data-hero]", { opacity: 1, y: 0, duration: 1, stagger: 0.13, startAt: { y: 44 } });

  /* Hero background parallax */
  if (hasTrigger) {
    gsap.to(".hero__photo", {
      yPercent: 14,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  }

  /* Marquee band */
  var track = document.querySelector(".marquee__track");
  if (track && !prefersReduced) {
    var loop = gsap.to(track, {
      xPercent: -50,
      duration: 26,
      ease: "none",
      repeat: -1
    });
    // Pause marquee while tab hidden (perf)
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) loop.pause(); else loop.play();
    });
  }

  /* Scroll reveals */
  if (hasTrigger) {
    gsap.utils.toArray("[data-reveal]").forEach(function (el) {
      gsap.fromTo(
        el,
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true }
        }
      );
    });

    /* Service image settle-zoom on scroll */
    gsap.utils.toArray(".card__media img").forEach(function (img) {
      gsap.fromTo(img, { scale: 1.12 }, {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: img, start: "top 95%", end: "top 45%", scrub: true }
      });
    });

    /* Active nav link highlighting */
    var sections = ["services", "why", "area", "quote"];
    var links = {};
    document.querySelectorAll(".nav__links a").forEach(function (a) {
      links[a.getAttribute("href").slice(1)] = a;
    });
    sections.forEach(function (id) {
      var sec = document.getElementById(id);
      if (!sec) return;
      ScrollTrigger.create({
        trigger: sec,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: function (self) {
          if (self.isActive && links[id]) {
            Object.keys(links).forEach(function (k) { links[k].classList.remove("is-active"); });
            links[id].classList.add("is-active");
          }
        }
      });
    });
  } else {
    gsap.to("[data-reveal]", { opacity: 1, duration: 0.6 });
  }
})();
