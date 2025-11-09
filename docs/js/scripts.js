document.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("header-placeholder");
  const footerContainer = document.getElementById("footer-placeholder");

  // Detecta si está en GitHub Pages
  const isGithub = window.location.hostname.includes("github.io");

  // Calcula la profundidad del archivo actual
  const pathDepth = window.location.pathname.split("/").length - 2;
  const basePath = isGithub
    ? "/juntosenelespectro/"
    : "../".repeat(pathDepth - 1);

  // --- CARGAR HEADER ---
  if (headerContainer) {
    fetch(`${basePath}partials/header.html`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar header");
        return res.text();
      })
      .then((html) => {
        headerContainer.innerHTML = html;

        // Corrige imágenes dentro del header
        headerContainer.querySelectorAll("img").forEach((img) => {
          const src = img.getAttribute("src");
          if (!src.startsWith("http") && !src.startsWith("/")) {
            img.src = `${basePath}${src.replace(/^(\.\/|\/)?/, "")}`;
          }
        });

        // Interacciones del menú
        const hamburger = document.querySelector(".hamburger");
        const nav = document.getElementById("main-nav");
        const backdrop = document.querySelector(".nav-backdrop");

        const openNav = () => {
          nav.classList.add("open");
          hamburger.classList.add("active");
          hamburger.setAttribute("aria-expanded", "true");
          backdrop.hidden = false;
          document.body.classList.add("nav-open");
        };

        const closeNav = () => {
          nav.classList.remove("open");
          hamburger.classList.remove("active");
          hamburger.setAttribute("aria-expanded", "false");
          backdrop.hidden = true;
          document.body.classList.remove("nav-open");
        };

        hamburger?.addEventListener("click", () => {
          nav.classList.contains("open") ? closeNav() : openNav();
        });
        backdrop?.addEventListener("click", closeNav);
        nav?.querySelectorAll("a").forEach((link) =>
          link.addEventListener("click", closeNav)
        );
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape") closeNav();
        });
      })
      .catch((err) => console.warn(err));
  }

  // --- CARGAR FOOTER ---
  if (footerContainer) {
    fetch(`${basePath}partials/footer.html`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar footer");
        return res.text();
      })
      .then((html) => {
        footerContainer.innerHTML = html;

        // Corrige imágenes dentro del footer
        footerContainer.querySelectorAll("img").forEach((img) => {
          const src = img.getAttribute("src");
          if (!src.startsWith("http") && !src.startsWith("/")) {
            img.src = `${basePath}${src.replace(/^(\.\/|\/)?/, "")}`;
          }
        });
      })
      .catch((err) => console.warn(err));
  }

  // --- CORRIGE IMÁGENES EN EL CONTENIDO PRINCIPAL ---
  document.querySelectorAll("main img, .section img, .container img").forEach((img) => {
    const src = img.getAttribute("src");
    if (src && !src.startsWith("http") && !src.startsWith("/") && !src.startsWith(basePath)) {
      img.src = `${basePath}${src.replace(/^(\.\/|\/)?/, "")}`;
    }
  });
});

// --- EFECTO STICKY HEADER ---
document.addEventListener("scroll", () => {
  document.body.classList.toggle("scrolled", window.scrollY > 20);
});




// menú hamburguesa y off-canvas
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.getElementById('main-nav');
  const backdrop = document.querySelector('.nav-backdrop');

  function openNav() {
    nav.classList.add('open');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    backdrop.hidden = false;
    document.body.classList.add('nav-open');
  }

  function closeNav() {
    nav.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    backdrop.hidden = true;
    document.body.classList.remove('nav-open');
  }

  hamburger.addEventListener('click', () => {
    if (nav.classList.contains('open')) {
      closeNav();
    } else {
      openNav();
    }
  });

  // clic en backdrop
  backdrop.addEventListener('click', closeNav);

  // clic en menú
  document.querySelectorAll('#main-menu a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // cerrar con Esc
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeNav();
    }
  });
});





