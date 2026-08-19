/* ================================================================
   VISZEN-INSPIRED PORTFOLIO JAVASCRIPT

   Features:
   1. Animated canvas particle background
   2. Mobile navigation
   3. Automatic footer year
   4. Project filtering
   5. Automatic section numbering
   6. Scroll reveal animations
   7. Performance and accessibility protections
   ================================================================ */


/* ================================================================
   1. CREATE THE PARTICLE CANVAS

   This creates the canvas automatically, so you do not need to add
   a <canvas> element manually to every HTML page.
   ================================================================ */

const particleCanvas = document.createElement("canvas");

particleCanvas.id = "particle-canvas";
particleCanvas.setAttribute("aria-hidden", "true");

document.body.prepend(particleCanvas);


/* ================================================================
   2. MOBILE NAVIGATION
   ================================================================ */

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  });

  // Close the mobile menu after selecting a navigation link.
  navigation.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      navigation.classList.remove("open");

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  });

  // Allow visitors to close the menu with the Escape key.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      navigation.classList.remove("open");

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );

      menuButton.focus();
    }
  });

  // Close the menu if the visitor clicks somewhere outside it.
  document.addEventListener("click", (event) => {
    const clickedInsideNavigation =
      navigation.contains(event.target);

    const clickedMenuButton =
      menuButton.contains(event.target);

    if (
      !clickedInsideNavigation &&
      !clickedMenuButton
    ) {
      navigation.classList.remove("open");

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  });
}


/* ================================================================
   3. AUTOMATIC FOOTER YEAR

   This updates every element containing the data-year attribute.

   Example:
   <span data-year></span>
   ================================================================ */

document
  .querySelectorAll("[data-year]")
  .forEach((element) => {
    element.textContent = new Date().getFullYear();
  });


/* ================================================================
   4. PROJECT FILTERING

   A filter button's data-filter value must match one of the words
   inside the corresponding project's data-tags value.

   Example button:
   <button class="filter" data-filter="javascript">
     JavaScript
   </button>

   Example card:
   <article
     class="project-card"
     data-tags="html-css javascript"
   >
   ================================================================ */

const filterButtons =
  document.querySelectorAll(".filter");

const projectCards =
  document.querySelectorAll(".project-card");

const emptyState =
  document.querySelector("#no-projects");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter =
      button.dataset.filter;

    let visibleProjectCount = 0;

    // Update the active filter button.
    filterButtons.forEach((filterButton) => {
      filterButton.classList.remove("active");

      filterButton.setAttribute(
        "aria-pressed",
        "false"
      );
    });

    button.classList.add("active");

    button.setAttribute(
      "aria-pressed",
      "true"
    );

    // Show or hide each project card.
    projectCards.forEach((card) => {
      const tags = card.dataset.tags
        .trim()
        .split(/\s+/);

      const shouldShow =
        selectedFilter === "all" ||
        tags.includes(selectedFilter);

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleProjectCount += 1;
      }
    });

    // Display a message if no projects match.
    if (emptyState) {
      emptyState.hidden =
        visibleProjectCount > 0;
    }
  });
});

// Set the initial accessibility state of each filter.
filterButtons.forEach((button) => {
  const isActive =
    button.classList.contains("active");

  button.setAttribute(
    "aria-pressed",
    String(isActive)
  );
});


/* ================================================================
   5. AUTOMATIC SECTION NUMBERS

   The CSS displays data-section using .section::after.

   This code automatically adds:
   01, 02, 03, 04 and so on.

   You therefore do not need to add data-section manually.
   ================================================================ */

const numberedSections =
  document.querySelectorAll(".section");

numberedSections.forEach((section, index) => {
  const sectionNumber =
    String(index + 1).padStart(2, "0");

  section.dataset.section = sectionNumber;
});


/* ================================================================
   6. SCROLL REVEAL ANIMATIONS

   Any element with class="reveal" becomes visible when it enters
   the viewport.

   Example:
   <section class="section wrap reveal">
   ================================================================ */

const revealElements =
  document.querySelectorAll(".reveal");

const prefersReducedMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

