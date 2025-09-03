import React, { useState } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';



const MarkAsAvailed = ({ dayPass, getAllDayPasses }) => {
    const [loader, setLoader] = useState(false);
    const { backendUrl } = useContext(AuthContext);
    

    const MarkAsAvailed = async () => {
        try {
            setLoader(true);
            if (dayPass.availed) {
                toast.error("This pass is already marked as availed");
                return;
            }
            const res = await axios.post(backendUrl+"/api/admin/mark-daypass-availed", { dayPassId: dayPass._id }, {
                withCredentials: true,
            })
            
            if (res.data.success) {
                toast.success("Day pass marked as availed");
                await getAllDayPasses();
            } else {
                toast.error("Failed to mark as availed");
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoader(false);
        }
    }


    return (
        dayPass.availed
            ?
            <p className='text-sm px-4 py-2 rounded bg-gray-800 mt-2 text-center'>Pass availed</p>
            :
            <button
                disabled={loader}
                onClick={() => MarkAsAvailed()}
                className='text-sm py-2 px-4 bg-orange-600 my-2 hover:opacity-50 cursor-pointer transition duration-300 rounded-full mx-auto disabled:opacity-50'>{
                    loader ? "Marking as availed..." : "Mark as Availed"
                }
            </button>
    )
}

export default MarkAsAvailed