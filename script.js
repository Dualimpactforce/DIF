document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Deja de observar para no repetir animación
      }
    });
  }, {
    threshold: 0.2 // Se activa cuando el 20% del elemento está visible
  });

  elements.forEach(el => observer.observe(el));
});


// ==== HEADER / NAVIGATION SCROLL BEHAVIOR ====
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const checkbox = document.getElementById("nav-toggle");
  const navList = document.querySelector(".header__nav-list");

  function getThreshold() {
    return window.innerHeight * 0.55;
  }

  function updateHeaderOnScroll() {
    const scY = window.scrollY;
    const threshold = getThreshold();

    if (scY === 0) {
      // Estado inicial: mostrar links centrados
      header.classList.add("top");
      header.classList.remove("scrolled", "show-logo");
      if (checkbox) checkbox.checked = false;
    } else {
      header.classList.remove("top");
      header.classList.add("scrolled");
      if (scY >= threshold) {
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
  navList.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      if (checkbox) checkbox.checked = false;
    });
  });
});


  document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".header__nav a");
    const checkbox = document.getElementById("nav-toggle");

    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        // Cierra el menú
        checkbox.checked = false;

        // Si querés un desplazamiento suave:
        const targetId = link.getAttribute("href");
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  });


// - - - CARDS - - -

  document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".slider-track");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  const slideWidth = track.querySelector(".slide-card").offsetWidth + 20;

  prevBtn.addEventListener("click", () => {
    track.scrollLeft -= slideWidth;
  });

  nextBtn.addEventListener("click", () => {
    track.scrollLeft += slideWidth;
  });
});

// - - -- - - - - - 

document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".slider-track");
  const slides = document.querySelectorAll(".slide-card");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  const progressBar = document.querySelector(".progress-bar");
  let current = 0;

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

// Grid . . -- - - - -- - 


document.addEventListener("DOMContentLoaded", () => {
  // ===== SELECTORES RELATIVOS AL SLIDER =====
  const container = document.querySelector(".clientes-slider");
  if (!container) return console.error("CLIENTES SLIDER: .clientes-slider no encontrada");

  const track = container.querySelector(".clientes-track");
  const slides = Array.from(container.querySelectorAll(".cliente-card"));
  const prevBtn = container.querySelector(".prev");
  const nextBtn = container.querySelector(".next");
  const progressBar = container.querySelector(".clientes-progress");

  if (!track || slides.length === 0) return console.error("CLIENTES SLIDER: track o slides no encontrados");
  if (!prevBtn || !nextBtn) console.warn("CLIENTES SLIDER: faltan botones prev/next");

  // ===== VARIABLES =====
  let current = 0;
  let slideWidth = container.clientWidth;

  // ===== INICIALIZAR TAMAÑOS Y BARRA DE PROGRESO =====
  function initSizes() {
    slideWidth = container.clientWidth;

    // Ajustar track
    track.style.width = `${slides.length * slideWidth}px`;
    track.style.display = "flex";
    track.style.transition = "transform 0.6s ease";

    // Ajustar cada slide
    slides.forEach(slide => {
      slide.style.flex = `0 0 ${slideWidth}px`;
      slide.style.maxWidth = `${slideWidth}px`;
      slide.style.boxSizing = "border-box";
    });

    // Crear indicadores de progreso
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

  // ===== FUNCION PARA MOVER SLIDER =====
  function goTo(index, animate = true) {
    current = ((index % slides.length) + slides.length) % slides.length; // wrap-around
    const px = -current * slideWidth;

    track.style.transition = animate ? "transform 0.6s ease" : "none";
    track.style.transform = `translateX(${px}px)`;

    // Actualizar dots
    if (progressBar) {
      const dots = progressBar.querySelectorAll(".progress-dot");
      dots.forEach((d, i) => d.classList.toggle("active", i === current));
    }
  }

  // ===== LISTENERS DE BOTONES =====
  if (nextBtn) nextBtn.addEventListener("click", () => goTo(current + 1));
  if (prevBtn) prevBtn.addEventListener("click", () => goTo(current - 1));

  // ===== SWIPE TOUCH =====
  let startX = 0;
  let isSwiping = false;

  container.addEventListener("touchstart", (e) => {
    if (e.touches && e.touches[0]) {
      startX = e.touches[0].clientX;
      isSwiping = true;
      track.style.transition = "none";
    }
  }, { passive: true });

  container.addEventListener("touchend", (e) => {
    if (!isSwiping) return;
    const endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : startX;
    const dx = endX - startX;
    const threshold = Math.min(window.innerWidth * 0.12, 60);

    if (dx < -threshold) goTo(current + 1);
    else if (dx > threshold) goTo(current - 1);
    else goTo(current); // snap back

    isSwiping = false;
  }, { passive: true });

  // ===== RESIZE =====
  window.addEventListener("resize", () => {
    const prevIndex = current;
    initSizes();
    goTo(prevIndex, false);
  });

  // ===== INICIAR =====
  initSizes();

  // ===== DEBUG (opcional) =====
  window.__clientesSlider = { goTo, initSizes, slides, track, container };
});




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
