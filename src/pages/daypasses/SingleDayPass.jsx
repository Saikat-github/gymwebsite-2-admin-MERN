import React, { useRef } from 'react';
import { Mail, Phone, Calendar, User, IndianRupee, CheckCircle, XCircle, Clock, Download, Info, IdCard } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { gymLogoBase64 } from '../../assets/assets';
import { formatDate } from '../../utils/utilFunctions';
import MarkAsAvailed from './MarkAsAvailed';



const SingleDayPass = ({ dayPass, getAllDayPasses }) => {
    const pdfRef = useRef();

    if (!dayPass) return null;

    const {
        passId,
        name,
        email,
        phone,
        age,
        noOfDays,
        availed,
        paymentId,
    } = dayPass;

    const Field = ({ icon: Icon, label, value }) => (
        <div className="flex items-center gap-2 border-b border-white/10 py-2 flex-wrap">
            <Icon className="w-4 h-4 text-orange-600" />
            <span className="font-medium text-white">{label} : </span>
            <span className="text-gray-300 truncate">{value ?? '—'}</span>
        </div>
    );


    const handleDownload = () => {
        if (paymentId.paymentStatus !== "paid") {
            return;
        }
        const doc = new jsPDF();

        // Add logo image (x, y, width, height)
        doc.addImage(gymLogoBase64, 'PNG', 20, 6, 30, 30);

        // Gym name and address next to logo
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Minimalist Gyms", 55, 18);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Raj College More, Burdwan, WB, 713101, India", 55, 24);
        doc.text("Contact: +91 9999999999 | www.minimalistgyms.com", 55, 30);

        // Line separator
        doc.setDrawColor(200);
        doc.line(20, 35, 190, 35);

        // Invoice Title
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Day-Pass Invoice", 20, 45);

        // Membership Details
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");

        const lines = [
            `Day PassId : ${passId}`,
            `Name: ${name}`,
            `Phone : ${phone}`,
            `Age : ${age}`,
            `Availed: ${availed ? 'Yes' : 'No'}`,
            `No. of Days: ${noOfDays}`,
            `Amount: Rs. ${paymentId?.amount}`,
            `Transaction Date : ${formatDate(paymentId?.paymentDate)}`,
            `Valid Till: ${formatDate(paymentId?.planEndDate)}`,
            `Payment Status: ${paymentId.paymentStatus} | ${paymentId?.paymentMethod}`,
        ];

        lines.forEach((line, index) => {
            doc.text(line, 20, 60 + index * 10);
        });

        // Save the PDF
        doc.save(`invoice_minimalist_gyms.pdf`);
    };



    return (
        <div className="max-w-md w-full mx-auto max-sm:text-xs">
            <div ref={pdfRef} className="bg-gray-900/50 p-4 rounded-xl shadow-md backdrop-blur-md text-slate-300">
                {
                (paymentId.planEndDate && new Date(paymentId.planEndDate) < new Date()) ?
                    <span className='border text-red-600 bg-red-800/40 text-sm px-4 py-1 rounded-full'>Expired</span> :
                    <span className='border text-green-600 bg-green-800/40 text-sm px-4 py-1 rounded-full'>Active</span>
                }

                <h2 className="text-xl font-semibold my-2 text-orange-600 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    {name || 'Unnamed'}
                </h2>
                <Download onClick={handleDownload} className={`w-5 cursor-pointer absolute right-2 top-4`} />

                <div className="space-y-2">
                    <Field icon={IdCard} label="Day Pass Id" value={passId} />
                    <Field icon={Phone} label="Phone" value={phone} />
                    <Field icon={Calendar} label="Age" value={age} />
                    <Field icon={availed ? CheckCircle : XCircle} label="Availed" value={availed ? 'Yes' : 'No'} />
                    <Field icon={Clock} label="No. of Days" value={noOfDays} />
                    <Field icon={IndianRupee} label="Amount" value={`₹${paymentId?.amount}`} />
                    {paymentId?.paymentDate && <Field icon={Calendar} label="Transaction Date" value={formatDate(paymentId?.paymentDate)} />}
                    {paymentId?.planEndDate && <Field icon={Calendar} label="Valid Till" value={formatDate(paymentId?.planEndDate)} />}
                    <Field icon={CheckCircle} label="Payment Status" value={paymentId?.paymentStatus === 'paid' ? 'Paid' : "Pending"} />
                    <Field icon={CheckCircle} label="Payment Method" value={paymentId?.paymentMethod} />
                    {paymentId.paymentStatus !== "paid"
                        &&
                        <div>
                            <p className='text-gray-300 p-2 border border-red-600 rounded text-xs'>Payment for this day pass is pending, if any money got deducted from your account, it will be auto-refunded within 5-7 business days.</p>
                        </div>
                    }
                </div>


                <MarkAsAvailed dayPass={dayPass} getAllDayPasses={getAllDayPasses}/>
            </div>
        </div>
    );
};

export default SingleDayPass;
