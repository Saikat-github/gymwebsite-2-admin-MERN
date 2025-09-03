import { NavLink, useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import { useContext, useState } from "react";
import { Loader2, LogIn, Power } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import axios from 'axios'



const Logout = ({ isAuthenticated, setMobileMenuOpen }) => {
    const [loader, setLoader] = useState(false);
    const { backendUrl, user, clearAuthState } = useContext(AuthContext);


    const navigate = useNavigate()
    const handleLogout = async () => {
        try {
            setLoader(true);
            const { data } = await axios.get(backendUrl + "/api/admin/logout", { withCredentials: true })
            if (data.success) {
                await clearAuthState()
                toast.success(data.message);
                navigate('/admin/login');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoader(false);
            setMobileMenuOpen(false);
        }
    }


    return (
        <>
            {
                user
                    ?

                    <button
                        disabled={loader}
                        onClick={handleLogout}
                        className="flex gap-2 items-center px-3 py-2 hover:text-orange-600 cursor-pointer"
                    >
                        <Power className="w-4 text-orange-600" />
                        {loader ? <Loader2 className='w-4 animate-spin' /> : "Logout"}
                    </button>
                    :
                    <NavLink
                        to="/admin/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                            `flex gap-2 items-center px-1 py-1 hover:text-orange-600 mx-auto`
                        }
                    >
                        <LogIn className="w-4 text-orange-600" />
                        Login
                    </NavLink>

            }
        </>
    )
}

export default Logout