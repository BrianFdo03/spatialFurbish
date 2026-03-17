
import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Admin/Dashboard";
import { OrdersPage } from "./pages/Admin/Orders";
import { CategoriesPage } from "./pages/Admin/Categories";
import { ProductsPage } from "./pages/Admin/Products";
import { CustomersPage } from "./pages/Admin/Customers";
// import { ReviewsPage } from "./pages/Admin/Reviews";
// import { PaymentsPage } from "./pages/Admin/Payments";
import { Home } from "./pages/User/Home";
import { About } from "./pages/User/About";
import { Cart } from "./pages/User/Cart";
import { PlaceOrder } from "./pages/User/PlaceOrder";
import { UserOrder } from "./pages/User/UserOrder";
import { Shop } from "./pages/User/Shop";
import SignupPage from "./pages/Auth/SignUpPage";
import LoginPage from "./pages/Auth/LoginPage";
import Logout from "./pages/Auth/Logout";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ROLES } from "./constants/roles";

import { Contact } from "./pages/User/Contact";
import Profile from "./pages/User/Profile"; //Ravindu
import { ProductDetails } from "./pages/User/ProductDetails";
import { TexturesPage } from "./pages/Admin/Textures";

export default function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/logout" element={<Logout />} />

      {/* User Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/Shop" element={<Shop />} />
      <Route path="/place-order" element={<PlaceOrder />} />
      <Route path="/user-order" element={<UserOrder />} />
      <Route path="/product/:id" element={<ProductDetails />} />

      <Route path="/profile" element={<Profile />} />

      {/* Admin Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF]}>
            <OrdersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/categories"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF]}>
            <CategoriesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/textures"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF]}>
            <TexturesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF]}>
            <ProductsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customers"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <CustomersPage />
          </ProtectedRoute>
        }
      />

      {/* discussed not to add reviews page now */}
      {/* <Route path="/reviews" element={<ReviewsPage />} /> */}
      {/* <Route path="/payments" element={<PaymentsPage />} /> */}
    </Routes>
  );
}

import { BrowserRouter, Routes, Route } from "react-router-dom"
import RoomSelectionPage from "@/components/RoomSelectionPage"
import FloorPlanEditor from "@/components/FloorPlanEditor"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoomSelectionPage />} />
        <Route path="/editor" element={<FloorPlanEditor />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

