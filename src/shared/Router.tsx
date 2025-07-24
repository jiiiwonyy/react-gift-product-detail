import { Routes, Route } from "react-router-dom";
import Home from "@/Pages/Home";
import Login from "@/Pages/Login";
import NotFound from "@/Pages/NotFound";
import MyPage from "@/Pages/MyPage";
import LoginProtectedRoute from "@/shared/LoginProtectedRoute";
import Order from "@/Pages/Order";
import ThemeProductList from "@/Pages/ThemeProductList";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/my"
        element={
          <LoginProtectedRoute>
            <MyPage />
          </LoginProtectedRoute>
        }
      />
      <Route
        path="/order/:productId"
        element={
          <LoginProtectedRoute>
            <Order />
          </LoginProtectedRoute>
        }
      />
      <Route path="/themes/:themeId" element={<ThemeProductList />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
export default Router;
