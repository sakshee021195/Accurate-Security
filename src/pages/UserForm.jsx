import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { submitUserForm } from '../services/api';
import { generatePDF } from '../services/pdfService';
import logo from '../assets/Images/logo.png';
import './userForm.css';  // Import the external CSS file
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // If you're using tables (optional)
import axios from 'axios';


const initialValues = {
    date: '',
    unitName: '',
    designation: '',
    fullName: '',
    motherName: '',
    fatherName: '',
    presentAddress: '',
    presentAddressLine2: '',
    presentPoliceStation: '',
    permanentAddress: '',
    permanentAddressLine2: '',
    permanentPoliceStation: '',
    mobile1: '',
    mobile2: '',
    height: '',
    weight: '',
    chest: '',
    education: '',
    idMark: '',
    dob: '',
    age: '',
    maritalStatus: '',
    aadharNo: '',
    voterId: '',
    bankName: '',
    bankAccountNo: '',
    ifscCode: '',
    uan: '',
    esic: '',
    prevCompany: '',
    prevDesignation: '',
    fromDate: '',
    toDate: '',
    spouseName: '',
    spouseDob: '',
    child1: '',
    child2: '',
    emergencyContactName: '',
    emergencyContactMobile: ''
};

const validationSchema = Yup.object({
    // fullName: Yup.string().required('Full name is required'),
    // mobile1: Yup.string().matches(/^[0-9]{10}$/, 'Enter valid 10-digit number'),
    // dob: Yup.date().required('Date of birth is required'),
    // aadharNo: Yup.string().required('Aadhar number is required'),
    // bankAccountNo: Yup.string().required('Bank account number is required'),
    // ifscCode: Yup.string().required('IFSC code is required')
});

