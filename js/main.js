document.addEventListener('DOMContentLoaded', (event) => {
    // Function to handle button click for navigation
    const navigateToPage = (url) => {
        window.location.href = url;
    };

    // Attach event listener to Proceed Now button
    const proceedButton = document.querySelector('button[onclick*="user_login.html"]');
    if (proceedButton) {
        proceedButton.addEventListener('click', (event) => {
            navigateToPage('user_login.html');
        });
    }

    // Attach event listener to About Us button
    const aboutUsButton = document.querySelector('button[onclick*="about_us.html"]');
    if (aboutUsButton) {
        aboutUsButton.addEventListener('click', (event) => {
            navigateToPage('about_us.html');
        });
    }
});
