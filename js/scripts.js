// --- MENU ---
// Inicializa eventos do menu: toggle, fechar no clique fora, scroll e clique em link
function initMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menu");

  function toggleMenu(e) {
    e.stopPropagation();
    menuToggle.classList.toggle("open");
    menu.classList.toggle("show");
  }

  menuToggle.addEventListener("click", toggleMenu);

  // Fecha menu clicando fora
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
      menu.classList.remove("show");
      menuToggle.classList.remove("open");
    }
  });

  // Fecha menu ao clicar em link
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("show");
      menuToggle.classList.remove("open");
    });
  });

  // Fecha menu ao rolar página
  window.addEventListener("scroll", () => {
    menu.classList.remove("show");
    menuToggle.classList.remove("open");
  });
}

// --- PARTICULAS ---
// Inicializa as partículas com base nas variáveis CSS e viewport
function initParticles() {
  const rootStyles = getComputedStyle(document.documentElement);
  const bgColor = rootStyles.getPropertyValue("--bg-color").trim();
  const light = rootStyles.getPropertyValue("--text-light").trim();
  const isMobile = window.innerWidth < 768;

  tsParticles.load("particles-js", {
    fullScreen: { enable: false },
    background: { color: { value: bgColor } },
    fpsLimit: 60,
    particles: {
      number: {
        value: isMobile ? 25 : 45,
        density: { enable: true, area: 800 },
      },
      color: { value: light },
      links: {
        enable: true,
        color: light,
        distance: 150,
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        outModes: { default: "bounce" },
        attract: { enable: true, rotateX: 600, rotateY: 1200 },
      },
      shape: { type: "circle" },
      size: {
        value: { min: 1, max: 3 },
        animation: { enable: true, speed: 8, minimumValue: 1, sync: false },
      },
      opacity: {
        value: 0.5,
        animation: { enable: true, speed: 0.5, minimumValue: 0.1, sync: false },
      },
    },
    interactivity: {
      events: { onHover: { enable: !isMobile, mode: "attract" }, resize: true },
      modes: { repulse: { distance: 120, duration: 0.4 } },
    },
    detectRetina: true,
  });
}

// --- INTERSECTION OBSERVER GENERICO ---
// Cria e retorna um IntersectionObserver configurado com callback e threshold customizados
function createObserver(callback, options = { threshold: 0.3 }) {
  return new IntersectionObserver(callback, options);
}

// --- ANIMACAO SOBRE ---
// Anima a seção "sobre" uma vez quando 30% visível
function animateSobre() {
  const sobreSection = document.getElementById("sobre");
  if (!sobreSection) return;

  sobreSection.classList.add("animate-in");

  const observer = createObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          sobreSection.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(sobreSection);
}

// --- ANIMACAO CARDS SEQUENCIAIS ---
// Anima cards sequencialmente com delay ao aparecer (ex: skills, projetos)
function animateCards(containerSelector, cardSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const cards = container.querySelectorAll(cardSelector);
  if (cards.length === 0) return;

  const observer = createObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add("visible");
            }, index * 150);
          });
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(container);
}

// --- ANIMACAO FORMULARIO CONTATO ---
// Anima formulário e info de contato ao aparecer na tela
function animateContato() {
  const container = document.querySelector(".container-contato");
  const form = document.querySelector(".contato-formulario");
  const info = document.querySelector(".contato-info");
  if (!container || !form || !info) return;

  const observer = createObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          form.classList.add("visible");
          info.classList.add("visible");
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(container);
}

// --- FUNCAO ENVIAR WHATSAPP ---
// Envia mensagem via WhatsApp com dados do formulário
function enviarWhatsApp(event) {
  event.preventDefault();
  const nome = document.getElementById("nome").value;
  const mensagem = document.getElementById("mensagem").value;
  const numero = "5511987654321"; // Alterar para seu número

  const texto = encodeURIComponent(`Olá, me chamo ${nome}. ${mensagem}`);
  const link = `https://wa.me/${numero}?text=${texto}`;
  window.open(link, "_blank");
}

// --- INICIALIZAÇÕES ---
// Função principal para iniciar tudo ao carregar DOM
function init() {
  initMenu();
  initParticles();
  animateSobre();
  animateCards(".card-container", ".card-skills");
  animateCards(".projects-grid", ".card-proj");
  animateContato();

  // Observer genérico para fade-in dos elementos fade-on-scroll
  const fadeObserver = createObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  document
    .querySelectorAll(".fade-on-scroll")
    .forEach((el) => fadeObserver.observe(el));
}

// Aguarda o carregamento do DOM para iniciar o script
document.addEventListener("DOMContentLoaded", init);