const UserForm = () => {
    const [message, setMessage] = useState('');
    const [photo, setPhoto] = useState(null);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log("Form submitted with values:", values);
        console.log("Uploaded photo (base64):", photo);
    
        try {
            const payload = {
                ...values,
                photo: photo // include photo only if necessary
            };
    
            const response = await axios.post('http://localhost:5000/api/form/submit', payload);
            console.log('Server Response:', response.data);
    
            setMessage('Form submitted successfully!');
            resetForm();
            setPhoto(null); // Optional: clear photo after submit
    
        } catch (err) {
            console.error('Error submitting form:', err);
            setMessage('Form submission failed.');
        } finally {
            setSubmitting(false);
        }
    };
    

    const handleDownloadPDF = (values) => {
        const doc = new jsPDF();
        doc.setFontSize(12);
        doc.text('ENROLMENT FORM - ACCURATE SECURITY', 20, 10);
        let y = 20;

        Object.entries(values).forEach(([key, val]) => {
            doc.text(`${key}: ${val}`, 20, y += 10);
            if (y > 280) {
                doc.addPage();
                y = 10;
            }
        });

        if (photo) {
            doc.addPage();
            doc.text('Passport Photo:', 20, 20);
            doc.addImage(photo, 'JPEG', 20, 30, 60, 80);
        }

        doc.save('enrolment-form.pdf');
    };

    return (
        <div className="main container-fluid px-5">
           <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3 px-4 mb-5">
  <div className="container-fluid">
    {/* Logo on the left */}
    <a className="navbar-brand d-flex align-items-center" href="#">
      <img
        src={logo}
        alt="Logo"
        style={{ height: '100px', width: 'auto' }}
        className="me-3"
      />
    </a>

    {/* Centered Text Section */}
    <div className="mx-auto text-center">
      <h5 className="mb-1 fw-bold text-uppercase">ACCURATE SECURITY & ALLIED SERVICES</h5>
      <h6 className="mb-1 text-uppercase">ENROLMENT FORM</h6>
      <p className="mb-0 small">
        47, CITY CENTRE, NR. SWASTIK CROSS ROAD, C.G. ROAD, NAVRANGPURA, AHMEDABAD – 380009<br />
        MOB: 8160880528, EMAIL: <a href="mailto:accurate.adi@gmail.com">accurate.adi@gmail.com</a>, 
        WEBSITE: <a href="http://www.accuratesecurity.in" target="_blank" rel="noreferrer">www.accuratesecurity.in</a>
      </p>
    </div>
  </div>
</nav>


            {message && <div className="alert alert-info">{message}</div>}

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, isSubmitting }) => (
                    <Form>
                        <div className="form-section" style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
                            {/* Left Side: Fields */}
                            <div className="form-left">
                                <div className="mb-3 row">
                                    <label className="col-sm-4 col-form-label">Date:</label>
                                    <div className="col-sm-8">
                                        <Field name="date" type="date" className="form-control" />
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label className="col-sm-4 col-form-label">Name of Unit:</label>
                                    <div className="col-sm-8">
                                        <Field name="unitName" className="form-control" />
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label className="col-sm-4 col-form-label">Designation Applied For:</label>
                                    <div className="col-sm-8">
                                        <Field name="designation" className="form-control" />
                                    </div>
                                </div>
                            </div>
                            {/* Right Side: Photo Upload (adjust as needed) */}
                            <div className="form-right">
                                <label className="form-label">Passport Photo</label>
                                <Field name="photo">
                                    {({ field, form }) => (
                                        <>
                                            {photo ? (
                                                <div className="photo-preview">
                                                    <img
                                                        src={photo}
                                                        alt="Preview"
                                                        className="photo-thumbnail"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            form.setFieldValue('photo', null);
                                                            setPhoto(null);
                                                        }}
                                                        className="remove-photo-btn"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ) : (
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(event) => {
                                                        const file = event.currentTarget.files[0];
                                                        form.setFieldValue('photo', file);

                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setPhoto(reader.result);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }}
                                                    className="form-control"
                                                />
                                            )}
                                        </>
                                    )}
                                </Field>
                            </div>
                        </div>

                        <div className="form-fields">
                            <h4 className="personalDetail">PERSONNEL DETAILS</h4>

                            <div className="form-group d-flex">
                                <label className="col-sm-1 col-form-label">Full Name:</label>

                                <Field name="fullName" className="form-control" />
                                <ErrorMessage name="fullName" component="div" className="text-danger" />
                            </div>

                            {/* mother and father fields */}
                            <div className="form-group d-flex gap-3">
                                <label className="col-sm-1 col-form-label">Mother's Name:</label>
                                <Field name="motherName" className="form-control" />
                                <label className="col-sm-1 col-form-label" htmlFor="fatherName">Father's Name:</label>
                                <Field name="fatherName" className="form-control" />
                            </div>

                            {/* present and permanent fields */}
                            <div className="form-group mb-4 ">
                                <label>Present Address:</label>
                                <Field name="presentAddress" className="form-control mb-2" placeholder="Enter Present Address" />

                                <div className="d-flex align-items-center gap-2">
                                    <Field name="presentAddressLine2" className="form-control" placeholder="Additional Address Details" />
                                    <label className="col-sm-1 col-form-label">Police Station:</label>
                                    <Field name="presentPoliceStation" className="form-control" placeholder="Police Station" />
                                </div>
                            </div>

                            <div className="form-group mb-4">
                                <label>Permanent Address:</label>
                                <Field name="permanentAddress" className="form-control mb-2" placeholder="Enter Permanent Address" />

                                <div className="d-flex align-items-center gap-2">
                                    <Field name="permanentAddressLine2" className="form-control" placeholder="Additional Address Details" />
                                    <label className="col-sm-1 col-form-label">Police Station:</label>
                                    <Field name="permanentPoliceStation" className="form-control" placeholder="Police Station" />
                                </div>
                            </div>

                            {/* present and permanent fields */}


                            <div className="form-group d-flex align-items-center gap-2 mb-4">
                                <label className="col-sm-1 col-form-label">Mobile No.:</label>
                                <Field
                                    name="mobile1"
                                    className="form-control"
                                    placeholder="Mobile No. (1)"
                                />
                                <Field
                                    name="mobile2"
                                    className="form-control"
                                    placeholder="Mobile No. (2)"
                                />
                            </div>

                            {/* height and weight fields */}

                            <div className="form-group d-flex gap-3 mb-4">
                                <label className="col-form-label">Height:</label>
                                <Field
                                    name="height"
                                    type="number"
                                    className="form-control"
                                    placeholder="Height"
                                />
                                <label className="col-form-label">Weight:</label>
                                <Field
                                    name="weight"
                                    type="number"
                                    className="form-control"
                                    placeholder="Weight"
                                />
                                <label className=" col-form-label">Chest:</label>
                                <Field
                                    name="chest"
                                    type="number"
                                    className="form-control"
                                    placeholder="Chest"
                                />
                            </div>

                            <div className="form-group d-flex gap-3 mb-4">
                                <label className="col-sm-2 col-form-label">Education Qualification:</label>
                                <Field
                                    name="education"
                                    className="form-control"
                                    placeholder="Education Qualification"
                                />
                                <label className="col-sm-2  col-form-label">Identification Mark:</label>
                                <Field
                                    name="idMark"
                                    className="form-control"
                                    placeholder="Identification Mark"
                                />
                            </div>

                            <div className="form-group d-flex gap-3 mb-4">
                                <label className="col-sm-1 col-form-label">Date of Birth:</label>
                                <Field
                                    name="dob"
                                    type="date"
                                    className="form-control"
                                />
                                <label className="col-sm-1 col-form-label">Age as on Date:</label>
                                <Field
                                    name="age"
                                    type="number"
                                    className="form-control"
                                    placeholder="Age"
                                />
                                <label className="col-sm-1 col-form-label">Marital Status:</label>
                                <Field
                                    name="maritalStatus"
                                    className="form-control"
                                    placeholder="Marital Status"
                                />
                            </div>

                            <div className="form-group d-flex gap-3 mb-4">
                                <label className="col-sm-1 col-form-label">Aadhar No.:</label>
                                <Field
                                    name="aadharNo"
                                    className="form-control"
                                    placeholder="Aadhar No."
                                />
                                <label className="col-sm-1 col-form-label">VoterID/DL No.:</label>
                                <Field
                                    name="voterId"
                                    className="form-control"
                                    placeholder="Voter ID / DL No."
                                />
                            </div>

                            <div className="form-group d-flex gap-3 mb-4">
                                <label className="col-sm-1 col-form-label">Name of Bank:</label>
                                <Field
                                    name="bankName"
                                    className="form-control"
                                    placeholder="Bank Name"
                                />
                                <label className="col-sm-1 col-form-label">Bank Acct No.:</label>
                                <Field
                                    name="bankAccountNo"
                                    className="form-control"
                                    placeholder="Bank Account No."
                                />
                            </div>

                            <div className="form-group d-flex gap-3 mb-4">
                                <label className="col-sm-1 col-form-label">IFSC Code:</label>
                                <Field
                                    name="ifscCode"
                                    className="form-control"
                                    placeholder="IFSC Code"
                                />
                            </div>



                            {/* previous service details */}


                            <div className="form-fields">
                                <h4 className="personalDetail">PREVIOUS SERVICES DETAILS</h4>



                                <div className="form-group d-flex align-items-center gap-3 mb-4">
                                    <label className="d-inline-block label-25">UAN No. (if any):</label>
                                    <Field
                                        name="uan"
                                        className="form-control"
                                        placeholder="UAN No."
                                    />
                                    <label className="col-form-label d-inline-block label-20">ESIC (IP) No.:</label>
                                    <Field
                                        name="esic"
                                        className="form-control"
                                        placeholder="ESIC (IP) No."
                                    />
                                </div>

                                <div className="form-group d-flex align-items-center gap-3 mb-4">
                                    <label className="d-inline-block label-30">Name of Company:</label>
                                    <Field
                                        name="prevCompany"
                                        className="form-control"
                                        placeholder="Name of Company"
                                    />
                                    <label className="col-sm-1 col-form-label">Designation:</label>
                                    <Field
                                        name="prevDesignation"
                                        className="form-control"
                                        placeholder="Designation"
                                    />
                                </div>


                                <div className="form-group d-flex align-items-center gap-2 mb-3">
                                    <label className="form-label mb-0">From:</label>
                                    <Field
                                        name="fromDate"
                                        type="date"
                                        className="form-control"
                                        style={{ maxWidth: '200px' }}
                                    />

                                    <label className="form-label mb-0">To:</label>
                                    <Field
                                        name="toDate"
                                        type="date"
                                        className="form-control"
                                        style={{ maxWidth: '200px' }}
                                    />
                                </div>


                            </div>


                            {/* family details */}
                            <div className="form-fields">
                                <h4 className="personalDetail">FAMILY DETAILS</h4>



                                <div className="form-group d-flex align-items-center gap-3 mb-3">
                                    <label className="form-label d-inline-block label-25 ">Name of Spouse (if Married):</label>
                                    <Field
                                        name="spouseName"
                                        className="form-control"
                                        placeholder="Spouse Name"
                                    />

                                    <label className="form-label d-inline-block label-12">Date of Birth:</label>
                                    <Field
                                        name="spouseDob"
                                        type="date"
                                        className="form-control"
                                        style={{ maxWidth: '250px' }}
                                    />
                                </div>

                                <div className="form-group d-flex align-items-center gap-3 mb-3">
                                    <label className="form-label d-inline-block label-20 mb-0">Name of Children:</label>
                                    <Field
                                        name="child1"
                                        className="form-control"
                                        placeholder="Child 1"
                                    />

                                    {/* <label className="form-label mb-0">Name of Children (2):</label> */}
                                    <Field
                                        name="child2"
                                        className="form-control"
                                        placeholder="Child 2"
                                    />
                                </div>

                            </div>

                            {/* emergency details */}
                            <div className="form-fields mb-20">
                                <h4 className="personalDetail">EMERGENCY CONTACT DETAILS</h4>

                                <div className="form-group d-flex align-items-center gap-3 mb-3">
                                    <label className="form-label d-inline-block label-30 mb-0">Name of the Person with Relation:</label>
                                    <Field
                                        name="emergencyContactName"
                                        className="form-control"
                                        placeholder="Name and Relation"
                                    />

                                    <label className="form-label d-inline-block label-20 mb-0">Mobile No.:</label>
                                    <Field
                                        name="emergencyContactMobile"
                                        className="form-control"
                                        placeholder="Mobile Number"
                                    />
                                </div>

                            </div>

                            {/* terms and condition details */}


                            <div className="container my-4">
                                <div className="row justify-content-center">
                                    <div className="col-md-8 border p-4 shadow-sm bg-white">
                                        <h4 className="text-center mb-4">
                                            <span className="fw-bold">सामान्य नियम और शर्तें</span>
                                        </h4>
                                        <p>
                                            आपकी कर्मचारी पुस्तिका और संविदात्मक रोजगार अनुबंध पत्र में अधिकांश नियम और शर्तें उल्लेखित है किन्तु आपको इन मानक नियमो और शर्तो का पालन करना होगा,
                                            साथ ही साथ आप भविष्य में संशोधित व  परिवर्तित होने वाले नियमो व विनियमो से शासित होकर पालन हेतु बाध्य होंगे :-
                                        </p>
                                        <ol className="" style={{ lineHeight: '1.8' }}>
                                            <li>
                                                आपका कर्तव्य और आपकी सेवाओं / काम का दायरा आपको कंपनी द्वारा समझाया जाएगा, हालाँकि कंपनी समय-समय पर होने वाले कार्यों की प्रकृति और सेवाओं के दायरे में किसी भी तरह के बदलाव का अधिकार सुरक्षित रखती है।
                                            </li>
                                            <li>सरकार की देयतय / कर / अनुपालन प्रचलित कानून के अधीन है।</li>
                                            <li>
                                                आपको हमेशा कंपनी / ग्राहक द्वारा निर्देशित ड्रेस कोड का पालन करना होगा। आपको पॉलिश किए हुए जूते, साफ की हुई ड्रेस पहन कर ही अपने कर्तव्य पर शामिल होना होगा।
                                            </li>
                                            <li>आप अपनी कंपनी द्वारा अपने कब्ज़े में निहित सभी कंपनियों / ग्राहक संपत्ति की सुरक्षा के लिए जिम्मेदार होंगे।</li>
                                            <li>
                                                आपको अपने प्रस्ताव पत्र या नियुक्ति के लिए आवश्यक सभी संबंधित दस्तावेज को प्रस्तुत करना होगा, बिना दस्तावेज को सम्मिलित किए आपकी नियुक्ति की पुष्टि नहीं की जाएगी। नियुक्ति के पूर्व आपको आपकी शारीरिक सक्षमता प्रमाण पत्र और पुलिस सत्यापन जमा करना अनिवार्य है।
                                            </li>
                                            <li>
                                                आप ना तो किसी भी प्रकार से आपराधिक प्रकृति के होने वाली गतिविधियों में लिप्त होंगे, और ना ही इस तरह की गतिविधियों में संगठन के भीतर या बाहर किसी अन्य व्यक्ति के साथ संलग्न होंगे। ऐसा होने पर कंपनी आपकी सेवाएं बिना कारण बताए समाप्त कर सकती है।
                                            </li>
                                            <li>
                                                आपकी नौकरी या कार्य प्रोफ़ाइल से संबंधित किसी भी शिकायत पर ऑपरेशन हेड / एच आर / एडमिन डिपार्टमेंट या प्रबंधन द्वारा अधिकृत किसी अन्य व्यक्ति से इसके लिए तुरंत चर्चा की जानी चाहिए।
                                            </li>
                                            <li>
                                                कोई भी छुट्टी लेने से पहले आपको प्रोजेक्ट ऑपरेशन हेड / एच आर / एडमिन डिपार्टमेंट को लिखकर सूचित करना होगा (अपने एच ओ डी की पूर्व स्वीकृति के साथ)। किसी भी आकस्मिक स्थिति में जानकारी एच ओ डी को दिया जाना चाहिए और वापस लौटने पर तुरंत आवेदन जमा करना चाहिए।
                                            </li>
                                            <li>
                                                यदि आप प्रबंधन करना चाहते हैं तो आपको कंपनी के किसी भी प्रोजेक्ट / ऑपरेशन / कार्यालय में उसकी आकस्मिकता अनुसार ट्रांसफर किया जा सकता है। आप कार्य, जिम्मेदारियों और कर्तव्यों के लिए पूरी तरह से जिम्मेदार होंगे।
                                            </li>
                                            <li>अपनी सेवाओं के दौरान आप कंपनी के मामलों पर सख्त गोपनीयता बनाए रखेंगे और सभी नियम और विनियमों का पालन करेंगे।</li>
                                            <li>आप कंपनी के काम के लिए पूरा समय समर्पित करेंगे और किसी भी मामले में प्रबंधन की पूर्व अनुमति के अलावा कोई प्रत्यक्ष या अप्रत्यक्ष कार्य या मानदेय नहीं लेंगे।</li>
                                            <li>कंपनी आपसे उस अनुभाग / विभाग में काम करने की उम्मीद करेगी जिसमें आपकी पहल, दक्षता के साथ रखा गया है।</li>
                                            <li>कंपनी के पास आपके द्वारा किए गए दुराचार / कदाचार के विवरण के साथ समाचार पत्र में आपकी तस्वीर प्रकाशित करने का अधिकार सुरक्षित है।</li>
                                            <li>कंपनी के पास उस क्षेत्र से संबंध रखने वाली सभी कंपनियों को आपकी तस्वीर और अन्य विवरण वितरित करने का अधिकार सुरक्षित है अगर आप एक व्यापक कदाचार में लिप्त पाए जाते हैं।</li>
                                            <li>आप अपने रोज़गार के दौरान समय-समय पर लागू संशोधित या परिवर्तित नियम और विनियमों द्वारा नियंत्रित होंगे और उनके पालन के लिए बाध्य होंगे।</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>

                            {/* Additional fields omitted for brevity */}

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Form'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => handleDownloadPDF(values)}
                                >
                                    Download PDF
                                </button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default UserForm;
