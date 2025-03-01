<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js"></script>
const fileInput = document.getElementById('fileInput');
const documentViewer = document.getElementById('documentViewer');

fileInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file.type === 'application/pdf') {
        renderPDF(file);
    } else {
        alert('Unsupported file type. Please upload a PDF, DOCX, XLSX, or PPTX file.');
    }
});

function renderPDF(file) {
    const fileReader = new FileReader();
    fileReader.onload = function () {
        const typedArray = new Uint8Array(this.result);
        pdfjsLib.getDocument(typedArray).promise.then(pdf => {
            documentViewer.innerHTML = ''; // Clear previous content
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                pdf.getPage(pageNum).then(page => {
                    const canvas = document.createElement('canvas');
                    documentViewer.appendChild(canvas);
                    const context = canvas.getContext('2d');
                    const viewport = page.getViewport({ scale: 1.5 });
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    page.render({ canvasContext: context, viewport: viewport });
                });
            }
        });
    };
    fileReader.readAsArrayBuffer(file);
}
