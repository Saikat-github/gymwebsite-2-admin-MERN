import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Dot } from 'lucide-react'



const SingleMember = ({ member }) => {
  return (
    <Link
      key={member._id}
      to={`/admin/members/${member.userAuthId}`}
      className="bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex items-center p-4 gap-10 text-gray-200 hover:opacity-90"
    >
      {/* Profile Section */}
      <div className="flex flex-col items-center">
        <img
          src={member?.personalInfo?.imageUrl}
          alt={member.personalInfo.name}
          className="w-20 h-20 object-cover rounded-full border-2 border-orange-600"
        />
      </div>

      {/* Info Section */}
      <div className="flex flex-col justify-center flex-1 text-gray-300 text-sm">
        <h2 className="text-lg font-semibold">{member.personalInfo.name}</h2>
        <p className="mb-2">DoB : {new Date(member.personalInfo.dob).toLocaleDateString("en-GB")}</p>
        <p
          className={`flex items-center gap-1 text-center text-xs rounded-full ${member.membership.status === "active"
            ? " text-green-400"
            : " text-red-400"
            }`}
        >
          {member.membership.status.toUpperCase()}
        </p>
        <p className="flex items-center gap-2 hover:underline mt-2">
          View Details <ArrowRight className="text-orange-600" />
        </p>
      </div>
    </Link>
  )
}

export default SingleMember