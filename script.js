const loader = document.getElementById("loader");
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const header = document.querySelector("header");
const revealElements = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");
const faqItems = document.querySelectorAll(".faq-item");

document.body.classList.add("no-scroll");

/* Loader */
window.addEventListener("load", () => {
  setTimeout(() => {
    if (loader) loader.classList.add("hide");

    document.body.classList.remove("no-scroll");
    revealOnScroll();
    startCounters();
  }, 900);
});

/* Mobile Menu */
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

/* Scroll Reveal */
function revealOnScroll() {
  revealElements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < window.innerHeight - 120) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);

/* Sticky Header */
window.addEventListener("scroll", () => {
  if (!header) return;

  if (window.scrollY > 80) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

/* Counter Animation */
let countersStarted = false;

function startCounters() {
  if (countersStarted) return;

  const statsSection = document.getElementById("stats");
  if (!statsSection) return;

  const sectionTop = statsSection.getBoundingClientRect().top;

  if (sectionTop < window.innerHeight - 120) {
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

/* Scroll Progress Bar */
const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
document.body.appendChild(progressBar);

function updateProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  progressBar.style.width = `${scrollPercent}%`;
}

window.addEventListener("scroll", updateProgressBar);
window.addEventListener("load", updateProgressBar);

/* Back To Top Button */
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

/* FAQ Accordion */
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