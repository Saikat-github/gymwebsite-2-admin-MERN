import React, { useContext, useEffect, useState } from 'react'
import AddAdmins from './AddAdmins'
import AllAdmins from './AllAdmins'
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';




const AdminComponent = () => {
  const [admins, setAdmins] = useState(null);
  const [loader, setLoader] = useState(false);
  const { backendUrl } = useContext(AuthContext);


  const getAllAdmins = async () => {
    try {
      setLoader(true)
      const res = await axios.get(backendUrl + '/api/admin/all-admins', { withCredentials: true });
      if (res.data.success) {
        setAdmins(res.data.admins);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoader(false);
    }
  }



  const removeAdmin = async (id) => {
    try {
      setLoader(true)
      const res = await axios.post(backendUrl + '/api/admin/remove-admin', { id}, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        getAllAdmins()
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoader(false)
    }
  }

  useEffect(() => {
    getAllAdmins()
  }, [])


  return (
    <div className='space-y-4 max-sm:py-4 sm:p-4'>
      <AddAdmins getAllAdmins={getAllAdmins}/>
      <AllAdmins admins={admins} loader={loader} removeAdmin={removeAdmin}/>
    </div>
  )
}

export default AdminComponent