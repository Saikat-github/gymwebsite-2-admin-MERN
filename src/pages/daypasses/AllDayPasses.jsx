import {
    Loader2
} from "lucide-react";
import { useState, useContext } from "react";
import { toast } from 'react-toastify'
import { AuthContext } from "../../context/AuthContext";
import { getStartEndDate } from "../../utils/utilFunctions";
import axios from "axios";
import { useEffect } from "react";
import SingleDayPass from "./SingleDayPass";
import SearchDayPass from "./SearchDayPass";




export default function AllDayPasses() {
    const [loader, setLoader] = useState(false);
    const [cursor, setCursor] = useState(null);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [ search, setSearch ] = useState("");

    const { dateFilter, setDateFilter, backendUrl, dayPasses, setDayPasses } = useContext(AuthContext);


    const getAllDayPasses = async () => {
        try {
            setLoader(true);
            const { startDate, endDate } = getStartEndDate(dateFilter);
            const res = await axios.get(backendUrl + '/api/admin/all-dayPasses', {
                params: {
                    search,
                    startDate,
                    endDate,
                    cursor
                },
                withCredentials: true,
            })
            if (res.data.success) {
                setDayPasses(cursor ? [...dayPasses, ...res.data.dayPasses] : res.data.dayPasses)
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
            getAllDayPasses();
        }, 500); // 500ms debounce delay

        return () => clearTimeout(delayDebounceFn); // Cleanup the timeout on dependency change
    }, [dateFilter, search]);



    return (
        <div className="px-2 sm:px-6 py-4 space-y-2">
            <h1 className="text-3xl font-bold text-center mb-8">All Day Passes</h1>


            {/* Search */}
            <SearchDayPass
            search={search}
            setSearch={setSearch}
            dateFilter={dateFilter} 
            setDateFilter={setDateFilter}
            />

            <hr className="text-slate-400 mb-4" />

            {/* Loader */}
            {loader && <Loader2 className="w-4 animate-spin mx-auto" />}


            {/* dayPasses List */}
            <div className="flex flex-col items-center gap-4">
                {dayPasses?.length > 0 ? (
                    dayPasses.map((dayPass) => (
                        <SingleDayPass 
                        key={dayPass._id} 
                        dayPass={dayPass}
                        getAllDayPasses={getAllDayPasses} 
                        />
                    ))
                ) : (
                    <p className={`${loader && "hidden"} text-slate-300`}>No day passes found.</p>
                )}
            </div>


            {/* Load More Button */}
            {hasNextPage && (
                <button
                    disabled={loader}
                    className={`bg-orange-600 mx-auto text-white px-4 py-1 rounded mt-4 flex items-center gap-2 cursor-pointer disabled:opacity-70`}
                    onClick={() => getAllDayPasses()}
                >
                    {loader ? "Loading..." : "Load More"}
                </button>
            )}
        </div>
    );
}
