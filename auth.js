const AUTHOR_EMAILS = [
  'samadus2005@gmail.com',
  'abduspnhs2005@gmail.com'
];

// Simple modal logic
function showAuthModal() {
  const modal = document.getElementById('authModal');
  modal.innerHTML = `
    <div class="modal-content" style="background:#fff;padding:2rem 2.5rem;border-radius:10px;min-width:300px;max-width:90vw;box-shadow:0 2px 16px rgba(0,0,0,0.13);">
      <h2 style="margin-bottom:1rem;">Login / Sign Up</h2>
      <form id="authForm">
        <input type="text" id="authName" placeholder="Name" required style="width:100%;margin-bottom:0.7rem;padding:0.6rem;" />
        <input type="email" id="authEmail" placeholder="Email" required style="width:100%;margin-bottom:0.7rem;padding:0.6rem;" />
        <input type="password" id="authPassword" placeholder="Password" required style="width:100%;margin-bottom:1rem;padding:0.6rem;" />
        <button type="submit" style="width:100%;background:#2563eb;color:#fff;padding:0.7rem 0;border:none;border-radius:5px;font-size:1.1rem;">Continue</button>
      </form>
      <button id="closeModalBtn" style="margin-top:1rem;background:none;border:none;color:#2563eb;font-size:1rem;cursor:pointer;">Close</button>
    </div>
  `;
  modal.classList.remove('hidden');
  document.getElementById('closeModalBtn').onclick = () => modal.classList.add('hidden');
  document.getElementById('authForm').onsubmit = e => {
    e.preventDefault();
    const name = document.getElementById('authName').value;
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    localStorage.setItem('userLoggedIn', '1');
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    // Author check
    if (AUTHOR_EMAILS.includes(email.trim().toLowerCase())) {
      localStorage.setItem('isAuthor', '1');
    } else {
      localStorage.setItem('isAuthor', '0');
    }
    modal.classList.add('hidden');
    alert('Login/Signup successful!');
    window.location.reload();
  };
}
window.showAuthModal = showAuthModal;
window.isAuthor = function() {
  return localStorage.getItem('isAuthor') === '1';
}

// Attach to nav buttons
window.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  if (loginBtn) loginBtn.onclick = showAuthModal;
  if (signupBtn) signupBtn.onclick = showAuthModal;
}); 