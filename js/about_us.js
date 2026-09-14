document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.classList.add('animate__animated', 'animate__fadeInUp');
        card.style.animationDelay = `${index * 0.2}s`;
    });

    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach((member, index) => {
        member.classList.add('animate__animated', 'animate__fadeInUp');
        member.style.animationDelay = `${index * 0.2}s`;
    });
});
