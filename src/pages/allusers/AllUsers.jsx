import { useState, useContext } from "react";
import { toast } from 'react-toastify'
import { AuthContext } from "../../context/AuthContext";
import { getStartEndDate } from "../../utils/utilFunctions";
import axios from "axios";
import { useEffect } from "react";
import SingleUser from "./SingleUser";
import SearchUser from "./SearchUser";
import { ConfirmationModal } from "../../components";
import { Loader2 } from "lucide-react";




export default function AllUsers() {
    const { backendUrl, users, setUsers, dateFilter, setDateFilter, } = useContext(AuthContext);
    const [search, setSearch] = useState("");
    const [loader, setLoader] = useState(false);
    const [cursor, setCursor] = useState(null);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState(null);


    const deleteAccount = async (userId) => {
        try {
            setLoader(true);
            const { data } = await axios.post(backendUrl + '/api/admin/delete-user', {
                userId
            },
                {
                    withCredentials: true
                });
            if (data.success) {
                toast.success(data.message);
                setIsOpen(false);
                getAllUsers()
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoader(false);
            setIsOpen(false)
        }
    }



    const getAllUsers = async () => {
        try {
            setLoader(true);
            const { startDate, endDate } = getStartEndDate(dateFilter);
            const res = await axios.get(backendUrl + '/api/admin/all-users', {
                params: {
                    search,
                    startDate,
                    endDate,
                    cursor
                },
                withCredentials: true,
            })
            if (res.data.success) {
                setUsers(prev => cursor ? [...prev, ...res.data.users] : res.data.users)
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
            getAllUsers()
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search, dateFilter]);



    return (
        <div className="px-2 sm:px-10 py-4 space-y-4">
            <h1 className="text-3xl font-bold text-center mb-8">Registered Accounts</h1>
            {/* Search and Time Filter */}
            <SearchUser search={search} setSearch={setSearch} dateFilter={dateFilter} setDateFilter={setDateFilter} loader={loader} />

            <hr className="text-slate-400" />

            {loader && <Loader2 className="w-4 animate-spin mx-auto" />}

            {/* Users List */}
            <div className="grid grid-cols-1 gap-4">
                {users.length > 0 ? (
                    users.map((user) => (
                        <SingleUser user={user} key={user._id} setIsOpen={setIsOpen} setUserId={setUserId} />
                    ))
                ) : (
                    <p className="text-slate-500 text-center">No registered users found.</p>
                )}
            </div>

            <ConfirmationModal
                isOpen={isOpen}
                message="account"
                onConfirm={() => deleteAccount(userId)}
                onCancel={() => setIsOpen(false)}
                loader={loader}
            />


            {/* Load More Button */}
            {hasNextPage && (
                <button
                    disabled={loader}
                    className={`bg-orange-600 mx-auto text-white px-4 py-1 rounded mt-4 flex items-center gap-2 cursor-pointer disabled:opacity-70`}
                    onClick={() => getAllUsers()}
                >
                    {loader ? "Loading..." : "Load More"}
                </button>
            )}
        </div>
    );
}
