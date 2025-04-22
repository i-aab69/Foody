document.addEventListener('DOMContentLoaded', () => {
    console.log("home_page1.js loaded!");

    const heroSection = document.querySelector('.hero-section');
    const ctaButton = document.querySelector('.cta-button');
    const welcomeSection = document.querySelector('.welcome-section');

    if (ctaButton) {
        ctaButton.addEventListener('click', (event) => {
            if (ctaButton.getAttribute('href') === '#') {
                event.preventDefault();
            }
            console.log('Hero CTA button clicked!');
        });
    }

    if (welcomeSection) {
        console.log("Welcome section found. Ready for interactions.");
    }
});