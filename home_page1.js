// Wait for the HTML document to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    console.log("home_page1.js loaded!");

    // --- Elements Selection for Home Page 1 ---
    const heroSection = document.querySelector('.hero-section');
    const ctaButton = document.querySelector('.cta-button');
    const welcomeSection = document.querySelector('.welcome-section');

    // --- Potential Interactions for Home Page 1 ---

    // Example: Add an event listener to the main Call-to-Action button
    if (ctaButton) {
        ctaButton.addEventListener('click', (event) => {
            // Prevent default if it's an anchor tag '#'
            if (ctaButton.getAttribute('href') === '#') {
                 event.preventDefault();
            }
            console.log('Hero CTA button clicked!');
            // You could add navigation logic here if it doesn't already go somewhere
            // Example: window.location.href = ctaButton.getAttribute('href');
            // alert('Exploring Recipes!'); // The alert is now commented out
        });
    }

    // Example: Add animations or interactions for the welcome section
    if (welcomeSection) {
        // Placeholder for potential animations on scroll, etc.
        console.log("Welcome section found. Ready for interactions.");
    }

    // Add any other JavaScript interactions specific to home_page1.html here.
    // For example, maybe animating elements in the hero section,
    // or interactions within the welcome text/image.

}); // End of DOMContentLoaded