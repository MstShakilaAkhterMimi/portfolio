/* =========================
   Portfolio interactions
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-link");
  const typedRole = document.querySelector("#typed-role");
  const contactForm = document.querySelector("#contact-form");
  const formStatus = document.querySelector("#form-status");
  const year = document.querySelector("#year");

  // Keep the footer year current.
  if (year) year.textContent = new Date().getFullYear();

  // Mobile navigation: open/close and close after choosing a section.
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
      navLinks.classList.toggle("open", !isOpen);
    });

    navItems.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
      }
    });
  }

  // Typing animation cycles through the portfolio role titles.
  if (typedRole && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const roles = ["Web Developer", "Frontend Developer", "Graphic Designer"];
    let roleIndex = 0;
    let characterIndex = roles[0].length;
    let deleting = true;
    typedRole.textContent = roles[0];

    function typeNext() {
      const currentRole = roles[roleIndex];

      if (deleting) {
        characterIndex--;
        typedRole.textContent = currentRole.slice(0, Math.max(0, characterIndex));
        if (characterIndex <= 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          window.setTimeout(typeNext, 350);
          return;
        }
        window.setTimeout(typeNext, 45);
      } else {
        const nextRole = roles[roleIndex];
        characterIndex++;
        typedRole.textContent = nextRole.slice(0, characterIndex);
        if (characterIndex >= nextRole.length) {
          deleting = true;
          window.setTimeout(typeNext, 1500);
          return;
        }
        window.setTimeout(typeNext, 85);
      }
    }
    window.setTimeout(typeNext, 1800);
  }

  // Reveal sections as they enter the viewport; show them immediately if unsupported.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Update the active nav item based on the visible section.
  const sections = document.querySelectorAll("main section[id]");
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navItems.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${entry.target.id}`;
            link.classList.toggle("active", isActive);
            if (isActive) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Client-side contact form validation. This demo does not send messages anywhere.
  if (contactForm && formStatus) {
    const fields = [...contactForm.querySelectorAll("input, textarea")];
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    fields.forEach((field) => {
      field.addEventListener("input", () => {
        field.classList.remove("field-error");
        if (formStatus.classList.contains("error")) {
          formStatus.textContent = "Demo form: messages are not sent to a server.";
          formStatus.className = "form-status";
        }
      });
    });

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      let firstInvalid = null;

      fields.forEach((field) => {
        const value = field.value.trim();
        let valid = value.length > 0;
        if (field.type === "email" && value) valid = emailPattern.test(value);
        field.classList.toggle("field-error", !valid);
        if (!valid && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        formStatus.textContent = firstInvalid.type === "email" && firstInvalid.value.trim()
          ? "Please enter a valid email address."
          : "Please complete all fields before continuing.";
        formStatus.className = "form-status error";
        firstInvalid.focus();
        return;
      }

      formStatus.textContent = "Looks good! This demo form does not send messages. Connect a form service or backend to receive submissions.";
      formStatus.className = "form-status success";
      contactForm.reset();
      fields.forEach((field) => field.classList.remove("field-error"));
    });
  }
});
