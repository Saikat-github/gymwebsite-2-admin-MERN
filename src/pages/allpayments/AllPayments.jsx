import {
  Loader2,
} from "lucide-react";
import { useState, useContext } from "react";
import { toast } from 'react-toastify'
import { AuthContext } from "../../context/AuthContext";
import { getStartEndDate } from "../../utils/utilFunctions";
import axios from "axios";
import { useEffect } from "react";
import SinglePayment from "./SinglePayment";
import SearchPayment from "./SearchPayment";




export default function AllPayments() {
  const [payments, setPayments] = useState([]);
  const [loader, setLoader] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  const { dateFilter, setDateFilter, backendUrl } = useContext(AuthContext);


  const getAllPayments = async () => {
    try {
      setLoader(true);
      const { startDate, endDate } = getStartEndDate(dateFilter);
      const res = await axios.get(backendUrl + '/api/admin/all-payments', {
        params: {
          startDate,
          endDate,
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
  }, [dateFilter]);



  return (
    <div className="px-2 sm:px-6 py-4 space-y-2">
      <h1 className="text-3xl font-bold text-center mb-8">All Day Passes</h1>


      {/* Search */}
      <SearchPayment
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />

      <hr className="text-slate-400 mb-4" />

      {/* Loader */}
      {loader && <Loader2 className="w-4 animate-spin mx-auto" />}


      {/* payments List */}
      <div className="flex flex-col items-center gap-4">
        {payments?.length > 0 ? (
          payments.map((payment) => (
            <SinglePayment
              key={payment._id}
              payment={payment}
              getAllPayments={getAllPayments}
            />
          ))
        ) : (
          <p className={`${loader && "hidden"} text-slate-300`}>No payment found.</p>
        )}
      </div>


      {/* Load More Button */}
      {hasNextPage && (
        <button
          disabled={loader}
          className={`bg-orange-600 mx-auto text-white px-4 py-1 rounded mt-4 flex items-center gap-2 cursor-pointer disabled:opacity-70`}
          onClick={() => getAllPayments()}
        >
          {loader ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
