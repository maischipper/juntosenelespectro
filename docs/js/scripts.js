//carga header + footer

document.addEventListener("DOMContentLoaded", () => {

  const headerContainer = document.getElementById("header-placeholder");
  const footerContainer = document.getElementById("footer-placeholder");

  const isGithub = window.location.hostname.includes("github.io");
  const repoName = window.location.pathname.split("/")[1];
  const pathParts = window.location.pathname.split("/").filter(Boolean);

  let basePath;


  if (isGithub) {
    basePath = `/${repoName}/`;
  } else {
    if (pathParts.length <= 2) {

      basePath = "./";
    } else {

      basePath = "../".repeat(pathParts.length - 2);
    }
  }


  function includePartial(id, file, callback) {
    fetch(basePath + "partials/" + file)
      .then(res => res.text())
      .then(html => {
        document.getElementById(id).innerHTML = html;
        if (callback) callback();
      })
      .catch(err => console.warn("Error loading partial:", err));
  }


  function fixMenuLinks() {
    const links = document.querySelectorAll("[data-link]");
    links.forEach(link => {
      const target = link.dataset.link;
      link.href = basePath + target;
    });
  }

//header
  if (headerContainer) {
    includePartial("header-placeholder", "header.html", () => {

      fixMenuLinks();


      headerContainer.querySelectorAll("img").forEach(img => {
        const src = img.getAttribute("src");
        if (src && !src.startsWith("http") && !src.startsWith("/")) {
          img.src = `${basePath}${src.replace(/^(\.\/|\/)?/, "")}`;
        }
      });

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
      nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", closeNav));

      document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeNav();
      });
    });
  }

//footer
if (footerContainer) {
  includePartial("footer-placeholder", "footer.html", () => {

 
    fixMenuLinks();


    footerContainer.querySelectorAll("img").forEach(img => {
      let src = img.getAttribute("src");

      if (src.startsWith("/")) {
        src = src.replace(/^\//, ""); 
      }

      if (!src.startsWith("http") && !src.startsWith("/")) {
        img.src = `${basePath}${src.replace(/^(\.\/|\/)?/, "")}`;
      }
    });

  });
}


//sticky header
document.addEventListener("scroll", () => {
  document.body.classList.toggle("scrolled", window.scrollY > 20);
});



document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.getElementById('main-nav');
  const backdrop = document.querySelector('.nav-backdrop');

  if (!hamburger || !nav) return;

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
    nav.classList.contains('open') ? closeNav() : openNav();
  });

  backdrop?.addEventListener('click', closeNav);
  document.querySelectorAll('#main-menu a').forEach(link => link.addEventListener('click', closeNav));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNav();
  });
});


//carrusel y mov de articulos
(function(){
  const wrap = document.querySelector('.articles-wrap');
  if (!wrap) return;

  const scroller = wrap.querySelector('.articles-grid');
  const cards = [...scroller.children];
  cards.forEach(card => scroller.appendChild(card.cloneNode(true)));

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

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  wrap.addEventListener('mouseenter', () => isHoverOrFocus = true);
  wrap.addEventListener('mouseleave', () => isHoverOrFocus = false);

  scroller.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons);

  updateButtons();
  startAutoplay();
  window.addEventListener('resize', startAutoplay);

})();

//timer eventos
document.addEventListener("DOMContentLoaded", () => {
  const timers = document.querySelectorAll(".timer[data-target]");
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

  document.querySelectorAll(".event-form").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const btn = form.querySelector(".btn");
      btn.disabled = true;
      btn.textContent = "Enviando…";
      setTimeout(() => btn.textContent = "Inscripta/o ✔", 900);
    });
  });
});


//newsletter fake
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

  form.addEventListener("submit", e => {
    e.preventDefault();

    const email = emailInput.value.trim();

    if (!isValidEmail(email)) {
      showStatus("Ingresá un correo válido (ej: nombre@dominio.com).", "error");
      emailInput.focus();
      return;
    }

    submitBtn.classList.add("is-loading");
    submitBtn.disabled = true;
    showStatus("Enviando…");

    setTimeout(() => {
      showStatus(`¡Gracias! Enviamos un correo a <strong>${escapeHtml(email)}</strong>. Revisá tu bandeja de entrada.`, "success");
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


//validacion form contacto
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
