import { Loader2 } from "lucide-react";
import React from "react";

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel, loader }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      {loader
        ? <Loader2 className="w-6 animate-spin"/>
        :
        <div className="bg-slate-900 rounded-lg shadow-lg p-6 w-full max-w-sm">
          <div className="text-xs sm:text-sm">
          <p className="font-semibold mb-2">The following things will happen if you delete this user's <span className="text-red-600">{message}</span> details</p>
            {
              message === "Profile"
                ?
                <div>
                  <li>Active subscription if any, will be completely removed, without notifying the doctor</li>
                  <li>Complete profile data of this doctor will be deleted</li>
                </div>
                :
                <div>
                  <li>He/She will have to create new acount to use this platform</li>
                  <li>Active membership if any, will be completely removed.</li>
                  <li>Complete profile data will be deleted</li>
                  <li>All payments details will be deleted.</li>
                </div>
            }
            
            <p className="font-semibold mt-4">Are you sure you want to delete this user's <span className="text-red-600">{message}</span> ?</p>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer"
            >
              No
            </button>
            <button
              disabled={loader}
              onClick={onConfirm}
              className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 ${loader && "cursor-not-allowed"} cursor-pointer`}
            >
              Yes
            </button>
          </div>
        </div>
      }

    </div>
  );
};

export default ConfirmationModal;
