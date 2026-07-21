document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;

    const header = document.querySelector("#siteHeader");
    const menuButton = document.querySelector(".menu-button");
    const mobileMenu = document.querySelector("#mobileMenu");

    const mobileLinks = document.querySelectorAll("#mobileMenu a");
    const navigationLinks = document.querySelectorAll(
        '.desktop-nav a, #mobileMenu a'
    );

    const sections = document.querySelectorAll("section[id]");
    const revealItems = document.querySelectorAll(".reveal");

    const cursorGlow = document.querySelector("#cursorGlow");
    const heroShowcase = document.querySelector("#heroShowcase");
    const browserWindow = document.querySelector("#browserWindow");


    /* =========================
       MOBILE MENU
    ========================= */

    function closeMobileMenu() {
        if (!menuButton || !mobileMenu) {
            return;
        }

        mobileMenu.classList.remove("open");
        menuButton.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        body.classList.remove("menu-open");
    }


    if (menuButton && mobileMenu) {
        menuButton.addEventListener("click", () => {
            const isOpen = mobileMenu.classList.toggle("open");

            menuButton.classList.toggle("open", isOpen);
            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            body.classList.toggle("menu-open", isOpen);
        });


        mobileLinks.forEach(link => {
            link.addEventListener("click", closeMobileMenu);
        });


        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) {
                closeMobileMenu();
            }
        });
    }


    /* =========================
       SMOOTH SCROLLING
    ========================= */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(anchor => {
            anchor.addEventListener("click", event => {
                const href = anchor.getAttribute("href");

                if (!href || href === "#") {
                    return;
                }

                const target = document.querySelector(href);

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });
        });
            /* =========================
       STICKY HEADER
    ========================= */

    function updateHeader() {

        if (!header) return;

        if (window.scrollY > 20) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    }

    updateHeader();

    window.addEventListener("scroll", updateHeader);


    /* =========================
       ACTIVE NAV LINK
    ========================= */

    function updateActiveLink() {

        let currentSection = "";

        sections.forEach(section => {

            const sectionTop = section.offsetTop - 140;

            if (window.scrollY >= sectionTop) {
                currentSection = section.id;
            }

        });

        navigationLinks.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + currentSection) {
                link.classList.add("active");
            }

        });

    }

    updateActiveLink();

    window.addEventListener("scroll", updateActiveLink);


    /* =========================
       REVEAL ANIMATIONS
    ========================= */

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    revealObserver.unobserve(entry.target);

                }

            });

        }, {

            threshold: 0.15

        });

        revealItems.forEach(item => {

            revealObserver.observe(item);

        });

    } else {

        revealItems.forEach(item => {

            item.classList.add("visible");

        });

    }


    /* =========================
       CURSOR GLOW
    ========================= */

    if (cursorGlow && window.matchMedia("(pointer:fine)").matches) {

        window.addEventListener("mousemove", e => {

            cursorGlow.style.left = e.clientX + "px";
            cursorGlow.style.top = e.clientY + "px";
            cursorGlow.style.opacity = "1";

        });

        document.addEventListener("mouseleave", () => {

            cursorGlow.style.opacity = "0";

        });

    }
        /* =========================
       3D HERO BROWSER EFFECT
    ========================= */

    if (heroShowcase && browserWindow) {
        heroShowcase.addEventListener("mousemove", event => {
            if (window.innerWidth <= 900) {
                return;
            }

            const bounds = heroShowcase.getBoundingClientRect();

            const mouseX = event.clientX - bounds.left;
            const mouseY = event.clientY - bounds.top;

            const centerX = bounds.width / 2;
            const centerY = bounds.height / 2;

            const rotateY =
                ((mouseX - centerX) / centerX) * 5;

            const rotateX =
                ((centerY - mouseY) / centerY) * 4;

            browserWindow.style.animation = "none";

            browserWindow.style.transform =
                `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        heroShowcase.addEventListener("mouseleave", () => {
            if (window.innerWidth <= 900) {
                return;
            }

            browserWindow.style.transform = "";

            browserWindow.style.animation =
                "browserFloat 5s ease-in-out infinite";
        });
    }


    /* =========================
       FAQ ACCORDION
    ========================= */

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        item.addEventListener("toggle", () => {
            if (!item.open) {
                return;
            }

            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.removeAttribute("open");
                }
            });
        });
    });


    /* =========================
       CONTACT FORM
    ========================= */

    const contactForm = document.querySelector(".contact-form");

    if (
        contactForm &&
        contactForm.action &&
        !contactForm.action.includes("YOUR_FORM_ID")
    ) {
        contactForm.addEventListener("submit", async event => {
            event.preventDefault();

            const submitButton =
                contactForm.querySelector('button[type="submit"]');

            const textElement =
                submitButton?.querySelector("span:first-child");

            const originalText =
                textElement?.textContent || "Send Project Inquiry";

            if (submitButton) {
                submitButton.disabled = true;
            }

            if (textElement) {
                textElement.textContent = "Sending...";
            }

            try {
                const response = await fetch(contactForm.action, {
                    method: "POST",
                    body: new FormData(contactForm),
                    headers: {
                        Accept: "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("Form submission failed");
                }

                contactForm.reset();

                if (textElement) {
                    textElement.textContent = "Message Sent";
                }
            } catch (error) {
                console.error(error);

                if (textElement) {
                    textElement.textContent = "Please Try Again";
                }
            } finally {
                window.setTimeout(() => {
                    if (submitButton) {
                        submitButton.disabled = false;
                    }

                    if (textElement) {
                        textElement.textContent = originalText;
                    }
                }, 3000);
            }
        });
    }

});