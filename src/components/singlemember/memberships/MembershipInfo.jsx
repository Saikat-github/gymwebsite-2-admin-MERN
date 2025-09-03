import React, { useContext, useEffect, useState } from 'react'
import HistoryCard from './HistoryCard';
import { User, CalendarClock, Info, Loader2, Clock } from "lucide-react";
import { toast } from 'react-toastify';
import { formatDate } from '../../../utils/utilFunctions';
import axios from 'axios'
import { AuthContext } from '../../../context/AuthContext';



const MembershipInfo = ({ member }) => {
    const [payments, setPayments] = useState([]);
    const [cursor, setCursor] = useState(null);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [loader, setLoader] = useState(true)

    const { backendUrl } = useContext(AuthContext);


    const getAllPayments = async () => {
        try {
            setLoader(true);
            const res = await axios.get(backendUrl + '/api/admin/singlemember-payments', {
                params: {
                    userAuthId: member.userAuthId,
                    cursor
                },
                withCredentials: true,
            })
            if (res.data.success) {
                setPayments(cursor ? [...payments, ...res.data.payments] : res.data.payments)
                setCursor(res.data.nextCursor);
                setHasNextPage(res.data.hasNextPage);
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
        const delayDebounceFn = setTimeout(() => {
            getAllPayments();
        }, 500); // 500ms debounce delay

        return () => clearTimeout(delayDebounceFn); // Cleanup the timeout on dependency change
    }, []);


    return (
        <div className="">
            <h1 className='text-center text-xl mb-2 px-4 py-1 rounded bg-slate-200 text-slate-900 sm:w-60 mx-auto'>Payment History</h1>
            {member?.membership.status === "inactive" ? (
                <div className="text-xs p-2 rounded max-w-2xl text-center mx-2 sm:mx-auto flex items-center justify-center gap-2 text-red-600 my-2">
                    <Info />
                    <p className='text-gray-400 text-sm'>
                        This member doesn't have any active membership, {member.membership.endDate && ` membership expired on ${formatDate(member.membership.endDate)}`}
                    </p>
                </div>
            )
                :
                <div className='flex flex-col gap-1 items-center my-4 text-sm'>
                    <p className='flex gap-1 sm:items-center'><User className='w-5 text-orange-600' />Membership : Active</p>
                    <p className='flex gap-1 sm:items-center'><Clock className='w-5 text-orange-600' />Last Payment On : {formatDate(member?.membership.lastPaymentDate)}</p>
                    <p className='flex gap-1 sm:items-center'><CalendarClock className='w-5 text-orange-600' />Expires on : {formatDate(member?.membership.endDate)}</p>
                </div>
            }

            <div>
                <h1 className='text-center text-xl'>History</h1>
                <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
                    {
                        payments?.length === 0 ? (
                            <div className="text-center text-gray-400 text-sm">
                                No payment history found.
                            </div>
                        )
                            :
                            payments?.map((payment, index) => (
                                <HistoryCard key={index} payment={payment} name={member?.personalInfo?.name} />
                            ))
                    }
                </div>
                {
                    loader && <Loader2 className='w-5 animate-spin my-10 mx-auto' />
                }
                {hasNextPage && (
                    <button
                        disabled={loader}
                        className="bg-orange-600 mx-auto text-white px-4 py-2 rounded-lg mt-4 flex items-center gap-2 cursor-pointer"
                        onClick={() => getAllPayments()}
                    >
                        {loader ? "Loading..." : "Load More"}
                    </button>
                )}
            </div>
        </div>

    )
}

export default MembershipInfo