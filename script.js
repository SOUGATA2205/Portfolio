/* =========================================================
   SOUGATA SARKAR — PORTFOLIO JS v3  |  Premium 3D Edition
   ========================================================= */
"use strict";

/* ── 1. THEME ── */
const html = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
html.setAttribute("data-theme", savedTheme);
themeToggle.addEventListener("click", () => {
  const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("portfolio-theme", next);
});

/* ── 0. TYPING ANIMATION ── */
function initTyping() {
  const name1 = document.getElementById("hero-name-1");
  const name2 = document.getElementById("hero-name-2");
  if (!name1 || !name2) return;

  const text1 = name1.textContent;
  const text2 = name2.textContent;
  const cursorHTML = '<span class="hero-cursor">_</span>';

  name1.innerHTML = cursorHTML;
  name2.textContent = "";

  let i = 0, j = 0;

  function typeLine1() {
    if (i < text1.length) {
      name1.innerHTML = text1.substring(0, i + 1) + cursorHTML;
      i++;
      setTimeout(typeLine1, 75); // Faster (75ms)
    } else {
      name1.innerHTML = text1; // Remove cursor from line 1
      setTimeout(typeLine2, 150);
    }
  }

  function typeLine2() {
    if (j < text2.length) {
      name2.innerHTML = text2.substring(0, j + 1) + cursorHTML;
      j++;
      setTimeout(typeLine2, 75); // Faster (75ms)
    }
  }

  // Start after a delay so page logic/reveals can settle
  setTimeout(typeLine1, 800);
}


