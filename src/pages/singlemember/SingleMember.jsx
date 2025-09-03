import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { MemberInfoCard, ActionButtons, MembershipInfo } from '../../components';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import axios from 'axios';



const SingleMember = () => {
  const [loader, setLoader] = useState(false);
  const { userAuthId } = useParams();
  const { members, backendUrl } = useContext(AuthContext);
  const [selectedMember, setSelectedMember] = useState(members.find(m => m.userAuthId === userAuthId) || null);



  const getSingleMember = async () => {
    try {
      setLoader(true);
      const res = await axios.get(`${backendUrl}/api/admin/get-singlemember`, {
        params: { userAuthId },
        withCredentials: true,
      });
      if (res.data.success) {
        setSelectedMember(res.data.member);
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
    if (!selectedMember) {
      getSingleMember()
    }
  }, [])



  if (loader) {
    return <div className='flex justify-center items-center h-60'>
      <Loader2 className='animate-spin mx-auto w-5' />
    </div>
  }



  return (
    <div className="min-h-screen sm:py-10 sm:px-6">
      <div className="max-w-4xl mx-auto bg-slate-900 rounded-2xl p-6 shadow-lg space-y-10 md:space-y-16 max-sm:text-sm">
        {selectedMember ?
          <>
            <MemberInfoCard member={selectedMember} />
            <hr />
            <ActionButtons
              member={selectedMember} getSingleMember={getSingleMember} />
            <hr />
            <MembershipInfo member={selectedMember} />
          </>
          :
          <p className='my-20 text-center text-gray-400'>No member found!</p>
        }
      </div>
    </div>
  );
};

export default SingleMember;
