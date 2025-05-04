import jsPDF from 'jspdf';

export const generatePDF = (formData) => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(0, 51, 102);
  doc.text('User Information Form', 105, 15, { align: 'center' });
  
  // Add horizontal line
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.5);
  doc.line(20, 20, 190, 20);
  
  // Add form data with proper formatting
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  
  const startY = 30;
  const lineHeight = 10;
  
  // Format the date
  const dob = formData.dob ? new Date(formData.dob).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Not provided';
  
  // Add each field with labels and values
  const fields = [
    { label: 'Full Name:', value: formData.name },
    { label: 'Email:', value: formData.email },
    { label: 'Phone Number:', value: formData.phone },
    { label: 'Address:', value: formData.address },
    { label: 'Gender:', value: formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) },
    { label: 'Date of Birth:', value: dob }
  ];
  
  fields.forEach((field, index) => {
    const y = startY + (index * lineHeight);
    
    // Bold label
    doc.setFont(undefined, 'bold');
    doc.text(field.label, 20, y);
    
    // Regular value
    doc.setFont(undefined, 'normal');
    
    // Handle multi-line text for address
    if (field.label === 'Address:') {
      const splitAddress = doc.splitTextToSize(field.value, 130);
      doc.text(splitAddress, 60, y);
    } else {
      doc.text(field.value, 60, y);
    }
  });
  
  // Add footer
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on ${date}`, 105, 280, { align: 'center' });
  
  // Save the PDF
  doc.save('user_information.pdf');
};