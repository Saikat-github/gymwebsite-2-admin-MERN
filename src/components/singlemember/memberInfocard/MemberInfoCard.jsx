import {
  User, ShieldCheck,
  Image as ImageIcon, HeartPulse, BadgeCheck
} from 'lucide-react';
import { formatDate } from '../../../utils/utilFunctions';





const MemberInfoCard = ({ member }) => {
  return (
    <div className='text-gray-200 text-xs md:text-sm'>
      <div className="flex flex-col items-center gap-2 mb-4">
        <h1 className='text-center text-xl mb-2 px-4 py-1 rounded bg-slate-200 text-slate-900'>Profile Info</h1>
        {/* Profile Image */}
        <img
          src={member.personalInfo.imageUrl}
          alt={member.personalInfo.name}
          className="w-40 h-40 rounded-full object-cover"
        />
        <h1 className="text-lg font-bold border-b border-b-orange-600">{member.personalInfo.name}</h1>
      </div>

      {/* Emergency Details */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className='p-4 space-y-2'>
          <h3 className="font-semibold mb-2 flex items-center gap-2"><User size={18} className='text-orange-600' /> Personal Info</h3>
          <p className="">DoB : {new Date(member.personalInfo.dob).toLocaleDateString("en-GB")}</p>
          <p>Gender : {member.personalInfo.gender}</p>
          <p className="text-sm ">Phone : {member.personalInfo.phone}</p>
          <p>Created At : {formatDate(member.createdAt)}</p>
          <p>Verified : {member.verified ? "Yes" : "No"}</p>
        </div>

        <div className=" p-4 space-y-2">
          <h3 className="font-semibold mb-2 flex items-center gap-2"><ShieldCheck size={18} className='text-orange-600' /> Emergency Contact</h3>
          <p>Name : {member.personalInfo.emergencyName}</p>
          <p>Relation : {member.personalInfo.emergencyRelation}</p>
          <p>Phone : {member.personalInfo.emergencyPhone}</p>
        </div>

        <div className=" p-4 space-y-2">
          <h3 className="font-semibold mb-2 flex items-center gap-2"><HeartPulse size={18} className='text-orange-600' /> Health Details</h3>
          <p>Height : {member.healthInfo.height} cm</p>
          <p>Weight : {member.healthInfo.weight} kg</p>
          <p>Medical : {member.healthInfo.hadMedicalCondition ? "Yes" : "None"}</p>
          <p>Goal : {member.healthInfo.goal}</p>
        </div>
      </div>

      {/* membership Info */}
      <div className=" rounded-lg p-4 space-y-2">
        <h3 className="font-semibold mb-2 flex items-center gap-2"><BadgeCheck size={18} className='text-orange-600' /> Current Plan</h3>
        <p>Membership Status : {member.membership.status.toUpperCase()}</p>
        <p>Plan : {member.membership.planType}</p>
        <p>Last Payment : {member.membership.lastPaymentDate && formatDate(member.membership.lastPaymentDate)}</p>
        <p>End Date : {member.membership.endDate && formatDate(member.membership.endDate)}</p>
      </div>

      {/* Aadhar Image */}
      <div className=" rounded-lg p-4">
        <h3 className="font-semibold mb-2 flex items-center gap-2"><ImageIcon size={18} className='text-orange-600' /> Aadhar Card</h3>
        <img src={member.personalInfo.aadharUrl} alt="Aadhar Card" className="rounded-md border border-slate-600 mt-2 w-72" />
      </div>
    </div>
  )
}

export default MemberInfoCard