// movimiento de grid artículos y recursos desc
(function(){
  const wrap = document.querySelector('.articles-wrap');
  if (!wrap) return;

  const scroller = wrap.querySelector('.articles-grid');
  const cards = [...scroller.children];
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    scroller.appendChild(clone);
  });

  const prevBtn  = wrap.querySelector('.prev');
  const nextBtn  = wrap.querySelector('.next');

  const autoplayEnabled = wrap.dataset.autoplay === 'true';
  const intervalMs = Number(wrap.dataset.interval || 5000);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let autoplayTimer = null;
  let isHoverOrFocus = false;

  function slideWidth() {
    const card = scroller.querySelector('.card-post');
    if (!card) return scroller.clientWidth; 
    const styles = getComputedStyle(scroller);
    const gap = parseFloat(styles.columnGap || styles.gap || 16);
    return card.getBoundingClientRect().width + gap;
  }

  function atEnd() {
    return scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 2;
  }

  function atStart() {
    return scroller.scrollLeft <= 2;
  }

  function updateButtons() {
    if (prevBtn && nextBtn) {
      prevBtn.disabled = atStart();
      nextBtn.disabled = atEnd();
    }
  }

  function scrollByCard(dir = 1) {
  const width = slideWidth();
  scroller.scrollBy({ left: dir * width, behavior: 'smooth' });

  if (dir > 0 && scroller.scrollLeft >= scroller.scrollWidth / 2) {
    scroller.scrollLeft = 0;
  } else if (dir < 0 && scroller.scrollLeft <= 0) {
    scroller.scrollLeft = scroller.scrollWidth / 2 - scroller.clientWidth;
  }

  setTimeout(updateButtons, 500);
}


  
  if (prevBtn) prevBtn.addEventListener('click', () => scrollByCard(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollByCard(1));

  
  function startAutoplay() {
  if (!autoplayEnabled || prefersReduced) return;
  stopAutoplay();

  autoplayTimer = setInterval(() => {
    if (isHoverOrFocus) return;

    const width = slideWidth();
    scroller.scrollBy({ left: width, behavior: 'smooth' });

    if (scroller.scrollLeft >= scroller.scrollWidth / 2) {
      scroller.scrollLeft = 0;
    }
  }, intervalMs);
}

  function stopAutoplay() { if (autoplayTimer) clearInterval(autoplayTimer); }

  
  ['mouseenter','focusin'].forEach(evt => wrap.addEventListener(evt, () => { isHoverOrFocus = true; }));
  ['mouseleave','focusout'].forEach(evt => wrap.addEventListener(evt, () => { isHoverOrFocus = false; }));

  
  scroller.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons);

  
  updateButtons();
  startAutoplay();

  
  window.addEventListener('resize', () => { startAutoplay(); });
})();




// timer eventos
document.addEventListener("DOMContentLoaded", () => {
  const timers = Array.from(document.querySelectorAll(".timer[data-target]"));
  if (!timers.length) return;

  function fmt(n){ return String(n).padStart(2,"0"); }

  function tick() {
    const now = Date.now();

    timers.forEach(el => {
      const target = new Date(el.dataset.target).getTime();
      const diff = target - now;

      if (isNaN(target)) { el.textContent = "Fecha inválida"; return; }
      if (diff <= 0) { el.textContent = "¡El evento ya comenzó!"; return; }

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      el.textContent = (d > 0 ? `${d}d ` : "") + `${fmt(h)}:${fmt(m)}:${fmt(s)}`;
    });
  }

  tick();
  setInterval(tick, 1000);

  // form evento
  document.querySelectorAll(".event-form").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const btn = form.querySelector(".btn");
      btn.disabled = true; btn.textContent = "Enviando…";
      setTimeout(() => { btn.textContent = "Inscripta/o ✔"; }, 900);
    });
  });
});





// newsletter fake
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newsletter-form");
  if (!form) return;

  const emailInput = document.getElementById("nl-email");
  const submitBtn  = document.getElementById("nl-submit");
  const statusBox  = document.getElementById("nl-status");

  const KEY = "nl_subscribed_email";
  const saved = localStorage.getItem(KEY);
  if (saved) {
    showStatus(`¡Listo, ${saved}! Ya estás suscripto. Revisá tu bandeja de entrada (y spam) para confirmar.`, "success");
    form.setAttribute("aria-hidden", "true");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = (emailInput.value || "").trim();

    if (!isValidEmail(email)) {
      showStatus("Ingresá un correo válido (ej: nombre@dominio.com).", "error");
      emailInput.focus();
      return;
    }

    submitBtn.classList.add("is-loading");
    submitBtn.disabled = true;
    showStatus("Enviando…", null);

    setTimeout(() => {

      showStatus(`¡Gracias! Enviamos un correo a <strong>${escapeHtml(email)}</strong>. Revisá tu bandeja de entrada y confirmá la suscripción.`, "success");
      localStorage.setItem(KEY, email);
      form.reset();
      submitBtn.classList.remove("is-loading");
      submitBtn.disabled = false;
    }, 1200);
  });

  function isValidEmail(v) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  function showStatus(msg, type) {
    if (!statusBox) return;
    statusBox.hidden = !msg;
    statusBox.className = "nl-status" + (type ? " " + type : "");
    statusBox.innerHTML = msg || "";
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.innerText = str;
    return div.innerHTML;
  }
});


(function () {
  function onReady(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  onReady(function () {
   
    const form = document.getElementById("contact-form");
    if (!form) return; 

    const email = form.querySelector("#email");
    const emailHelp = form.querySelector("#emailHelp");

    function clearEmailError() {
      email.classList.remove("error", "touched");
      email.removeAttribute("aria-invalid");
      emailHelp.textContent = "";
    }

    function setEmailError(msg) {
      email.classList.add("error", "touched");
      email.setAttribute("aria-invalid", "true");
      emailHelp.textContent = msg;
    }

    
    email.addEventListener("blur", () => {
      if (email.value.trim() === "") return;
      if (!email.checkValidity()) setEmailError("Ingresá un correo electrónico válido.");
    });

    
    email.addEventListener("input", () => {
      if (email.value.trim() === "" || email.checkValidity()) clearEmailError();
    });

    
    form.addEventListener("submit", (e) => {
      clearEmailError();
      const v = email.value.trim();

      if (v === "") {
        e.preventDefault();
        setEmailError("Ingresá tu correo electrónico.");
        email.focus();
        return;
      }
      if (!email.checkValidity()) {
        e.preventDefault();
        setEmailError("Ingresá un correo electrónico válido.");
        email.focus();
      }
    });
  });
})();
