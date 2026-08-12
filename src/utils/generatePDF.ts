import { jsPDF } from 'jspdf';
import { toJpeg } from 'html-to-image';

export const generateAssessmentPDF = async (elementId: string, companyName: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element for PDF not found');
    return;
  }

  try {
    // html-to-image maneja mucho mejor los SVGs (Recharts) que html2canvas
    const dataUrl = await toJpeg(element, { 
      quality: 0.95,
      backgroundColor: '#030712', // Color oscuro de fondo para que el texto blanco sea visible
      pixelRatio: 2 // Mayor resolución
    });
    


    // Create an image object to get original dimensions
    const img = new Image();
    img.src = dataUrl;
    
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    // Generate a single continuous PDF page with the exact dimensions of the image
    // This prevents ugly cuts in the middle of content
    const pdf = new jsPDF({
      orientation: img.width > img.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [img.width, img.height]
    });

    pdf.addImage(dataUrl, 'JPEG', 0, 0, img.width, img.height);

    const date = new Date().toISOString().split('T')[0];
    const safeCompanyName = companyName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    pdf.save(`Pegasus_Assessment_${safeCompanyName}_${date}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Hubo un error al generar el PDF. Por favor, inténtelo de nuevo.');
  }
};
