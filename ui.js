// UI helpers (stub)
document.addEventListener('DOMContentLoaded', () => {
  // Fade-in animation for cards
  document.querySelectorAll('.pdf-card, .category-card').forEach(card => {
    card.style.opacity = 0;
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s';
      card.style.opacity = 1;
    }, 100);
  });
}); 