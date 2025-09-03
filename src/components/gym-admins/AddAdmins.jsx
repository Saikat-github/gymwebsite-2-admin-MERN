// components/admin/AddAdmins.js
import { useState } from 'react';
import { UserCog, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Signup from '../auth/Signup';



const AddAdmins = ({ getAllAdmins }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);




  return (
    <div className='rounded-xl p-6 shadow-lg relative max-sm:text-sm bg-slate-900'>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4 justify-center"><UserCog size={24} className="text-orange-600" />Manage Admins</h2>
      <div className=" flex flex-col lg:flex-row justify-around gap-10 items-center">
        <div className='max-w-72'>
          <div className='text-xs space-y-4'>
            <Link
              to={"/admin/gyminfo"}
              className="flex gap-1 cursor-pointer transition-all duration-200 bg-black/60 w-20 px-2 py-1.5 text-slate-200 rounded hover:opacity-80"
            >
              <ArrowLeft size={16} />
              Back
            </Link>
            <p className='text-sm font-semibold'>N.B :</p>
            <li>Enter a registered email to add/remove anyone as an admin.</li>
            <li>User must be signed up or logged in atleast once on the user panel of this website. </li>
            <li>Once added, an admin can manage everything, from admission management to user deletion to payment management.</li>
            <li>Be extra careful while adding a new admin</li>
          </div>
        </div>

        <Signup getAllAdmins={getAllAdmins}/>
      </div>
    </div>
  );
};

export default AddAdmins;
