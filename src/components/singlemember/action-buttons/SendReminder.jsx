import React, { useState } from 'react'
import { Mail } from 'lucide-react'
import { toast } from 'react-toastify';
import axios from 'axios'




const SendReminderButton = ({ memberId, backendUrl }) => {
    const [loader, setLoader] = useState(false);


  const sendReminderEmail = async () => {
    try {
      setLoader(true);
      const res = await axios.post(backendUrl+"/api/admin/send-reminder", { memberId }, { withCredentials: true })
      if (res.data.success) {
        toast.success(res.data.message)
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoader(false);
    }
  }

    
    return (
        <button
            disabled={loader}
            className="px-3 py-1.5 rounded flex items-center justify-center gap-2 cursor-pointer hover:opacity-80 bg-black/60"
            onClick={sendReminderEmail}
        >
            <Mail className='w-5 text-slate-300' />
            {loader ? 'Sending...' : 'Send Reminder Email'}
        </button>
    )
};

export default SendReminderButton;
