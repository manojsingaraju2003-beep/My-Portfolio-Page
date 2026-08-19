document.addEventListener("DOMContentLoaded", () => {
  const INTRO_DURATION = 6000;
  const EXIT_DURATION = 650;

  const introPage =
    document.querySelector(".intro");

  const skipButton =
    document.querySelector("#skip-intro");

  const redirectMessage =
    document.querySelector("#redirect-message");

  let hasStartedLeaving = false;
  let automaticRedirect;

  function enterPortfolio() {
    /*
      This prevents the timeout, button and keyboard controls from
      triggering multiple redirects.
    */

    if (hasStartedLeaving) {
      return;
    }

    hasStartedLeaving = true;

    window.clearTimeout(
      automaticRedirect
    );

    if (redirectMessage) {
      redirectMessage.textContent =
        "Entering portfolio";
    }

    if (skipButton) {
      skipButton.disabled = true;
    }

    if (introPage) {
      introPage.classList.add(
        "is-leaving"
      );
    }

    window.setTimeout(() => {
      /*
        The query parameter tells index.html not to redirect back
        to the introduction.
      */

      window.location.replace(
        "index.html?intro=finished"
      );
    }, EXIT_DURATION);
  }

  /*
    Automatically continue after six seconds.
  */

  automaticRedirect =
    window.setTimeout(
      enterPortfolio,
      INTRO_DURATION
    );

  /*
    Skip button.
  */

  if (skipButton) {
    skipButton.addEventListener(
      "click",
      enterPortfolio
    );
  }

  /*
    Keyboard controls.
  */

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Enter" ||
        event.key === "Escape" ||
        event.key === " "
      ) {
        enterPortfolio();
      }
    }
  );
});