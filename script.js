document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.querySelector(".menu-btn");
    const mobileMenu = document.querySelector(".mobile-menu");
    const navLinks = document.querySelectorAll(".nav-links a, .mobile-menu a");

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", () => {
            const open = mobileMenu.classList.toggle("open");
            document.body.classList.toggle("menu-open", open);
            menuBtn.textContent = open ? "×" : "☰";
        });
    }

    navLinks.forEach(link => {
        link.addEventListener("click", e => {
            const href = link.getAttribute("href");

            if (!href || !href.startsWith("#")) return;

            const target = document.querySelector(href);

            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            if (mobileMenu) {
                mobileMenu.classList.remove("open");
                document.body.classList.remove("menu-open");
                menuBtn.textContent = "☰";
            }
        });
    });

    const revealItems = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.14
    });

    revealItems.forEach(item => observer.observe(item));

    const sections = document.querySelectorAll("section[id]");

    const updateActiveLink = () => {
        let current = "";

        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 130) {
                current = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${current}`
            );
        });
    };

    updateActiveLink();
    window.addEventListener("scroll", updateActiveLink, { passive: true });
});