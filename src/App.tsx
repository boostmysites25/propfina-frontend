import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AdminLayout />}>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
