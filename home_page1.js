document.addEventListener('DOMContentLoaded', () => {

    console.log("Okay, home_page1.js is loaded!");

    const heroSection = document.querySelector('.hero-section');
    const ctaButton = document.querySelector('.cta-button');
    const welcomeSection = document.querySelector('.welcome-section');

    if (ctaButton) {
        ctaButton.addEventListener('click', (event) => {
            if (ctaButton.getAttribute('href') === '#') {
                event.preventDefault();
            }
            console.log('Hero button got clicked!');
        });
    }

    if (welcomeSection) {
        console.log("Found the welcome section!");
    }

});