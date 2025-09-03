import React from 'react'
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from 'lucide-react'
import { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";




const Login = ({ navigateTo }) => {
    const [loader, setLoader] = useState(false);
    const { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate();
    const { backendUrl, checkAuthStatus } = useContext(AuthContext);


    const onSubmit = async (data) => {
        try {
            setLoader(true);
            const response = await axios.post(`${backendUrl}/api/admin/login`, data, {
                withCredentials: true,
            });

            if (response.data.success) {
                await checkAuthStatus()
                toast.success(response.data.message);
                navigate(navigateTo, { replace: true })
            } else {
                toast.error(response.data.errors ? response.data.errors[0].msg : response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
            console.error("Error:", error);
        } finally {
            setLoader(false);
            reset();
        }
    };


    return (
        <div className="flex flex-col gap-2 rounded-xl text-xs sm:text-sm p-6 sm:px-10 mb-20 max-sm:mb-32 border border-gray-400 w-[400px]">
            <p className="text-center mb-4 text-2xl font-semibold">Login</p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder='Enter email'
                    {...register("email", { required: true })}
                    className="bg-gray-800 rounded px-3 py-2 w-full outline-none"
                />
                <input
                    type="password"
                    placeholder='Enter password'
                    {...register("password", { required: true })}
                    className="bg-gray-800 rounded px-3 py-2 w-full outline-none"
                />
                <button
                    disabled={loader}
                    className={`cursor-pointer hover:opacity-80 text-center w-full bg-orange-600 rounded-sm py-2 hover:bg-opacity-85 transition-all duration-300 ${loader && "bg-opacity-85"
                        } flex justify-center items-center`}
                >
                    {loader ? (
                        <Loader2 className="w-4 animate-spin" />
                    ) : (
                        "Login"
                    )}
                </button>
            </form>
            <p className="text-xs cursor-pointer text-indigo-700 hover:underline" onClick={() => navigate("/admin/forget-password")}>
                Forget Password
            </p>
        </div>
    )
}

export default Login