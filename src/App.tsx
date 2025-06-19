import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/private/Dashboard/Dashboard";
import AdminLayout from "./components/AdminLayout";
import AddProperty from "./pages/private/AddProperty/AddProperty";
import AllProperties from "./pages/private/AllProperties/AllProperties";
import VisitsAndScheduling from "./pages/private/VisitsAndScheduling/VisitsAndScheduling";
import Users from "./pages/private/Users/Users";
import Banners from "./pages/private/Banners/Banners";
import Notifications from "./pages/private/Notifications/Notifications";
import Settings from "./pages/private/Settings/Settings";
import { isAuthenticated } from "./utils/auth";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  // const [authChecked, setAuthChecked] = useState(false);

  // // Check authentication status when the app loads
  // useEffect(() => {
  //   setAuthChecked(true);
  // }, []);

  // // Don't render routes until auth check is complete
  // if (!authChecked) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
  //     </div>
  //   );
  // }

  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5000,
        }}
      />
      <Routes>
        <Route
          path="/login"
          element={
            // isAuthenticated() ? <Navigate to="/dashboard" replace /> :
             <Login />
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace={true} />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-property" element={<AddProperty />} />
          <Route path="properties" element={<AllProperties />} />
          <Route path="visits" element={<VisitsAndScheduling />} />
          <Route path="users" element={<Users />} />
          <Route path="banners" element={<Banners />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route
          path="*"
          element={
            isAuthenticated() ? (
              <Navigate to="/" replace={true} />
            ) : (
              <Navigate to="/login" replace={true} />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
