// profile_page.js - Handles User and Admin profile display and editing

document.addEventListener('DOMContentLoaded', () => {
    // Check auth status first
    const loggedInUser = localStorage.getItem('LoggedUser');
    if (!loggedInUser) {
        console.error("No logged in user found!");
        alert("Please login to access your profile.");
        window.location.href = 'sing_up.html';
        return;
    }
    
    // Check dependencies
    if (typeof getUserProfile !== 'function' || typeof saveUserProfile !== 'function' ||
        typeof getUserRole !== 'function' || typeof clearUserRole !== 'function' ||
        typeof clearUserProfile !== 'function') {
        console.error("storageManager.js functions not loaded before profile_page.js!");
        alert("Profile page cannot function correctly. Please refresh the page.");
        return;
    }

    // --- Get Elements ---
    const mainContent = document.querySelector('.profile-main-content');
    const logoutBtn = document.getElementById('logout-btn');
    const userRole = getUserRole();

    // --- User Profile Elements ---
    const userProfileSection = document.querySelector('.user-profile-section');
    const profileDetailsContainer = document.querySelector('.user-profile-section .profile-details');
    const usernameDisplay = document.getElementById('profile-username-display');
    const emailDisplay = document.getElementById('profile-email-display');
    const phoneDisplay = document.getElementById('profile-phone-display');
    const bioDisplay = document.getElementById('profile-bio-display');
    const profilePicImg = document.getElementById('profile-pic-img');
    const editPhoneInput = document.getElementById('edit-phone');
    const editBioTextarea = document.getElementById('edit-bio');
    const editPictureInput = document.getElementById('edit-picture-input');
    const editPictureOverlay = document.querySelector('.user-profile-section .edit-picture-overlay');
    const editBtn = document.getElementById('edit-profile-btn');
    const saveBtn = document.getElementById('save-profile-btn');
    const cancelBtn = document.getElementById('cancel-edit-btn');

    // --- Admin Dashboard Elements ---
    const adminDashboardSection = document.querySelector('.admin-dashboard-section');
    const adminUsernameSpan = document.getElementById('admin-username');
    const adminStatsContainer = document.getElementById('admin-stats-container');

    let currentProfileData = null; // Store loaded data for user profile edits
    let newPictureDataUrl = null; // Store temp picture data for user profile edits

    // --- Core Functions ---

    function setupPageView(role) {
        console.log("Setting up profile page for role:", role);
        if (!mainContent) {
            console.error("Main content container not found!");
            return;
        }
        
        currentProfileData = getUserProfile(); // Load profile data
        console.log("Loaded profile data:", currentProfileData);
        
        if (!currentProfileData) {
            console.error("Failed to load profile data!");
            alert("Unable to load your profile. Please try logging in again.");
            logoutUser();
            return;
        }

        // Add role-specific class to the main container for CSS targeting
        if (role === 'User') {
            mainContent.classList.remove('admin-view-active');
            mainContent.classList.add('user-view-active');
            if (userProfileSection) {
                userProfileSection.style.display = 'block'; // Ensure user section is visible
                loadUserProfileDisplay(); // Populate user fields
                setupUserProfileEventListeners(); // Activate editing listeners
            }
            if (adminDashboardSection) adminDashboardSection.style.display = 'none'; // Hide admin section

        } else if (role === 'Admin') {
            mainContent.classList.remove('user-view-active');
            mainContent.classList.add('admin-view-active');
            if (adminDashboardSection) {
                adminDashboardSection.style.display = 'block'; // Ensure admin section is visible
                loadAdminDashboardDisplay(); // Populate admin fields
            }
            if (userProfileSection) userProfileSection.style.display = 'block'; // Show user section for admins too
            loadUserProfileDisplay(); // Populate user fields for admin
            setupUserProfileEventListeners(); // Activate editing listeners

        } else {
            // Not logged in or unknown role
            mainContent.classList.remove('user-view-active', 'admin-view-active');
            console.log("Profile Page: No valid role found.");
            if(userProfileSection) userProfileSection.style.display = 'none';
            if(adminDashboardSection) adminDashboardSection.style.display = 'none';
            // Hide logout button if not logged in
            if(logoutBtn) logoutBtn.style.display = 'none';
        }
        // Setup common elements like logout (ensure it's visible if logged in)
        if (role === 'User' || role === 'Admin') {
            setupCommonEventListeners();
            if (logoutBtn) logoutBtn.style.display = 'inline-block'; // Show logout
        }
    }

    // --- User Profile Functions ---

    function loadUserProfileDisplay() {
        if (!currentProfileData) { 
            console.error("User profile data not loaded."); 
            return; 
        }
        
        console.log("Loading user profile display:", currentProfileData);
        
        if (usernameDisplay) usernameDisplay.textContent = currentProfileData.username || 'N/A';
        if (emailDisplay) emailDisplay.textContent = currentProfileData.email || 'N/A';
        if (phoneDisplay) phoneDisplay.textContent = currentProfileData.phone || 'N/A';
        if (bioDisplay) bioDisplay.textContent = currentProfileData.about || 'Add a bio...';
        
        if (profilePicImg) {
            profilePicImg.src = currentProfileData.picture || 'source/placeholder_profile.png';
            profilePicImg.onerror = function() {
                this.src = 'source/placeholder_profile.png';
            };
        }
        
        newPictureDataUrl = currentProfileData.picture;
        
        if (editPictureInput) editPictureInput.value = null;
        switchToViewMode();
    }
    
    function switchToEditMode() {
        if (!profileDetailsContainer || !currentProfileData) return;
        
        if (editPhoneInput) {
            editPhoneInput.value = (currentProfileData.phone && currentProfileData.phone !== 'N/A') ? 
                currentProfileData.phone : '';
        }
        
        if (editBioTextarea) {
            editBioTextarea.value = (currentProfileData.about && currentProfileData.about !== 'Add a bio...') ? 
                currentProfileData.about : '';
        }
        
        newPictureDataUrl = currentProfileData.picture;
        profileDetailsContainer.classList.remove('view-mode');
        profileDetailsContainer.classList.add('edit-mode');
        
        if (editPictureOverlay) {
            editPictureOverlay.style.opacity = '1';
            editPictureOverlay.style.pointerEvents = 'auto';
        }
    }
    
    function switchToViewMode() {
        if (!profileDetailsContainer) return;
        profileDetailsContainer.classList.remove('edit-mode');
        profileDetailsContainer.classList.add('view-mode');
        
        if (editPictureOverlay) {
            editPictureOverlay.style.opacity = '0';
            editPictureOverlay.style.pointerEvents = 'none';
        }
    }
    
    function saveUserChanges() {
        if (!currentProfileData) {
            console.error("Cannot save, current profile data not loaded.");
            return;
        }
        
        const dataToUpdate = {
            phone: editPhoneInput ? editPhoneInput.value.trim() : undefined,
            about: editBioTextarea ? editBioTextarea.value.trim() : undefined,
            picture: newPictureDataUrl
        };
        
        // Remove undefined values
        Object.keys(dataToUpdate).forEach(key => 
            dataToUpdate[key] === undefined && delete dataToUpdate[key]
        );
        
        console.log("Saving profile updates:", dataToUpdate);
        const success = saveUserProfile(dataToUpdate);
        
        if (success) {
            // Refresh data and display
            currentProfileData = getUserProfile();
            loadUserProfileDisplay();
            alert("Profile updated successfully!");
        } else {
            alert("Failed to update profile. Please try again.");
        }
    }
    
    function handlePictureChange(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (profilePicImg) profilePicImg.src = e.target.result;
                newPictureDataUrl = e.target.result;
                console.log("Image preview updated.");
            };
            reader.onerror = (e) => {
                console.error("File reading error:", e);
                alert("Error reading file.");
            };
            reader.readAsDataURL(file);
        } else if (file) {
            alert("Please select a valid image file.");
            if (editPictureInput) editPictureInput.value = null;
        }
    }
    
    function setupUserProfileEventListeners() {
        if (editBtn) {
            editBtn.addEventListener('click', switchToEditMode);
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', saveUserChanges);
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', loadUserProfileDisplay);
        }
        
        if (editPictureOverlay) {
            editPictureOverlay.addEventListener('click', () => {
                if (profileDetailsContainer && profileDetailsContainer.classList.contains('edit-mode')) {
                    if (editPictureInput) editPictureInput.click();
                }
            });
        }
        
        if (editPictureInput) {
            editPictureInput.addEventListener('change', handlePictureChange);
        }
    }

    // --- Admin Dashboard Functions ---

    function loadAdminDashboardDisplay() {
        if (!currentProfileData) {
            console.error("Admin profile data not loaded.");
            return;
        }
        
        console.log("Loading admin dashboard display:", currentProfileData);
        
        if (adminUsernameSpan) {
            adminUsernameSpan.textContent = currentProfileData.username || 'Admin';
        }
        
        // Stats would typically be loaded from server data
        // For this implementation, we're using static sample data
        
        if (adminStatsContainer) {
            adminStatsContainer.style.display = 'grid'; // Ensure visible
        }
    }

    // --- Common Functions ---

    function logoutUser() {
        console.log("Logout initiated.");
        clearUserRole();
        alert("You have been logged out.");
        window.location.href = 'sing_up.html';
    }

    function setupCommonEventListeners() {
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logoutUser);
        }
    }

    // --- Initial Setup ---
    console.log("Initializing profile page");
    setupPageView(userRole);

}); // End DOMContentLoaded