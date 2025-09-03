import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import SingleDayPass from '../daypasses/SingleDayPass';



const SingleDayPassPath = () => {
    const [loader, setLoader] = useState(false);
    const { paymentId } = useParams();
    const { backendUrl } = useContext(AuthContext);
    const [dayPass, setDayPass] = useState(null);



    const getSingleDayPass = async () => {
        try {
            setLoader(true);
            const res = await axios.get(`${backendUrl}/api/admin/get-singledaypass`, {
                params: { paymentId },
                withCredentials: true,
            });
            if (res.data.success) {
                setDayPass(res.data.dayPass);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoader(false);
        }
    }


    useEffect(() => {
        getSingleDayPass()
    }, [])


    if (loader) {
        return <div className='flex justify-center items-center h-60'>
            <Loader2 className='animate-spin mx-auto w-5' />
        </div>
    }



    return (
        <div className="min-h-screen sm:py-10 sm:px-6">
            <div className="max-w-4xl mx-auto bg-slate-900 rounded-2xl p-6 shadow-lg space-y-10 md:space-y-16 max-sm:text-sm">
                {dayPass ?
                    <SingleDayPass
                        dayPass={dayPass}
                        getAllDayPasses={getSingleDayPass} />
                    :
                    <p className='my-20 text-center text-gray-400'>No member found!</p>
                }
            </div>
        </div>
    );
};

export default SingleDayPassPath;
