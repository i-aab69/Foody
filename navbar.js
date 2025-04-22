// Wait for the HTML document to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    console.log("navbar.js loaded!"); // Updated log message

    // --- Elements Selection for Navbar and Modals ---
    const navLinks = document.querySelectorAll('.navigation_bar .nav-link');
    const modalOverlay = document.getElementById('modal-overlay');
    const allModals = document.querySelectorAll('.modal');
    const allCloseButtons = document.querySelectorAll('.modal-close-button');

    // --- Modal Helper Functions ---
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

    // --- Core Navbar Click Handling ---
    function handleNavClick(event) {
        const clickedLink = event.target.closest('.nav-link'); // Find the parent <a> tag
        if (!clickedLink) return;

        const targetModal = clickedLink.dataset.targetModal;
        const targetAction = clickedLink.dataset.targetAction;

        // Check if the link is intended to open a modal
        if (targetModal) {
             event.preventDefault(); // Prevent the default '#' link behavior
             openModal(targetModal);
        }
        // Check if the link has a specific action (like search simulation)
        else if (targetAction === 'search') {
             event.preventDefault(); // Prevent the default '#' link behavior
             console.log(`Simulating action: ${targetAction}`);
             // Replace alert with actual navigation if search.html is ready
             // window.location.href = 'search.html';
             // alert(`Simulating action: Open Search interface (navbar.js)`); // Keep or remove alert
             // Let's navigate directly now:
             window.location.href = 'search.html';
        }
        // Handle other '#' links if needed, or just let them be (or prevent default)
        else if (clickedLink.getAttribute('href') === '#') {
            // Optionally prevent default for all '#' links if they shouldn't jump to top
             event.preventDefault();
             console.log("Placeholder navigation link clicked:", clickedLink);
             // You could add alerts here for Favorites etc. if desired
             // alert("Simulating navigation to [Page Name]");
        }
        // Allow regular navigation for links with actual URLs (like home.html, etc.)
        // No else block needed here, default browser behavior handles it.
    }

    // --- Event Listeners ---

    // Modals: Close buttons and overlay click
    allCloseButtons.forEach(button => button.addEventListener('click', closeModal));
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    } else {
        console.error("Modal overlay element not found for event listener.")
    }


    // Navigation Links
    navLinks.forEach(link => link.addEventListener('click', handleNavClick));

}); // End of DOMContentLoaded