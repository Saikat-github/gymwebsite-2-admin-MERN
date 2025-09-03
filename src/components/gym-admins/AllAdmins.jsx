import React from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { formatDate } from '../../utils/utilFunctions';



const AllAdmins = ({ admins, loader, removeAdmin }) => {



  if (loader) {
    return <Loader2 className='w-6 animate-spin mx-auto' />
  }


  return (
    <div className="rounded-xl p-6 shadow-lg relative max-sm:text-sm flex flex-col justify-around gap-4 items-center bg-slate-900">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
        <ShieldCheck className="text-orange-600" />
        Current Admins
      </h2>

      {admins && admins.length > 0 ? (
        <div className="space-y-4">
          {admins.map((admin, index) => (
            <div
              key={admin.id || index}
              className="p-2 sm:p-4 border border-slate-400 rounded-lg flex flex-col gap-3 text-sm text-slate-200"
            >
              <p>
                <span>Email -</span> {admin.email}
              </p>
              <p>
                <span>Admin Type -</span> {admin.userType}
              </p>
              <p>
                <span>Added At -</span>{' '}
                {admin.createdAt && formatDate(admin.createdAt)}
              </p>
              <p>
                <span>Updated At -</span>{' '}
                {admin.createdAt && formatDate(admin.updatedAt)}
              </p>
              {
                admin.userType !== 'super_admin' && (
                  <button
                    disabled={loader}
                    onClick={() => removeAdmin(admin._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Remove Admin
                  </button>
                )
              }
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-4">No admins yet.</p>
      )}
    </div>
  );
};

export default AllAdmins;