/* ── 2. PARTICLE CANVAS ── */
(function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H, particles = [];
  let mouse = { x: -2000, y: -2000 };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  function getAccentColor() {
    const theme = html.getAttribute("data-theme");
    return theme === "dark" ? "0,245,196" : "10,191,148";
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.1,
    };
  }

  for (let i = 0; i < 90; i++) particles.push(createParticle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const rgb = getAccentColor();

    particles.forEach(p => {
      // Mouse Interaction
      const dxSq = (mouse.x - p.x) ** 2;
      const dySq = (mouse.y - p.y) ** 2;
      const distSq = dxSq + dySq;
      const minDist = 180;

      if (distSq < minDist * minDist) {
        const dist = Math.sqrt(distSq);
        const force = (minDist - dist) / minDist;
        // Subtle magnetic pull
        p.vx += (mouse.x - p.x) * force * 0.015;
        p.vy += (mouse.y - p.y) * force * 0.015;
      }

      // Movement
      p.x += p.vx;
      p.y += p.vy;

      // Friction / Damping
      p.vx *= 0.96;
      p.vy *= 0.96;

      // Wrap around bounds
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb},${p.alpha})`;
      ctx.fill();
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${rgb},${0.06 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── 3. CUSTOM CURSOR ── */
if (window.matchMedia("(hover: hover)").matches) {
  const cursor = document.getElementById("cursor");
  const cursorDot = document.getElementById("cursor-dot");

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;
  let dotX = -100, dotY = -100;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateCursor() {
    // Both ring and dot move towards mouse position
    // Ring moves with more delay (0.15) for a smooth "follow" feel
    // Dot moves with very little delay (0.45) to feel snappy
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    dotX += (mouseX - dotX) * 0.45;
    dotY += (mouseY - dotY) * 0.45;

    if (cursor) cursor.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    if (cursorDot) cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  // Hover states
  const hoverSelectors = "a, button, .project-card, .cert-item, .contact-link, .filter-btn, .stag, .ctag, .lang-card, .skill-category, input, textarea";
  const hoverItems = document.querySelectorAll(hoverSelectors);

  hoverItems.forEach(el => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });

  // Click animation
  document.addEventListener("mousedown", () => document.body.classList.add("cursor-click"));
  document.addEventListener("mouseup", () => document.body.classList.remove("cursor-click"));
}

/* ── 4. NAVBAR ── */
const header = document.getElementById("site-header");
const hamburger = document.getElementById("hamburger");
const navList = document.querySelector(".nav-list");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
  updateActiveNav();
}, { passive: true });

hamburger.addEventListener("click", () => {
  const nav = document.getElementById("main-nav");
  const isOpen = nav.classList.toggle("open");
  hamburger.classList.toggle("open", isOpen);
  hamburger.setAttribute("aria-expanded", String(isOpen));
});
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("main-nav").classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  });
});
document.addEventListener("click", e => {
  if (!header.contains(e.target)) {
    document.getElementById("main-nav").classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  }
});

function updateActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  let current = "";
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 130 && rect.bottom >= 130) current = sec.id;
  });
  navLinks.forEach(link => {
    const section = link.getAttribute("href").replace("#", "");
    link.classList.toggle("active", section === current);
  });
}

/* ── 5. SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = (idx % 6) * 0.07 + "s";
      entry.target.classList.add("revealed");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal-item").forEach(el => revealObserver.observe(el));

/* ── 6. 3D HERO CARD TILT ── */
const heroCard = document.getElementById("hero-card");
if (heroCard) {
  let animFrame;
  let currentX = 0, currentY = 0;
  let targetX = 0, targetY = 0;

  heroCard.addEventListener("mousemove", e => {
    const rect = heroCard.getBoundingClientRect();
    targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 22;
    targetY = ((e.clientY - rect.top) / rect.height - 0.5) * -22;
  });

  heroCard.addEventListener("mouseleave", () => {
    targetX = 0; targetY = 0;
  });

  function animateTilt() {
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;
    heroCard.style.transform =
      `perspective(1000px) rotateY(${currentX}deg) rotateX(${currentY}deg) translateZ(10px)`;
    animFrame = requestAnimationFrame(animateTilt);
  }
  animateTilt();
}

/* ── 7. PROJECT FILTER ── */
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

// Inject card animation
const cardStyle = document.createElement("style");
cardStyle.textContent = `
*, *::before, *::after { cursor: none !important; }
@keyframes cardIn {
  from { opacity: 0; transform: scale(0.92) translateY(20px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes shake {
  0%,100%{ transform:translateX(0); }
  20%    { transform:translateX(-8px); }
  40%    { transform:translateX(8px); }
  60%    { transform:translateX(-5px); }
  80%    { transform:translateX(5px); }
}
`;
document.head.appendChild(cardStyle);

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.getAttribute("data-filter");
    projectCards.forEach((card, i) => {
      const cats = card.getAttribute("data-category") || "";
      const show = filter === "all" || cats.includes(filter);
      if (show) {
        card.classList.remove("hidden");
        card.style.animation = "none";
        void card.offsetHeight;
        card.style.animationDelay = (i % 5) * 0.06 + "s";
        card.style.animation = "cardIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards";
      } else {
        card.classList.add("hidden");
      }
    });
  });
});

/* ── 8. SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", e => {
    const href = anchor.getAttribute("href");
    if (href === "#") return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

/* ── 9. CONTACT FORM ── */
const contactForm = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");
const formSuccess = document.getElementById("form-success");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fields = {
  name: { el: document.getElementById("name"), err: document.getElementById("name-error"), min: 2, label: "Name" },
  email: { el: document.getElementById("email"), err: document.getElementById("email-error"), label: "Email" },
  subject: { el: document.getElementById("subject"), err: document.getElementById("subject-error"), min: 3, label: "Subject" },
  message: { el: document.getElementById("message"), err: document.getElementById("message-error"), min: 10, label: "Message" },
};

function validateField(key) {
  const { el, err, min, label } = fields[key];
  const val = el.value.trim();
  let msg = "";
  if (!val) msg = `${label} is required.`;
  else if (key === "email" && !emailRegex.test(val)) msg = "Please enter a valid email address.";
  else if (min && val.length < min) msg = `${label} must be at least ${min} characters.`;
  err.textContent = msg;
  el.classList.toggle("invalid", !!msg);
  return !msg;
}

Object.keys(fields).forEach(key => {
  const { el } = fields[key];
  el.addEventListener("input", () => {
    if (el.classList.contains("invalid") || el.dataset.touched) validateField(key);
  });
  el.addEventListener("blur", () => { el.dataset.touched = "true"; validateField(key); });
});

if (contactForm) {
  contactForm.addEventListener("submit", async e => {
    e.preventDefault();
    const valid = Object.keys(fields).map(validateField).every(Boolean);

    if (!valid) {
      for (const key of Object.keys(fields)) {
        if (fields[key].el.classList.contains("invalid")) { fields[key].el.focus(); break; }
      }
      contactForm.style.animation = "none";
      void contactForm.offsetHeight;
      contactForm.style.animation = "shake 0.4s ease";
      return;
    }

    const btnText = document.getElementById("btn-text");
    submitBtn.disabled = true;
    if (btnText) btnText.textContent = "Sending...";

    try {
      // Using FormSubmit (Free tier - Zero Setup required)
      // This sends the form data directly to your email.
      const response = await fetch("https://formsubmit.co/ajax/sougatajisce@gmail.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: fields.name.el.value,
          email: fields.email.el.value,
          subject: fields.subject.el.value,
          message: fields.message.el.value
        })
      });

      if (response.ok) {
        showToast("✅ Message sent successfully!");
        contactForm.reset();
        formSuccess.hidden = false;
        setTimeout(() => { formSuccess.hidden = true; }, 5000);
      } else {
        throw new Error();
      }
    } catch (err) {
      showToast("❌ Error sending message. Please try again.");
    } finally {
      submitBtn.disabled = false;
      if (btnText) btnText.textContent = "Send Message";
      Object.keys(fields).forEach(k => {
        delete fields[k].el.dataset.touched;
        fields[k].el.classList.remove("invalid");
        fields[k].err.textContent = "";
      });
    }
  });
}

/* ── 10. TOAST ── */
let toastTimer = null;
function showToast(msg, duration = 3500) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), duration);
}

/* ── 11. BACK TO TOP ── */
const backToTop = document.getElementById("back-to-top");
if (backToTop) {
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", () => {
    const show = window.scrollY > 500;
    backToTop.style.opacity = show ? "1" : "0";
    backToTop.style.pointerEvents = show ? "auto" : "none";
  }, { passive: true });
  backToTop.style.opacity = "0";
  backToTop.style.transition = "opacity 0.3s, transform 0.3s";
}

/* ── 12. SKILL CARD 3D HOVER ── */
document.querySelectorAll(".skill-category, .lang-card, .project-card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg) translateY(-4px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

/* ── 13. INIT ── */
document.addEventListener("DOMContentLoaded", () => {
  updateActiveNav();
  initTyping();
});
