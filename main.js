document.addEventListener('DOMContentLoaded', () => {
  const pdfList = document.getElementById('pdfList');
  const searchInput = document.getElementById('searchInput');
  let allPdfs = [];
  let filteredPdfs = [];

  // Load PDFs from JSON
  fetch('/src/data/pdfs.json')
    .then(res => res.json())
    .then(data => {
      allPdfs = data;
      filteredPdfs = allPdfs;
      renderPdfCards(filteredPdfs);
    });

  // Category card click
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.category;
      let filterFn;
      if (cat === 'school') filterFn = pdf => pdf.exam.startsWith('Class');
      else if (cat === 'competitive') filterFn = pdf => ['NEET','JEE Mains','JEE Advanced','UPSC','SSC','CUET'].includes(pdf.exam);
      else filterFn = pdf => !pdf.exam.startsWith('Class') && !['NEET','JEE Mains','JEE Advanced','UPSC','SSC','CUET'].includes(pdf.exam);
      filteredPdfs = allPdfs.filter(filterFn);
      renderPdfCards(filteredPdfs);
    });
  });

  // Instant search
  searchInput.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    filteredPdfs = allPdfs.filter(pdf =>
      (pdf.exam + ' ' + pdf.board + ' ' + pdf.subject + ' ' + pdf.year).toLowerCase().includes(q)
    );
    renderPdfCards(filteredPdfs);
  });

  // Render PDF cards
  function renderPdfCards(pdfs) {
    pdfList.innerHTML = '';
    if (!pdfs.length) {
      pdfList.innerHTML = '<p>No PDFs found.</p>';
      return;
    }
    pdfs.forEach(pdf => {
      const card = document.createElement('div');
      card.className = 'pdf-card';
      card.innerHTML = `
        <h4>${pdf.exam} - ${pdf.subject}</h4>
        <p>${pdf.board} | ${pdf.year}</p>
        <button class="view-btn">View PDF</button>
      `;
      card.querySelector('.view-btn').onclick = () => {
        localStorage.setItem('selectedPdf', JSON.stringify(pdf));
        window.location.href = '/public/pdf-viewer.html';
      };
      pdfList.appendChild(card);
    });
  }

  // Author emails
  const AUTHOR_EMAILS = ['samadus2005@gmail.com', 'abduspnhs2005@gmail.com'];

  function isAuthor() {
    return AUTHOR_EMAILS.includes(localStorage.getItem('userEmail'));
  }

  function showAuthorButtons() {
    if (isAuthor()) {
      document.getElementById('uploadBtn').style.display = '';
      document.getElementById('myUploadsBtn').style.display = '';
    }
  }

  window.addEventListener('DOMContentLoaded', showAuthorButtons);

  // Upload PDF Modal
  function showUploadModal() {
    const modal = document.getElementById('authModal');
    modal.innerHTML = `
      <div class="modal-content" style="background:#fff;padding:2rem 2.5rem;border-radius:10px;min-width:300px;max-width:90vw;box-shadow:0 2px 16px rgba(0,0,0,0.13);">
        <h2 style="margin-bottom:1rem;">Upload PDF</h2>
        <form id="uploadForm">
          <input type="text" id="upExam" placeholder="Exam (e.g. Class 10)" required style="width:100%;margin-bottom:0.7rem;padding:0.6rem;" />
          <input type="text" id="upBoard" placeholder="Board (e.g. CBSE)" required style="width:100%;margin-bottom:0.7rem;padding:0.6rem;" />
          <input type="text" id="upSubject" placeholder="Subject (e.g. Maths)" required style="width:100%;margin-bottom:0.7rem;padding:0.6rem;" />
          <input type="text" id="upYear" placeholder="Year (e.g. 2023)" required style="width:100%;margin-bottom:0.7rem;padding:0.6rem;" />
          <input type="file" id="upFile" accept="application/pdf" required style="width:100%;margin-bottom:1rem;" />
          <button type="submit" style="width:100%;background:#2563eb;color:#fff;padding:0.7rem 0;border:none;border-radius:5px;font-size:1.1rem;">Upload</button>
        </form>
        <button id="closeModalBtn" style="margin-top:1rem;background:none;border:none;color:#2563eb;font-size:1rem;cursor:pointer;">Close</button>
      </div>
    `;
    modal.classList.remove('hidden');
    document.getElementById('closeModalBtn').onclick = () => modal.classList.add('hidden');
    document.getElementById('uploadForm').onsubmit = e => {
      e.preventDefault();
      const exam = document.getElementById('upExam').value;
      const board = document.getElementById('upBoard').value;
      const subject = document.getElementById('upSubject').value;
      const year = document.getElementById('upYear').value;
      const file = document.getElementById('upFile').files[0];
      if (!file) return alert('Please select a PDF file.');
      // For demo, use a fake URL (real upload needs backend)
      const fileUrl = URL.createObjectURL(file);
      const pdf = { exam, board, subject, year, fileUrl, uploadedBy: localStorage.getItem('userEmail') };
      let uploads = JSON.parse(localStorage.getItem('uploadedPdfs') || '[]');
      uploads.push(pdf);
      localStorage.setItem('uploadedPdfs', JSON.stringify(uploads));
      modal.classList.add('hidden');
      alert('PDF uploaded!');
      loadAndRenderPdfs();
    };
  }

  // My Uploads Modal
  function showMyUploadsModal() {
    const modal = document.getElementById('authModal');
    let uploads = JSON.parse(localStorage.getItem('uploadedPdfs') || '[]');
    uploads = uploads.filter(u => u.uploadedBy === localStorage.getItem('userEmail'));
    modal.innerHTML = `
      <div class="modal-content" style="background:#fff;padding:2rem 2.5rem;border-radius:10px;min-width:300px;max-width:90vw;box-shadow:0 2px 16px rgba(0,0,0,0.13);max-height:80vh;overflow:auto;">
        <h2 style="margin-bottom:1rem;">My Uploads</h2>
        <div id="myUploadsList"></div>
        <button id="closeModalBtn" style="margin-top:1rem;background:none;border:none;color:#2563eb;font-size:1rem;cursor:pointer;">Close</button>
      </div>
    `;
    modal.classList.remove('hidden');
    document.getElementById('closeModalBtn').onclick = () => modal.classList.add('hidden');
    const list = modal.querySelector('#myUploadsList');
    if (!uploads.length) {
      list.innerHTML = '<p>No uploads yet.</p>';
      return;
    }
    uploads.forEach((pdf, idx) => {
      const div = document.createElement('div');
      div.style.marginBottom = '1rem';
      div.innerHTML = `<b>${pdf.exam} - ${pdf.subject}</b> (${pdf.year}, ${pdf.board})<br><button data-idx="${idx}" class="editBtn">Edit</button> <button data-idx="${idx}" class="deleteBtn">Delete</button>`;
      list.appendChild(div);
    });
    // Delete logic
    list.querySelectorAll('.deleteBtn').forEach(btn => {
      btn.onclick = () => {
        let uploads = JSON.parse(localStorage.getItem('uploadedPdfs') || '[]');
        uploads = uploads.filter((u, i) => !(u.uploadedBy === localStorage.getItem('userEmail') && i === parseInt(btn.dataset.idx)));
        localStorage.setItem('uploadedPdfs', JSON.stringify(uploads));
        showMyUploadsModal();
        loadAndRenderPdfs();
      };
    });
    // Edit logic (for demo, just alert)
    list.querySelectorAll('.editBtn').forEach(btn => {
      btn.onclick = () => alert('Edit feature can be added here.');
    });
  }

  // Attach events
  window.addEventListener('DOMContentLoaded', () => {
    const uploadBtn = document.getElementById('uploadBtn');
    const myUploadsBtn = document.getElementById('myUploadsBtn');
    if (uploadBtn) uploadBtn.onclick = showUploadModal;
    if (myUploadsBtn) myUploadsBtn.onclick = showMyUploadsModal;
  });

  // Merge uploaded PDFs with static JSON
  function loadAndRenderPdfs() {
    fetch('/src/data/pdfs.json')
      .then(res => res.json())
      .then(data => {
        let uploads = JSON.parse(localStorage.getItem('uploadedPdfs') || '[]');
        allPdfs = data.concat(uploads);
        filteredPdfs = allPdfs;
        renderPdfCards(filteredPdfs);
      });
  }
}); 