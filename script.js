const loader = document.getElementById("loader");
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const header = document.querySelector("header");
const heroVisual = document.getElementById("heroVisual");
const revealElements = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");
const faqItems = document.querySelectorAll(".faq-item");

document.body.classList.add("no-scroll");

/* LOADING SCREEN */
window.addEventListener("load", () => {
  setTimeout(() => {
    if (loader) {
      loader.classList.add("hide");
    }

    document.body.classList.remove("no-scroll");

    revealOnScroll();
    startCounters();
  }, 900);
});

/* MOBILE MENU */
if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("active");
    menuBtn.textContent = nav.classList.contains("active") ? "✕" : "☰";
  });

  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      menuBtn.textContent = "☰";
    });
  });
}

/* SCROLL REVEAL */
function revealOnScroll() {
  revealElements.forEach(el => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < windowHeight - 120) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);

/* STICKY NAVBAR */
window.addEventListener("scroll", () => {
  if (!header) return;

  if (window.scrollY > 80) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

/* HERO PARALLAX */
document.addEventListener("mousemove", e => {
  if (!heroVisual || window.innerWidth < 980) return;

  const x = (window.innerWidth / 2 - e.clientX) / 45;
  const y = (window.innerHeight / 2 - e.clientY) / 45;

  heroVisual.style.transform = `translate(${x}px, ${y}px)`;
});

/* STAT COUNTERS */
let countersStarted = false;

function startCounters() {
  if (countersStarted) return;

  const statsSection = document.getElementById("stats");
  if (!statsSection) return;

  const sectionTop = statsSection.getBoundingClientRect().top;

  if (sectionTop < window.innerHeight - 100) {
    countersStarted = true;

    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute("data-count"));
      const suffix = counter.getAttribute("data-suffix") || "";
      const duration = 1800;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const value = target * easedProgress;

        if (target % 1 !== 0) {
          counter.textContent = value.toFixed(1) + suffix;
        } else {
          counter.textContent = Math.floor(value).toLocaleString() + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent =
            target % 1 !== 0
              ? target.toFixed(1) + suffix
              : target.toLocaleString() + suffix;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }
}

window.addEventListener("scroll", startCounters);

/* SCROLL PROGRESS BAR */
const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
document.body.appendChild(progressBar);

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;

  progressBar.style.width = `${scrollPercent}%`;
});

/* BACK TO TOP BUTTON */
const backToTop = document.createElement("button");
backToTop.className = "back-to-top";
backToTop.innerHTML = "↑";
document.body.appendChild(backToTop);

window.addEventListener("scroll", () => {
  if (window.scrollY > 700) {
    backToTop.classList.add("active");
  } else {
    backToTop.classList.remove("active");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

/* FAQ ACCORDION */
faqItems.forEach(item => {
  const question = item.querySelector(".faq-question");

  if (!question) return;

  question.addEventListener("click", () => {
    faqItems.forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove("active");
      }
    });

    item.classList.toggle("active");
  });
});