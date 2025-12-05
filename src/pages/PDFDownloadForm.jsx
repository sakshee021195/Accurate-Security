import { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import "../fonts/NotoSansDevanagari.js";

import './PDFDownloadForm.css';

const PDFDownloadForm = ({ formData, photo, logo }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const generatePDF = () => {
        setIsGenerating(true);
        setStatusMessage('');
        
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            let yPos = 20;

            // Helper function to check if we need a new page
            const checkPageBreak = (requiredSpace = 10) => {
                if (yPos + requiredSpace > pageHeight - 20) {
                    doc.addPage();
                    yPos = 20;
                    return true;
                }
                return false;
            };

            // Add logo and header
            if (logo) {
                try {
                    doc.addImage(logo, 'PNG', 15, yPos, 30, 30);
                } catch (e) {
                    console.log('Logo not added:', e);
                }
            }
            
            // Company Header
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('ACCURATE SECURITY & ALLIED SERVICES', pageWidth / 2, yPos + 5, { align: 'center' });
            
            doc.setFontSize(12);
            doc.text('ENROLMENT FORM', pageWidth / 2, yPos + 12, { align: 'center' });
            
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text('47, CITY CENTRE, NR. SWASTIK CROSS ROAD, C.G. ROAD, NAVRANGPURA,', pageWidth / 2, yPos + 18, { align: 'center' });
            doc.text('AHMEDABAD – 380009', pageWidth / 2, yPos + 22, { align: 'center' });
            doc.text('MOB: 8160880528 | EMAIL: accurate.adi@gmail.com | www.accuratesecurity.in', pageWidth / 2, yPos + 26, { align: 'center' });
            
            yPos += 45;

            // Add passport photo if available
            if (photo) {
                try {
                    const photoX = pageWidth - 40;
                    const photoY = 55;
                    
                    // Add photo label first
                    doc.setFontSize(8);
                    doc.setFont('helvetica', 'bold');
                    doc.text("Passport Photo", photoX + 12.5, photoY, { align: "center" });
                    
                    // Add photo below label
                    doc.addImage(photo, 'JPEG', photoX, photoY + 3, 25, 25);
                } catch (e) {
                    console.log('Photo not added:', e);
                }
            }

            // Date, Unit Name, Designation section
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            
            doc.text(`Date: ${'_'.repeat(20)}`, 15, yPos);
            yPos += 8;
            doc.text(`Name of Unit: ${'_'.repeat(30)}`, 15, yPos);
            yPos += 8;
            doc.text(`Designation Applied For: ${'_'.repeat(25)}`, 15, yPos);
            yPos += 12;

            // PERSONNEL DETAILS Section
            checkPageBreak(60);
            doc.setFillColor(200, 200, 200);
            doc.rect(15, yPos - 2, pageWidth - 30, 7, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.text('PERSONNEL DETAILS', 17, yPos + 3);
            yPos += 10;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);

            // Full Name
            doc.text(`Full Name: ${formData.fullName || ''}`, 15, yPos);
            yPos += 8;

            // Mother's and Father's Name
            doc.text(`Mother's Name: ${formData.motherName || ''}`, 15, yPos);
            doc.text(`Father's Name: ${formData.fatherName || ''}`, 110, yPos);
            yPos += 8;

            // Present Address
            checkPageBreak(20);
            doc.text('Present Address:', 15, yPos);
            yPos += 5;
            doc.setFontSize(8);
            const presentAddr = `${formData.presentAddress || 'N/A'}`;
            const presentAddr2 = `${formData.presentAddressLine2 || ''}`;
            doc.text(presentAddr, 15, yPos);
            yPos += 4;
            if (presentAddr2) {
                doc.text(presentAddr2, 15, yPos);
                yPos += 4;
            }
            doc.setFontSize(9);
            doc.text(`Police Station: ${formData.presentPoliceStation || ''}`, 15, yPos);
            yPos += 8;

            // Permanent Address
            checkPageBreak(20);
            doc.text('Permanent Address:', 15, yPos);
            yPos += 5;
            doc.setFontSize(8);
            const permAddr = `${formData.permanentAddress || 'N/A'}`;
            const permAddr2 = `${formData.permanentAddressLine2 || ''}`;
            doc.text(permAddr, 15, yPos);
            yPos += 4;
            if (permAddr2) {
                doc.text(permAddr2, 15, yPos);
                yPos += 4;
            }
            doc.setFontSize(9);
            doc.text(`Police Station: ${formData.permanentPoliceStation || ''}`, 15, yPos);
            yPos += 8;

            // Mobile Numbers
            doc.text(`Mobile No. (1): ${formData.mobile1 || ''}`, 15, yPos);
            doc.text(`Mobile No. (2): ${formData.mobile2 || ''}`, 110, yPos);
            yPos += 8;

            // Physical Details
            doc.text(`Height: ${formData.height || ''} cm`, 15, yPos);
            doc.text(`Weight: ${formData.weight || ''} kg`, 70, yPos);
            doc.text(`Chest: ${formData.chest || ''} cm`, 125, yPos);
            yPos += 8;

            // Education and ID Mark
            doc.text(`Education Qualification: ${formData.education || ''}`, 15, yPos);
            yPos += 8;
            doc.text(`Identification Mark: ${formData.idMark || ''}`, 15, yPos);
            yPos += 8;

            // DOB, Age, Marital Status
            doc.text(`Date of Birth: ${formData.dob || ''}`, 15, yPos);
            doc.text(`Age: ${formData.age || ''}`, 80, yPos);
            doc.text(`Marital Status: ${formData.maritalStatus || ''}`, 125, yPos);
            yPos += 8;

            // Aadhar and Voter ID
            doc.text(`Aadhar No.: ${formData.aadharNo || ''}`, 15, yPos);
            doc.text(`Voter ID/DL No.: ${formData.voterId || ''}`, 110, yPos);
            yPos += 8;
            
            // Bank Details
            doc.text(`Bank Name: ${formData.bankName || ''}`, 15, yPos);
            yPos += 8;
            doc.text(`Bank Account No.: ${formData.bankAccountNo || ''}`, 15, yPos);
            doc.text(`IFSC Code: ${formData.ifscCode || ''}`, 110, yPos);
            yPos += 12;

            // PREVIOUS SERVICES DETAILS Section
            checkPageBreak(40);
            doc.setFillColor(200, 200, 200);
            doc.rect(15, yPos - 2, pageWidth - 30, 7, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.text('PREVIOUS SERVICES DETAILS', 17, yPos + 3);
            yPos += 10;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);

            doc.text(`UAN No.: ${formData.uan || ''}`, 15, yPos);
            doc.text(`ESIC (IP) No.: ${formData.esic || ''}`, 110, yPos);
            yPos += 8;

            doc.text(`Name of Company: ${formData.prevCompany || ''}`, 15, yPos);
            yPos += 8;
            doc.text(`Designation: ${formData.prevDesignation || ''}`, 15, yPos);
            yPos += 8;
            doc.text(`From: ${formData.fromDate || ''}`, 15, yPos);
            doc.text(`To: ${formData.toDate || ''}`, 80, yPos);
            yPos += 12;

            // FAMILY DETAILS Section
            checkPageBreak(30);
            doc.setFillColor(200, 200, 200);
            doc.rect(15, yPos - 2, pageWidth - 30, 7, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.text('FAMILY DETAILS', 17, yPos + 3);
            yPos += 10;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);

            doc.text(`Spouse Name: ${formData.spouseName || ''}`, 15, yPos);
            doc.text(`DOB: ${formData.spouseDob || ''}`, 110, yPos);
            yPos += 8;
            doc.text(`Children: ${formData.child1 || ''}${formData.child2 ? ', ' + formData.child2 : ''}`, 15, yPos);
            yPos += 12;

            // EMERGENCY CONTACT DETAILS Section
            checkPageBreak(20);
            doc.setFillColor(200, 200, 200);
            doc.rect(15, yPos - 2, pageWidth - 30, 7, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.text('EMERGENCY CONTACT DETAILS', 17, yPos + 3);
            yPos += 10;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);

            doc.text(`Name with Relation: ${formData.emergencyContactName || ''}`, 15, yPos);
            yPos += 8;
            doc.text(`Mobile No.: ${formData.emergencyContactMobile || ''}`, 15, yPos);
            yPos += 15;

            // Terms and Conditions Section
            checkPageBreak(40);
            doc.setFillColor(200, 200, 200);
            doc.rect(15, yPos - 2, pageWidth - 30, 7, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.text('GENERAL TERMS & CONDITIONS', pageWidth / 2, yPos + 3, { align: 'center' });
            yPos += 10;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            
            const terms = [
                "1. Your duties and scope of services/work will be explained to you by the company, however the company reserves the right to make any changes",
                "   in the nature of work and scope of services from time to time.",
                "",
                "2. Government liabilities/taxes/compliance are subject to prevailing law.",
                "",
                "3. You must always follow the dress code directed by the company/client. You must join your duty only by wearing polished shoes and clean dress.",
                "",
                "4. You will be responsible for the security of all company/client property in your possession.",
                "",
                "5. You must submit all relevant documents required for your offer letter or appointment. Without submitting documents, your appointment will not",
                "   be confirmed. Before appointment, you must submit your physical fitness certificate and police verification.",
                "",
                "6. You will neither engage in any criminal activities nor will you be involved with any other person inside or outside the organization in such",
                "   activities. If this happens, the company can terminate your services without giving any reason.",
                "",
                "7. Any complaints related to your job or work profile should be discussed immediately with the Operations Head/HR/Admin Department or any",
                "   other person authorized by the management.",
                "",
                "8. Before taking any leave, you must inform the Project Operations Head/HR/Admin Department in writing (with prior approval of your HOD).",
                "   In case of any emergency, information should be given to HOD and application should be submitted immediately upon return.",
                "",
                "9. You may be transferred to any project/operation/office of the company as per its contingency. You will be fully responsible for the work,",
                "   responsibilities and duties.",
                "",
                "10. During your service, you will maintain strict confidentiality on company matters and follow all rules and regulations.",
                "",
                "11. You will devote full time to the company's work and will not take any direct or indirect work or honorarium except with the prior permission",
                "    of the management.",
                "",
                "12. The company expects you to work in the section/department in which you have been placed with your initiative and efficiency.",
                "",
                "13. The company reserves the right to publish your photo in the newspaper along with the details of misconduct committed by you.",
                "",
                "14. The company reserves the right to distribute your photo and other details to all companies related to that area if you are found involved",
                "    in gross misconduct.",
                "",
                "15. You will be governed by and bound to follow the amended or changed rules and regulations applicable from time to time during your employment."
            ];

            terms.forEach(line => {
                checkPageBreak(5);
                doc.text(line, 17, yPos);
                yPos += 4;
            });
            
            yPos += 10;
            checkPageBreak(20);
            
            // Signature section
            doc.line(15, yPos, 80, yPos);
            doc.line(130, yPos, 195, yPos);
            yPos += 5;
            doc.text('Employee Signature', 15, yPos);
            doc.text('Authorized Signatory', 130, yPos);

            // Save the PDF
            doc.save(`Enrolment-Form-${formData.fullName || 'Employee'}.pdf`);
            
            // Success message
            setStatusMessage('PDF downloaded successfully!');
            setTimeout(() => setStatusMessage(''), 3000);
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            setStatusMessage('Failed to generate PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="pdf-download-wrapper">
            <button
                type="button"
                className="pdf-download-btn btn btn-primary"
                onClick={generatePDF}
                disabled={isGenerating}
            >
                {isGenerating ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Generating PDF...
                    </>
                ) : (
                    <>
                        <span>📄</span>
                        Download PDF
                    </>
                )}
            </button>
            
            {statusMessage && (
                <div className={`pdf-status-message ${statusMessage.includes('success') ? 'success' : 'error'}`}>
                    {statusMessage}
                </div>
            )}
        </div>
    );
};

export default PDFDownloadForm;