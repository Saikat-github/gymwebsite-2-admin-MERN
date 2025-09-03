import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CalendarClock, Loader2, Pencil, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
];

const capitalizeFirstLetter = str =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";


const ScheduleForm = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [loader, setLoader] = useState(false);

    const { register, handleSubmit, reset } = useForm({});
    const { backendUrl, savedSchedule, setSavedSchedule, scheduleId} = useContext(AuthContext);


    const onSubmit = async (data) => {
        try {
            setSavedSchedule(data);
            setIsEditing(false);

            const response = await axios.post(backendUrl + "/api/admin/update-schedule", { scheduleId, ...data }, { withCredentials: true });
            if (!response.data.success) {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }


    const toggleEdit = () => {
        if (isEditing) {
            handleSubmit(onSubmit)(); // Save on clicking again
        } else {
            reset(savedSchedule)// Load current values into form
            setIsEditing(true);
        }
    };



    if (loader) {
        return <div className="bg-slate-900 rounded-xl p-6 shadow-lg max-sm:text-sm">
            <Loader2 className='animate-spin w-6 mx-auto' />
        </div>
    }



    return (
        <div className="bg-slate-900 rounded-xl sm:p-6 p-4 shadow-lg max-sm:text-xs">
            <div className="flex flex-col sm:flex-row gap-2 justify-between items-center mb-4">
                <h2 className="text-lg sm:text-2xl font-semibold flex sm:items-center gap-2">
                    <CalendarClock className="text-orange-600 " />
                    Gym Schedule (24h)
                </h2>
                <button
                    className="cursor-pointer flex items-center gap-2 bg-orange-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-orange-700 transition"
                    onClick={toggleEdit}
                >
                    {isEditing ? <Save size={16} /> : <Pencil size={16} />}
                    {isEditing ? 'Save' : 'Edit'}
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-gray-300">

                {daysOfWeek.map((day) => (
                    <div key={day} className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                        <label className="sm:w-28 font-semibold">{capitalizeFirstLetter(day)} : </label>
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="time"
                                    {...register(`${day}.open`)}
                                    className="bg-slate-800 px-2 py-1 rounded text-white"
                                />
                                <span className="text-white">to</span>
                                <input
                                    type="time"
                                    {...register(`${day}.close`)}
                                    className="bg-slate-800 px-2 py-1 rounded text-white"
                                />
                                <span>Is Closed</span>
                                <input
                                    type="checkbox"
                                    {...register(`${day}.isClosed`)}
                                    className="w-4 h-4"
                                />
                            </div>
                        ) : (
                            Object.keys(savedSchedule).length > 0 && savedSchedule[day]
                                ? <p>{savedSchedule[day].open} to {savedSchedule[day].close} {savedSchedule[day].isClosed && <span className='text-red-600'>Closed</span>}</p>
                                : <p>00:00 to 00:00</p>
                        )}
                    </div>
                ))}
            </form>
        </div>
    );
};

export default ScheduleForm;
