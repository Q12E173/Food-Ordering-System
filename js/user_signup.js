document.addEventListener('DOMContentLoaded', (event) => {
    const showSignUpSuccessPopup = () => {
        const popup = document.getElementById('signup-success-popup');
        if (popup) {
            popup.style.display = 'block';
        }
    };

    const redirectToLogin = () => {
        window.location.href = 'user_login.html';
    };

    // Attach the close event to the close button
    const closeButton = document.querySelector('.close-popup');
    if (closeButton) {
        closeButton.addEventListener('click', closeSignUpSuccessPopup);
    }

    // Attach the redirect event to the OK button
    const okButton = document.querySelector('.popup-content button');
    if (okButton) {
        okButton.addEventListener('click', closeSignUpSuccessPopup);
    }
});
