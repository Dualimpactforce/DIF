// ==== REVEAL ANIMATIONS ====
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  elements.forEach(el => observer.observe(el));
});


// ==== HEADER / NAVIGATION SCROLL BEHAVIOR ====
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const checkbox = document.getElementById("open-menu"); // ✅ corregido
  const navList = document.querySelector(".header__nav-list");

  function updateHeaderOnScroll() {
    const scY = window.scrollY;

    if (scY === 0) {
      header.classList.add("top");
      header.classList.remove("scrolled", "show-logo");
      if (checkbox) checkbox.checked = false;
    } else {
      header.classList.remove("top");
      header.classList.add("scrolled");
      if (scY >= 500) {
        header.classList.add("show-logo");
      } else {
        header.classList.remove("show-logo");
      }
    }
  }

  updateHeaderOnScroll();
  window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });
  window.addEventListener("resize", updateHeaderOnScroll);

  // Cerrar menú al hacer click en un link
  if (navList) {
    navList.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        if (checkbox) checkbox.checked = false;
      });
    });
  }
});


// ==== NAVIGATION SCROLL SUAVE ====
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".header__nav a");
  const checkbox = document.getElementById("open-menu");

  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      const targetId = link.getAttribute("href");
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
      if (checkbox) checkbox.checked = false;
    });
  });
});


// ==== SLIDER (SECCIÓN SOBRE MÍ) ====
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".slider-track");
  const slides = document.querySelectorAll(".slide-card");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  const progressBar = document.querySelector(".progress-bar");
  let current = 0;

  if (!track || slides.length === 0) return;

  // Generar segmentos
  progressBar.innerHTML = "";
  slides.forEach((_, i) => {
    const seg = document.createElement("span");
    seg.classList.add("progress-segment");
    if (i === 0) seg.classList.add("active");
    progressBar.appendChild(seg);
  });

  const segments = document.querySelectorAll(".progress-segment");

  function updateSlider() {
    const offset = -current * 100;
    track.style.transform = `translateX(${offset}%)`;
    segments.forEach((seg, i) => seg.classList.toggle("active", i === current));
  }

  nextBtn.addEventListener("click", () => {
    current = (current + 1) % slides.length;
    updateSlider();
  });

  prevBtn.addEventListener("click", () => {
    current = (current - 1 + slides.length) % slides.length;
    updateSlider();
  });
});








// === SLIDER CLIENTES (simple y robusto) ===
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".clientes-slider");
  if (!container) return;

  const track = container.querySelector(".clientes-track");
  const slides = Array.from(container.querySelectorAll(".cliente-card"));
  const prevBtn = container.querySelector(".prev");
  const nextBtn = container.querySelector(".next");

  let current = 0;
  let slideWidth = container.clientWidth;

  function initSizes() {
    slideWidth = container.clientWidth;
    track.style.width = `${slides.length * slideWidth}px`;

    slides.forEach(slide => {
      slide.style.flex = `0 0 ${slideWidth}px`;
      slide.style.maxWidth = `${slideWidth}px`;
    });

    goTo(current, false);
  }

  function goTo(index, animate = true) {
    current = ((index % slides.length) + slides.length) % slides.length;
    const px = -current * slideWidth;
    track.style.transition = animate ? "transform 0.6s ease" : "none";
    track.style.transform = `translateX(${px}px)`;
  }

  nextBtn.addEventListener("click", () => goTo(current + 1));
  prevBtn.addEventListener("click", () => goTo(current - 1));

  window.addEventListener("resize", () => {
    const prevIndex = current;
    initSizes();
    goTo(prevIndex, false);
  });

  initSizes();
});

