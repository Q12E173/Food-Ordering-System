document.addEventListener('DOMContentLoaded', (event) => {
    // Function to handle button click for navigation
    const navigateToPage = (url) => {
        window.location.href = url;
    };

    // Attach event listeners to buttons
    const proceedButton = document.querySelector('button[onclick*="user_login.html"]');
    if (proceedButton) {
        proceedButton.addEventListener('click', () => {
            navigateToPage('user_login.html');
        });
    }

    const aboutUsButton = document.querySelector('button[onclick*="about_us.html"]');
    if (aboutUsButton) {
        aboutUsButton.addEventListener('click', () => {
            navigateToPage('about_us.html');
        });
    }

    // Show sign-up modal
    const showSignUpModal = () => {
        const modal = document.getElementById('signup-modal');
        if (modal) {
            modal.style.display = 'block';
        }
    };

    // Close sign-up modal
    const closeSignUpModal = () => {
        const modal = document.getElementById('signup-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    };

    // Attach event listener to sign-up link
    const signUpLink = document.querySelector('a[onclick*="showSignUpModal"]');
    if (signUpLink) {
        signUpLink.addEventListener('click', (event) => {
            event.preventDefault();
            showSignUpModal();
        });
    }

    // Attach event listener to close button in modal
    const closeModalButton = document.querySelector('.modal .close');
    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            closeSignUpModal();
        });
    }

    // Close modal when clicking outside of modal content
    window.onclick = function(event) {
        const modal = document.getElementById('signup-modal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});
