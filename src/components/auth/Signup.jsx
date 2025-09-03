import { useState, useContext, useRef, useEffect } from 'react';
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Loader2 } from 'lucide-react'
import GoogleLogo from "../../assets/google2.svg";
import { AuthContext } from "../../context/AuthContext";



const Signup = ({ navigateTo, getAllAdmins}) => {
    const [email, setEmail] = useState("");
    const [showOTPInput, setShowOTPInput] = useState(false);
    const [loader, setLoader] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { backendUrl } = useContext(AuthContext);



    const handleSendOTP = async (data) => {
        if (cooldown > 0) return toast.warn(`Please wait ${cooldown}s before resending`);
        try {
            setLoader(true);
            const res = await axios.post(backendUrl + '/api/admin/signup-sendotp', { email: data.email }, { withCredentials: true});
            if (res.data.success) {
                setEmail(data.email)
                toast.success(res.data.message);
                setShowOTPInput(true);
                setCooldown(30); 
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data || 'An error occurred');
        } finally {
            setLoader(false)
        }
    };



    const onSubmit = async (data) => {
        try {
            setLoader(true);

            const response = await axios.post(backendUrl + '/api/admin/signup', { ...data, email }, {
                withCredentials: true,
            });

            if (response.data.success) {
                toast.success(response.data.message);
                getAllAdmins()
            } else {
                toast.error(response.data.errors ? response.data.errors[0].msg : response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            console.error("Error:", error);
        } finally {
            setLoader(false);
            reset();
        }
    };



    useEffect(() => {
        if (cooldown > 0) {
            const interval = setInterval(() => setCooldown(c => c - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [cooldown]);


    return (
        <div className='border border-slate-400 rounded-lg p-4 sm:w-md'>
            <p className="text-center my-3 text-2xl font-semibold">Add Admin</p>
            {
                !showOTPInput
                    ?
                    <>
                        <form onSubmit={handleSubmit(handleSendOTP)} className='flex flex-col gap-4 mt-4'>
                            <input
                                type="email"
                                className="bg-gray-800 rounded px-3 py-2 w-full outline-none"
                                placeholder="Enter email to verify"
                                {...register("email", {
                                    required: "Please enter email",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Please enter a valid email address",
                                    },
                                })}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                            )}
                            <button
                                disabled={loader}
                                className={`cursor-pointer bg-orange-600 text-center w-full rounded-sm py-2 hover:opacity-80 transition-all duration-300 ${loader && "bg-opacity-85"
                                    } flex justify-center items-center`}
                            >
                                {loader ? (
                                    <Loader2 className="w-4 animate-spin" />
                                ) : (
                                    "Send OTP"
                                )}
                            </button>
                        </form>
                    </>
                    :
                    <>
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
                            <input
                                type="number"
                                placeholder='Enter OTP'
                                {...register('otp', {
                                    required: "Please enter OTP",
                                    minLength: { value: 4, message: "OTP must be at least 4 digits" },
                                    maxLength: { value: 6, message: "OTP cannot exceed 6 digits" },
                                })
                                }
                                className="bg-gray-800 rounded px-3 py-2 w-full outline-none"
                            />
                            {errors.otp && (
                                <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>
                            )}
                            <div>
                                <input
                                    type="password"
                                    placeholder='Enter a strong password'
                                    {...register("password", {
                                        required: true,
                                        minLength: { value: 8, message: "Password must be at least 8 characters" },
                                    })
                                    }
                                    className="bg-gray-800 rounded px-3 py-2 w-full outline-none"
                                />
                                <p className='text-[10px] mt-2'><span className='text-red-600'>*</span>Password must be at least 8 characters long and contain letters and numbers</p>
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                                )}
                            </div>
                            <button
                                type='submit'
                                disabled={loader}
                                className={`cursor-pointer bg-orange-600 text-center w-full rounded py-2 hover:opacity-85 transition-all duration-300 ${loader && "bg-opacity-85"
                                    } flex justify-center items-center`}
                            >
                                {loader ? (
                                    <Loader2 className="w-4 animate-spin" />
                                ) : (
                                    "Signup"
                                )}
                            </button>
                        </form>
                        <button
                            disabled={cooldown > 0}
                            onClick={() => setShowOTPInput(false)} className='text-indigo-700 hover:underline mt-2'>Resend OTP in {cooldown}s
                        </button>
                    </>

            }
        </div>
    )
}

export default Signup