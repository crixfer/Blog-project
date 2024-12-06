// Active Underscore code!!! ------------------------>
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("nav a"); // Select all nav links
  const currentUrl = window.location.href; // Get the current full URL

  links.forEach((link) => {
    if (link.href === currentUrl) {
      // Compare link href with current URL
      link.classList.add("active"); // Add the active class
    }
  });
});
