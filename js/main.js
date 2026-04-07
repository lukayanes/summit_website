/* ===============================
   FOOTER YEAR
================================ */
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* ===============================
   PAGE-LOAD ANIMATION TRIGGER
   (THIS FIXES THE MISSING HERO)
================================ */
requestAnimationFrame(() => {
  document.documentElement.classList.add("is-loaded");
});

/* ===============================
   BIZ CAROUSEL AUTO-SCROLL
================================ */
(() => {
  const strip = document.querySelector(".biz-strip");
  const track = document.getElementById("bizTrack");
  if (!strip || !track) return;

  let intervalId = null;
  let paused = false;
  let userInteracting = false;
  const STEP_DELAY = 3000;

  const getStep = () => {
    const firstCard = track.querySelector(".biz-card");
    if (!firstCard) return 250;

    const trackStyles = window.getComputedStyle(track);
    const gap = parseFloat(trackStyles.gap || "0");
    const cardWidth = firstCard.getBoundingClientRect().width;
    return cardWidth + gap;
  };

  const next = () => {
    if (paused || userInteracting) return;

    const step = getStep();
    const maxScroll = strip.scrollWidth - strip.clientWidth;

    if (strip.scrollLeft >= maxScroll - 5) {
      strip.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    strip.scrollBy({ left: step, behavior: "smooth" });
  };

  const start = () => {
    if (intervalId) return;
    intervalId = setInterval(next, STEP_DELAY);
  };

  strip.addEventListener("mouseenter", () => paused = true);
  strip.addEventListener("mouseleave", () => paused = false);

  let scrollTimeout = null;
  strip.addEventListener("scroll", () => {
    userInteracting = true;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => userInteracting = false, 400);
  }, { passive: true });

  strip.addEventListener("touchstart", () => userInteracting = true, { passive: true });
  strip.addEventListener("touchend", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => userInteracting = false, 700);
  }, { passive: true });

  start();
})();

/* ===============================
   BIZ CAROUSEL ARROWS
================================ */
(() => {
  const strip = document.querySelector(".biz-strip");
  const track = document.getElementById("bizTrack");
  const leftBtn = document.querySelector(".biz-arrow.left");
  const rightBtn = document.querySelector(".biz-arrow.right");
  if (!strip || !track || !leftBtn || !rightBtn) return;

  const getStep = () => {
    const firstCard = track.querySelector(".biz-card");
    if (!firstCard) return 250;

    const trackStyles = window.getComputedStyle(track);
    const gap = parseFloat(trackStyles.gap || "0");
    const cardWidth = firstCard.getBoundingClientRect().width;
    return cardWidth + gap;
  };

  leftBtn.addEventListener("click", () => {
    strip.scrollBy({ left: -getStep(), behavior: "smooth" });
  });

  rightBtn.addEventListener("click", () => {
    strip.scrollBy({ left: getStep(), behavior: "smooth" });
  });
})();

/* ===============================
   MOBILE NAV DROPDOWNS — FIXED
================================ */
(() => {

  const dropdowns = document.querySelectorAll(".nav-dropdown");

  const isTouch =
    window.matchMedia("(hover: none), (pointer: coarse)").matches;

  if (!isTouch) return;

  dropdowns.forEach(dd => {

    const btn = dd.querySelector(".nav-dropbtn");
    const menu = dd.querySelector(".nav-dropmenu");

    if (!btn || !menu) return;

    const close = () => {
      dd.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    };

    btn.addEventListener("click", (e) => {

      e.preventDefault();
      e.stopPropagation();

      const open = dd.classList.toggle("is-open");

      btn.setAttribute("aria-expanded", open ? "true" : "false");

    });

    menu.addEventListener("click", e => e.stopPropagation());

    document.addEventListener("click", e => {
      if (!dd.contains(e.target)) close();
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") close();
    });

  });

})();

/* ===============================
   FORM SUBMISSION HANDLER
================================ */
(() => {
  const forms = document.querySelectorAll(".quote-form");

  forms.forEach((form) => {
    const card = form.closest(".hero-form-card");
    const thanks = card?.querySelector(".quote-thanks");
    if (!card || !thanks) return;

    let submitting = false;

    form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  console.log("FORM DATA:", [...formData.entries()]);

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: formData,
      mode: "cors"
    });

    console.log("STATUS:", response.status);

    if (response.ok) {
      form.style.display = "none";
      thanks.style.display = "block";
    } else {
      alert("Server error: " + response.status);
    }

  } catch (err) {
    console.error("FETCH ERROR:", err);
    alert("Network error");
  }
});
  });
})();

/* =========================================
   HAMBURGER MENU (CORRECT FINAL FIX)
========================================= */
(() => {

  const hamburger = document.getElementById("hamburgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!hamburger || !mobileMenu) return;


  /* THE REAL FUNCTION */
  const setOpen = (open) => {

  mobileMenu.classList.toggle("open", open);

  document.body.classList.toggle("menu-open", open);

  hamburger.setAttribute("aria-expanded", open ? "true" : "false");

  mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");


  /* THIS LINE CLOSES ALL SECTIONS WHEN MENU OPENS */
  if (open){

    document.querySelectorAll(".mm-group").forEach(group => {

      group.classList.remove("open");

    });

  }

};


  /* CLICK HAMBURGER */
  hamburger.addEventListener("click", (e) => {

    e.preventDefault();
    e.stopPropagation();

    setOpen(!mobileMenu.classList.contains("open"));

  });


  /* CLICK MENU LINK */
  mobileMenu.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", () => setOpen(false));

  });


  /* CLICK OUTSIDE */
  document.addEventListener("click", (e) => {

    if (!mobileMenu.classList.contains("open")) return;

    if (mobileMenu.contains(e.target)) return;

    if (hamburger.contains(e.target)) return;

    setOpen(false);

  });


  /* ESC KEY */
  document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

      setOpen(false);

    }

  });

})();


/* MOBILE DROPDOWN TOGGLES */

document.querySelectorAll(".mm-toggle").forEach(button => {

  button.addEventListener("click", function(){

    const group = this.parentElement;

    const isOpen = group.classList.contains("open");


    /* close all */
    document.querySelectorAll(".mm-group").forEach(g => {

      g.classList.remove("open");

    });


    /* open clicked */
    if (!isOpen){

      group.classList.add("open");

    }

  });

});

// FAQ ACCORDION
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const faqItem = button.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const icon = button.querySelector('.faq-icon');

    document.querySelectorAll('.faq-item').forEach(item => {
      if (item !== faqItem) {
        item.classList.remove('active');
        item.querySelector('.faq-answer').style.display = 'none';
        item.querySelector('.faq-icon').textContent = '+';
      }
    });

    if (faqItem.classList.contains('active')) {
      faqItem.classList.remove('active');
      answer.style.display = 'none';
      icon.textContent = '+';
    } else {
      faqItem.classList.add('active');
      answer.style.display = 'block';
      icon.textContent = '−';
    }
  });
});