if (
  !prefersReducedMotion &&
  "IntersectionObserver" in window
) {
  const revealObserver =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("visible");

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
      }
    );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  // Show everything immediately when animations are unavailable
  // or the visitor has requested reduced motion.
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}


/* ================================================================
   7. PARTICLE BACKGROUND

   This produces the slow-moving star-like background.

   To change how many particles appear, edit:
   mobileParticleCount
   desktopParticleCount
   ================================================================ */

const canvasContext =
  particleCanvas.getContext("2d");

if (canvasContext) {
  let particles = [];
  let animationFrameId;
  let resizeTimer;

  const mobileParticleCount = 70;
  const desktopParticleCount = 150;

  /*
    Create a single particle with a random position, size,
    speed and opacity.
  */

  function createParticle() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,

      radius:
        Math.random() * 1.8 + 0.25,

      speed:
        Math.random() * 0.18 + 0.025,

      horizontalMovement:
        Math.random() * 0.08 - 0.04,

      opacity:
        Math.random() * 0.58 + 0.12
    };
  }

  /*
    Create fewer particles on smaller screens for better
    mobile performance.
  */

  function createParticleCollection() {
    const numberOfParticles =
      window.innerWidth < 700
        ? mobileParticleCount
        : desktopParticleCount;

    particles = Array.from(
      { length: numberOfParticles },
      createParticle
    );
  }

  /*
    Resize the canvas for the screen and account for high-density
    Retina displays.

    The pixel ratio is limited to 2 to avoid unnecessary rendering.
  */

  function resizeParticleCanvas() {
    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    particleCanvas.width =
      window.innerWidth * pixelRatio;

    particleCanvas.height =
      window.innerHeight * pixelRatio;

    particleCanvas.style.width =
      `${window.innerWidth}px`;

    particleCanvas.style.height =
      `${window.innerHeight}px`;

    canvasContext.setTransform(
      pixelRatio,
      0,
      0,
      pixelRatio,
      0,
      0
    );

    createParticleCollection();
  }

  /*
    Draw a single frame of the particle background.
  */

  function drawParticleFrame() {
    canvasContext.clearRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );

    particles.forEach((particle) => {
      canvasContext.beginPath();

      canvasContext.arc(
        particle.x,
        particle.y,
        particle.radius,
        0,
        Math.PI * 2
      );

      canvasContext.fillStyle =
        `rgba(215, 214, 238, ${particle.opacity})`;

      canvasContext.fill();
    });
  }

  /*
    Update particle positions and redraw the background.
  */

  function animateParticles() {
    canvasContext.clearRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );

    particles.forEach((particle) => {
      particle.y -= particle.speed;

      particle.x +=
        particle.horizontalMovement;

      // Move particles back to the bottom when they leave the top.
      if (particle.y < -5) {
        particle.y =
          window.innerHeight + 5;

        particle.x =
          Math.random() * window.innerWidth;
      }

      // Wrap particles horizontally.
      if (particle.x < -5) {
        particle.x =
          window.innerWidth + 5;
      }

      if (
        particle.x >
        window.innerWidth + 5
      ) {
        particle.x = -5;
      }

      canvasContext.beginPath();

      canvasContext.arc(
        particle.x,
        particle.y,
        particle.radius,
        0,
        Math.PI * 2
      );

      canvasContext.fillStyle =
        `rgba(215, 214, 238, ${particle.opacity})`;

      canvasContext.fill();
    });

    animationFrameId =
      window.requestAnimationFrame(
        animateParticles
      );
  }

  /*
    Recalculate the canvas after resizing.

    The timeout prevents the function from running excessively while
    the browser window is actively being resized.
  */

  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);

    resizeTimer = window.setTimeout(
      resizeParticleCanvas,
      160
    );
  });

  /*
    Pause the animation when the browser tab is hidden.
    This reduces unnecessary CPU and battery usage.
  */

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        window.cancelAnimationFrame(
          animationFrameId
        );
      } else if (!prefersReducedMotion) {
        animateParticles();
      }
    }
  );

  resizeParticleCanvas();

  if (prefersReducedMotion) {
    // Show a static particle background.
    drawParticleFrame();
  } else {
    animateParticles();
  }
}