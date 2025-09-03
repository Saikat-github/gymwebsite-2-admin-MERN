import {
    Loader2
} from "lucide-react";
import { useState, useContext } from "react";
import { toast } from 'react-toastify'
import { AuthContext } from "../../context/AuthContext";
import { getStartEndDate } from "../../utils/utilFunctions";
import axios from "axios";
import { useEffect } from "react";
import SingleMember from "./SingleMember";
import SearchMember from "./SearchMember";





export default function AllMembers() {
    const [loader, setLoader] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("active");
    const [cursor, setCursor] = useState(null);
    const [hasNextPage, setHasNextPage] = useState(false);

    const { dateFilter, setDateFilter, backendUrl, members, setMembers } = useContext(AuthContext);


    const getAllMembers = async () => {
        try {
            setLoader(true);
            const { startDate, endDate } = getStartEndDate(dateFilter);
            const res = await axios.get(backendUrl + '/api/admin/all-members', {
                params: {
                    name: search,
                    startDate,
                    endDate,
                    statusFilter,
                    cursor
                },
                withCredentials: true,
            })
            if (res.data.success) {
                setMembers(cursor ? [...members, ...res.data.members] : res.data.members)
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
            getAllMembers();
        }, 500); // 500ms debounce delay

        return () => clearTimeout(delayDebounceFn); // Cleanup the timeout on dependency change
    }, [dateFilter, statusFilter, search]);



    return (
        <div className="px-2 sm:px-6 py-4 space-y-2">
            <h1 className="text-3xl font-bold text-center mb-8">Member Profiles</h1>

            {/* Search */}
            <SearchMember
                search={search}
                setSearch={setSearch}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
            />

            <hr className="text-slate-400 mb-4" />

            {/* Loader */}
            {loader && <Loader2 className="w-4 animate-spin mx-auto" />}

            {/* members List */}
            <div className="flex flex-col items-center gap-4">
                {members?.length > 0 ? (
                    members.map((member) => (
                        <SingleMember key={member._id} member={member} />
                    ))
                ) : (
                    <p className="text-slate-500">No members found.</p>
                )}
            </div>

            {/* Load More Button */}
            {hasNextPage && (
                <button
                    disabled={loader}
                    className={`bg-orange-600 mx-auto text-white px-4 py-1 rounded mt-4 flex items-center gap-2 cursor-pointer disabled:opacity-70`}
                    onClick={() => getAllMembers()}
                >
                    {loader ? "Loading..." : "Load More"}
                </button>
            )}
        </div>
    );
}
