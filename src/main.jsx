import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {
  Home,
  NotFound,
  LoginPage,
  ForgetPasswordPage,
  AllDayPasses,
  AdminManagement,
  GymInfo,
  AllMembers,
  SingleMember,
  AllPayments,
  AllUsers,
  SingleDayPassPath
} from './pages/index.js';
import AuthContextProvider from './context/AuthContext.jsx'
import ProtectedDocRoute from './components/utils/ProtectedRoute.jsx'



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element:
          <ProtectedDocRoute>
            <Home />
          </ProtectedDocRoute>
      },
      {
        path: "/admin/login",
        element: <LoginPage />
      },
      {
        path: "/admin/forget-password",
        element: <ForgetPasswordPage />
      },
      {
        path: "/admin/users",
        element: <ProtectedDocRoute>
          <AllUsers />
        </ProtectedDocRoute>
      },
      {
        path: "/admin/members",
        element:
          <ProtectedDocRoute>
            <AllMembers />
          </ProtectedDocRoute>
      },
      {
        path: "/admin/members/:userAuthId",
        element:
          <ProtectedDocRoute>
            <SingleMember />
          </ProtectedDocRoute>
      },
      {
        path: "/admin/payments",
        element:
          <ProtectedDocRoute>
            <AllPayments />
          </ProtectedDocRoute>
      },
      {
        path: "/admin/day-passes",
        element:
          <ProtectedDocRoute>
            <AllDayPasses />
          </ProtectedDocRoute>
      },
      {
        path: "/admin/day-passes/:paymentId",
        element:
          <ProtectedDocRoute>
            <SingleDayPassPath />
          </ProtectedDocRoute>
      },
      {
        path: "/admin/gyminfo",
        element:
          <ProtectedDocRoute>
            <GymInfo />
          </ProtectedDocRoute>
      },
      {
        path: "/admin/manage-admins",
        element:
          <ProtectedDocRoute>
            <AdminManagement />
          </ProtectedDocRoute>
      },




      {
        path: "*",
        element: <NotFound />
      },
    ]
  }
])



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider >
      <RouterProvider router={router} />
    </AuthContextProvider>
  </StrictMode>,
)
