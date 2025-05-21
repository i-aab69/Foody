document.addEventListener('DOMContentLoaded', () => {

    console.log("Okay, home_page1.js is loaded!");
    const links = document.querySelectorAll('a'); 

    links.forEach(link => {
        link.addEventListener('click', (event) => {
            if (link.getAttribute('href') === '#') {
                event.preventDefault();
            }
    }) })


});