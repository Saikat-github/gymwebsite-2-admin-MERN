import { useContext, useState, useCallback } from 'react';
import { BadgePercent, Plus, Loader2 } from 'lucide-react';
import PlanCard from './PlanCard';
import PlanForm from './PlanForm';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios'




const Plans = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loader, setLoader] = useState(false);

  const { getAllPlans, plans, backendUrl } = useContext(AuthContext);


  const handleAdd = useCallback(() => {
    setCurrentPlan(null);
    setModalOpen(true);
  }, []);
  

  const handleEdit = useCallback((plan) => {
    setCurrentPlan(plan);
    setModalOpen(true);
  }, []);


  const handleDelete = useCallback(async (plan) => {
    try {
      setLoader(true);
      if (window.confirm(`Are you sure, you want to delete ${plan.title} plan?`)) {
        const response = await axios.post(backendUrl + "/api/admin/delete-plan",
          { planId: plan._id },
          {
            withCredentials: true
          }
        );
        console.log(response.data);
        if (response.data.success) {
          toast.success(response.data.message);
          getAllPlans()
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete plan. Please try again.");
    } finally {
      setLoader(false);
    }
  }, []);




  const handleSubmit = useCallback(async (data) => {
    try {
      setLoader(true);
      const featuresArray = typeof data.features === 'string'
        ? data.features.split(',').map(f => f.trim())
        : data.features || [];

      let response;

      if (currentPlan) {
        response = await axios.put(backendUrl + "/api/admin/update-plan",
          { ...data, features: featuresArray, planId: currentPlan._id }, {
          withCredentials: true
        });
      } else {
        response = await axios.post(backendUrl + "/api/admin/add-plan",
          { ...data, features: featuresArray }, {
          withCredentials: true
        });
      }
      if (response.data.success) {
        toast.success(response.data.message);
        setModalOpen(false);
        setCurrentPlan(null);
        getAllPlans()
      } else {
        toast.error(response.data.errors ? response.data.errors[0].msg : response.data.message);
      }
    } catch (error) {
      toast.error(`Failed to ${currentPlan ? 'update' : 'add'} plan. Please try again.`);
    } finally {
      setLoader(false);
    }
  }, [currentPlan]);




  if (loader) {
    return <div className="bg-slate-900 rounded-xl p-6 shadow-lg max-sm:text-sm">
      <Loader2 className='animate-spin w-6 mx-auto' />
    </div>
  }



  return (
    <div className="bg-slate-900 rounded-xl p-4 sm:p-6 shadow-lg relative">
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-center mb-6">
        <h2 className="text-lg sm:text-2xl font-semibold flex items-center gap-2">
          <BadgePercent className="text-orange-600" /> Membership Plans
        </h2>
        <button onClick={handleAdd} className="cursor-pointer flex items-center gap-2 bg-orange-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-orange-700 transition">
          <Plus size={16} /> Add New Plan
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map(plan => (
          <PlanCard
            key={plan._id}
            plan={plan}
            onEdit={() => handleEdit(plan)}
            onDelete={() => handleDelete(plan)}
          />
        ))}
      </div>

      {modalOpen && (
        <PlanForm
          defaultValues={currentPlan || { title: '', price: '', duration: '', discount: '', features: '' }}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          isEditing={!!currentPlan}
        />
      )}
    </div>
  );
};

export default Plans;
