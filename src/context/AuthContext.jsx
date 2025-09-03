import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import conf from '../conf/conf';
import axios from 'axios'



export const AuthContext = createContext(null);


const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loader, setLoader] = useState(true);
  const [plans, setPlans] = useState([]);
  const [popularPlan, setPopularPlan] = useState([]);
  const [members, setMembers] = useState([]);
  const [dashData, setDashData] = useState({});
  const [users, setUsers] = useState([])
  const [dateFilter, setDateFilter] = useState();
  const [dayPasses, setDayPasses] = useState([]);
  const [savedSchedule, setSavedSchedule] = useState({});
  const [scheduleId, setScheduleId] = useState(null);


  const backendUrl = conf.backendUrl;

  // Create axios instance with default config
  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: backendUrl,
      withCredentials: true,
      timeout: 10000, // 10 second timeout
    });
  }, [backendUrl]);


    // Add error interceptor for better error handling
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          setUser(null);
          setProfileData(null);
        }
        return Promise.reject(error);
      }
    );

    return () => axiosInstance.interceptors.response.eject(interceptor);
  }, [axiosInstance]);



  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/admin/current_admin');
      if (response.data.success) {
        const userData = response.data.user;
        setUser(userData);

        const userType = userData.userType;
        const isAdminUser = ["admin", "super_admin"].includes(userType);
        const isSuperAdminUser = userType === "super_admin";

        setIsAdmin(isAdminUser);
        setIsSuperAdmin(isSuperAdminUser);

        // Only load additional data for admin users
        if (isAdminUser) {
          await Promise.allSettled([
            getAllPlans(),
            loadFirstSchedule(),
            getDashData()
          ]);
        }
        return true;
      } else {
        clearAuthState();
        return false;
      }
    } catch (error) {
      toast.error("Something went wrong")
      return false;
    } finally {
      setLoader(false);
    }
  }, [])


  const clearAuthState = useCallback(() => {
    setUser(null);
    setIsAdmin(false);
    setIsSuperAdmin(false);
    setPlans([]);
    setPopularPlan(null);
    setMembers([]);
    setDashData({});
    setUsers([]);
    setDayPasses([]);
    setSavedSchedule({});
    setScheduleId(null);
  }, []);



  const getAllPlans = useCallback(async () => {
    try {
      const result = await axiosInstance.get("/api/admin/get-plans");
      if (result.data.success) {
        const plansData = result.data.data || [];
        setPlans(plansData);

        if (plansData.length > 0) {
          const maxChosen = Math.max(...plansData.map(plan => plan.noOfChosen || 0));
          const popularPlanData = plansData.find(plan => plan.noOfChosen === maxChosen);
          setPopularPlan(popularPlanData || null);
        } else {
          setPopularPlan(null);
        }
      } else {
        toast.error(result.data.message || "Failed to load plans");
        setPlans([]);
        setPopularPlan(null);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }, [])


  const loadFirstSchedule = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/api/admin/get-schedule");
      if (response.data.success) {
        const { createdAt, updatedAt, _v, _id, timezone, ...rest } = response.data.schedule
        setSavedSchedule(rest)
        setScheduleId(_id)
      } else {
        setSavedSchedule({})
        setScheduleId(null);
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }, [])



  const getDashData = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/api/admin/get-dashdata')
      if (res.data.success) {
        setDashData(res.data.dashData || {});
      } else {
        toast.error(res.data.message || "Failed to load dashboard data");
        setDashData({});
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }, [])




  useEffect(() => {
    checkAuthStatus();
  }, [])



const value = useMemo(() => ({
    //config
    backendUrl,

    //auth state
    user,
    isAuthenticated: !!user,
    isAdmin,
    isSuperAdmin,

    //loader
    loader,

    // Data
    plans,
    popularPlan,
    members,
    dashData,
    users,
    dateFilter,
    savedSchedule,
    scheduleId,
    dayPasses,

    // Setters
    setMembers,
    setUsers,
    setDateFilter,
    setSavedSchedule,
    setScheduleId,
    setDayPasses,
    setDashData,

    // Actions
    checkAuthStatus,
    getAllPlans,
    loadFirstSchedule,
    getDashData,
    clearAuthState
  }), [
    backendUrl,
    user,
    isAdmin,
    isSuperAdmin,
    loader,
    plans,
    popularPlan,
    members,
    dashData,
    users,
    dateFilter,
    savedSchedule,
    scheduleId,
    dayPasses,
    checkAuthStatus,
    getAllPlans,
    loadFirstSchedule,
    getDashData,
    clearAuthState
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
