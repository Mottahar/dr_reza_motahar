"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  const yearElement = document.getElementById("year");
  const progressBar = document.getElementById("siteProgress");

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* =========================================
     1. AUTOMATIC FOOTER YEAR
     ========================================= */

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* =========================================
     2. MOBILE NAVIGATION
     ========================================= */

  if (menuToggle && nav) {
    const closeMenu = () => {
      nav.classList.remove("active");

      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "باز کردن منو");
    };

    const openMenu = () => {
      nav.classList.add("active");

      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "بستن منو");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.contains("active");

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close the menu after selecting a navigation link
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close the menu when clicking outside it
    document.addEventListener("click", (event) => {
      if (
        nav.classList.contains("active") &&
        !nav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    // Close the menu using the Escape key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    // Close the mobile menu when returning to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });

    // Keep the initial accessibility state consistent
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "باز کردن منو");
  }

  /* =========================================
     3. SMOOTH SECTION REVEAL
     ========================================= */

  const revealElements = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  /* =========================================
     4. SCROLL PROGRESS BAR
     ========================================= */

  let progressTicking = false;

  const updateProgress = () => {
    if (!progressBar) {
      progressTicking = false;
      return;
    }

    const documentHeight =
      document.documentElement.scrollHeight;

    const viewportHeight = window.innerHeight;

    const scrollableHeight =
      documentHeight - viewportHeight;

    const scrollPosition =
      window.scrollY ||
      document.documentElement.scrollTop ||
      0;

    const progress =
      scrollableHeight > 0
        ? (scrollPosition / scrollableHeight) * 100
        : 0;

    progressBar.style.width =
      `${Math.min(100, Math.max(0, progress))}%`;

    progressTicking = false;
  };

  const requestProgressUpdate = () => {
    if (progressTicking) {
      return;
    }

    progressTicking = true;
    window.requestAnimationFrame(updateProgress);
  };

  window.addEventListener(
    "scroll",
    requestProgressUpdate,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    requestProgressUpdate,
    { passive: true }
  );

  window.addEventListener(
    "load",
    requestProgressUpdate
  );

  updateProgress();

  /* =========================================
     5. HEADER SCROLL EFFECT
     ========================================= */

  const header = document.querySelector(".site-header");

  if (header) {
    let headerTicking = false;

    const updateHeader = () => {
      header.classList.toggle(
        "is-scrolled",
        window.scrollY > 20
      );

      headerTicking = false;
    };

    const requestHeaderUpdate = () => {
      if (headerTicking) {
        return;
      }

      headerTicking = true;
      window.requestAnimationFrame(updateHeader);
    };

    window.addEventListener(
      "scroll",
      requestHeaderUpdate,
      { passive: true }
    );

    updateHeader();
  }

  /* =========================================
     6. OPTIONAL IMAGE LOAD POLISH
     ========================================= */

  const portraitImage = document.querySelector(
    ".portrait-image"
  );

  if (portraitImage) {
    const markImageReady = () => {
      portraitImage.classList.add("is-loaded");
    };

    if (portraitImage.complete && portraitImage.naturalWidth > 0) {
      markImageReady();
    } else {
      portraitImage.addEventListener(
        "load",
        markImageReady,
        { once: true }
      );
    }
  }

  /* =========================================
     7. CURRENT YEAR AND INTERACTIONS READY
     ========================================= */

  document.documentElement.classList.add("js-ready");
});
