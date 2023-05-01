import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Explore from "./pages/Explore";
import Offers from "./pages/Offers";
import Footer from "./components/Navbar";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import { getAuth } from "firebase/auth";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./components/PrivateRoute";
import Category from "./pages/Category";
import Contact from "./pages/Contact";
import "react-toastify/dist/ReactToastify.css";
import Listing from "./pages/Listing";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import { ReactComponent as EditIcon } from "./assets/svg/editIcon.svg";

function App() {
  return (
    <>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route
            path="/category/:categoryName/:listingId"
            element={<Listing />}
          />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/edit-listing/:listingId" element={<EditListing />} />
          <Route path="/contact/:landlordId" element={<Contact />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
