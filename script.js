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


// ==== SLIDER (SECCIÓN CLIENTES / TESTIMONIOS) ====
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".clientes-slider");
  if (!container) return console.error("CLIENTES SLIDER: .clientes-slider no encontrada");

  const track = container.querySelector(".clientes-track");
  const slides = Array.from(container.querySelectorAll(".cliente-card"));
  const prevBtn = container.querySelector(".prev");
  const nextBtn = container.querySelector(".next");
  const progressBar = container.querySelector(".clientes-progress");

  if (!track || slides.length === 0) return console.error("CLIENTES SLIDER: track o slides no encontrados");
  if (!prevBtn || !nextBtn) console.warn("CLIENTES SLIDER: faltan botones prev/next");

  let current = 0;
  let slideWidth = container.clientWidth;

  // Inicializar tamaños y barra
  function initSizes() {
    slideWidth = container.clientWidth;
    track.style.width = `${slides.length * slideWidth}px`;
    track.style.display = "flex";
    track.style.transition = "transform 0.6s ease";

    slides.forEach(slide => {
      slide.style.flex = `0 0 ${slideWidth}px`;
      slide.style.maxWidth = `${slideWidth}px`;
      slide.style.boxSizing = "border-box";
    });

    if (progressBar) {
      progressBar.innerHTML = "";
      slides.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.className = "progress-dot" + (i === 0 ? " active" : "");
        progressBar.appendChild(dot);
      });
    }

    goTo(current, false);
  }

  // Movimiento del slider
  function goTo(index, animate = true) {
    current = ((index % slides.length) + slides.length) % slides.length;
    const px = -current * slideWidth;
    track.style.transition = animate ? "transform 0.6s ease" : "none";
    track.style.transform = `translateX(${px}px)`;

    if (progressBar) {
      const dots = progressBar.querySelectorAll(".progress-dot");
      dots.forEach((d, i) => d.classList.toggle("active", i === current));
    }
  }

  // Botones
  if (nextBtn) nextBtn.addEventListener("click", () => goTo(current + 1));
  if (prevBtn) prevBtn.addEventListener("click", () => goTo(current - 1));

  // Swipe táctil
  let startX = 0;
  let isSwiping = false;

  container.addEventListener("touchstart", e => {
    if (e.touches && e.touches[0]) {
      startX = e.touches[0].clientX;
      isSwiping = true;
      track.style.transition = "none";
    }
  }, { passive: true });

  container.addEventListener("touchend", e => {
    if (!isSwiping) return;
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;
    const threshold = Math.min(window.innerWidth * 0.12, 60);

    if (dx < -threshold) goTo(current + 1);
    else if (dx > threshold) goTo(current - 1);
    else goTo(current);

    isSwiping = false;
  }, { passive: true });

  window.addEventListener("resize", () => {
    const prevIndex = current;
    initSizes();
    goTo(prevIndex, false);
  });

  initSizes();
  window.__clientesSlider = { goTo, initSizes, slides, track, container };
});
