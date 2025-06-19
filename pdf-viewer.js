document.addEventListener('DOMContentLoaded', () => {
  const pdfData = JSON.parse(localStorage.getItem('selectedPdf') || '{}');
  const pdfViewer = document.getElementById('pdfViewer');
  const downloadBtn = document.getElementById('downloadBtn');
  const suggestedList = document.getElementById('suggestedList');

  // Show PDF (stub for now)
  if (pdfData.fileUrl) {
    pdfViewer.innerHTML = `<div style="height:500px;display:flex;align-items:center;justify-content:center;background:#e5e7eb;">PDF.js Viewer Here<br><small>(${pdfData.fileUrl})</small></div>`;
  } else {
    pdfViewer.innerHTML = '<p>PDF not found.</p>';
  }

  // Download logic
  downloadBtn.onclick = () => {
    let count = parseInt(localStorage.getItem('pdfDownloadCount') || '0', 10);
    count++;
    localStorage.setItem('pdfDownloadCount', count);
    if (count > 3 && !localStorage.getItem('userLoggedIn')) {
      // Show login modal
      window.showAuthModal && window.showAuthModal();
      return;
    }
    // Simulate download
    window.open(pdfData.fileUrl, '_blank');
  };

  // Merge uploaded PDFs for suggestions
  fetch('/src/data/pdfs.json')
    .then(res => res.json())
    .then(staticPdfs => {
      let uploads = JSON.parse(localStorage.getItem('uploadedPdfs') || '[]');
      let allPdfs = staticPdfs.concat(uploads);
      // Find current PDF (from localStorage)
      const pdfData = JSON.parse(localStorage.getItem('selectedPdf') || '{}');
      // Suggestions: same exam, not same subject/year
      const suggestions = allPdfs.filter(pdf =>
        pdf.exam === pdfData.exam && pdf.subject !== pdfData.subject
      ).slice(0, 5);
      suggestedList.innerHTML = '';
      suggestions.forEach(pdf => {
        const card = document.createElement('div');
        card.className = 'pdf-card';
        card.innerHTML = `
          <h4>${pdf.exam} - ${pdf.subject}</h4>
          <p>${pdf.board} | ${pdf.year}</p>
          <button class="view-btn">View PDF</button>
        `;
        card.querySelector('.view-btn').onclick = () => {
          localStorage.setItem('selectedPdf', JSON.stringify(pdf));
          window.location.reload();
        };
        suggestedList.appendChild(card);
      });
    });
}); 