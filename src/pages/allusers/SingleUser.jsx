import { User, Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/utilFunctions';




const SingleUser = ({ user, setIsOpen, setUserId }) => {
    return (
        <div
            key={user._id}
            className="rounded-xl bg-gray-900 p-4 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
        >
            <div className="space-y-1 text-xs md:text-sm text-slate-300">
                <p className="text-slate-300 font-semibold">{user.email}</p>
                <p className="">Created At: {user.createdAt && formatDate(user.createdAt)}</p>
                <p className="">Updated At: {user.updatedAt && formatDate(user.updatedAt)}</p>
                <p className="">
                    Signup Method:
                    <span className="font-medium"> {user.googleId ? "Google" : "Email OTP"}</span>
                </p>
                <p className="">Profile Created: {user.profileCompleted ? "Yes" : "No"}</p>
            </div>
            <div className="flex flex-col gap-2 text-xs md:text-sm">
                <Link
                    to={user.profileId && `/admin/members/${user._id}`} 
                    className={`flex items-center gap-1 px-3 py-1.5 rounded bg-black/50 transition-all duration-200 cursor-pointer hover:opacity-90 ${!user.profileId && "hidden"}`}>
                    <Eye size={16} />
                    View Profile
                </Link>
                <button
                    onClick={() => {
                        setIsOpen(true);
                        setUserId(user._id)
                    }}
                    className="md:mt-0 flex items-center gap-1 px-3 py-1.5 rounded bg-red-600 cursor-pointer  hover:opacity-90 transition-all duration-200">
                    <Trash2 size={16} />
                    Terminate
                </button>
            </div>
        </div>
    )
}

export default SingleUser