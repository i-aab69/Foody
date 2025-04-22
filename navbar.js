// Wait for the HTML document to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
    console.log("navbar.js loaded!");

    const navLinks = document.querySelectorAll('.navigation_bar .nav-link');
    const modalOverlay = document.getElementById('modal-overlay');
    const allModals = document.querySelectorAll('.modal');
    const allCloseButtons = document.querySelectorAll('.modal-close-button');

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal && modalOverlay) {
            modalOverlay.classList.remove('hidden');
            modal.classList.remove('hidden');
            console.log(`Modal opened: ${modalId}`);
        } else {
            console.error(`Modal with ID ${modalId} or overlay not found.`);
        }
    }

    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.add('hidden');
        }
        allModals.forEach(modal => modal.classList.add('hidden'));
        console.log("All modals closed.");
    }

    function handleNavClick(event) {
        const clickedLink = event.target.closest('.nav-link');
        if (!clickedLink) return;

        const targetModal = clickedLink.dataset.targetModal;
        const targetAction = clickedLink.dataset.targetAction;
        const hrefValue = clickedLink.getAttribute('href');

        if (hrefValue && hrefValue !== '#' && !targetModal && !targetAction) {
            console.log(`Allowing default navigation to: ${hrefValue}`);
            return;
        }

        event.preventDefault();

        if (targetModal) {
            openModal(targetModal);
        } else if (targetAction === 'search') {
            console.log(`Simulating action: ${targetAction}`);
            window.location.href = 'search.html';
        } else if (hrefValue === '#') {
            console.log("Placeholder navigation link clicked:", clickedLink);
        }
    }

    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        console.log(`Current path: ${currentPath}`);

        const allNavLinks = document.querySelectorAll('.navigation_bar .nav-link');

        allNavLinks.forEach(link => {
            if (link.href) {
                try {
                    const linkUrl = new URL(link.href);
                    const linkPath = linkUrl.pathname;
                    const navIcon = link.querySelector('.nav-icon');

                    if (navIcon) {
                        navIcon.classList.remove('active-nav-icon');
                        if (linkPath === currentPath) {
                            navIcon.classList.add('active-nav-icon');
                        }
                    }
                } catch (e) {
                    console.warn(`Could not parse URL for link: ${link.href}`, e);
                }
            }
        });

        if (currentPath === '/' || currentPath.endsWith('/index.html') || currentPath.endsWith('/home_page1.html')) {
            const homeLinkIcon = document.querySelector('.navigation_bar a[href="home_page1.html"] .nav-icon');
            const altHomeLinkIcon = document.querySelector('.navigation_bar a[href="home.html"] .nav-icon');

            if (currentPath.endsWith('/home.html') && altHomeLinkIcon) {
                altHomeLinkIcon.classList.add('active-nav-icon');
            } else if (homeLinkIcon) {
                homeLinkIcon.classList.add('active-nav-icon');
            } else if (altHomeLinkIcon) {
                altHomeLinkIcon.classList.add('active-nav-icon');
            }
        }
    }

    allCloseButtons.forEach(button => button.addEventListener('click', closeModal));
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    } else {
        console.warn("Modal overlay element not found for event listener.");
    }

    navLinks.forEach(link => link.addEventListener('click', handleNavClick));

    setActiveNavLink();
});