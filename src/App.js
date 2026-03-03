import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import ReactGA from "react-ga";
import Footer from "./components/Common/Footer/Footer";
import Header from "./components/Common/header/Header";
import Home from "./pages/Home";
import RequirementForm from "./pages/RequirementForm";
import SingleProduct from "./pages/SingleProduct";
import HomeLone from "./pages/HomeLone";
import PayRentOnline from "./pages/PayRentOnline";
import LegalHelp from "./pages/LegalHelp";
import EmiCalculatorPage from "./pages/EmiCalculatorPage";
import RateAndTrends from "./pages/RateAndTrends";
import Investment from "./pages/Investment";
import InvestmentExplore from "./pages/InvestmentExplore";
import InvestmentAllProduct from "./pages/InvestmentAllProduct";
import Project from "./pages/Project";
import MyProfile from "./pages/MyProfile";
import PostProperty from "./pages/PostProperty";
import PropertyDemand from "./pages/PropertyDemand";
import FindAgent from "./pages/FindAgent";
import PrivacyPolicy from './pages/PrivacyPolicy';
import ProductSearch from "./pages/ProductSearch";
import SingleAgent from "./pages/SingleAgent";
import InvestDetails from "./pages/InvestDetails";
import Message from "./pages/Message";
import HomeLoneOnline from "./pages/HomeLoneOnline";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInformation } from "./features/slices/userInformation";
import Protected from "./routes/protectedRoute";
import {
  fetchFavoritesList,
  removeAllFavorites,
} from "./features/slices/favourites";
import Test from "./pages/Test";
import ResetPassword from "./pages/ResetPassword";
import AllProperties from "./pages/AllProperties";

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID);

function App(props) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const token = localStorage.getItem("sheetal_token");

  const location = useLocation();

  useEffect(() => {
    if (token) {
      dispatch(fetchUserInformation());
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (user.data) {
      dispatch(fetchFavoritesList());
    } else {
      dispatch(removeAllFavorites());
    }
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + location.search);
  }, [location.pathname, location.search]);

  return (
    <div className="bg-gray-100">
      <Header />
      <div className="mx-auto w-full bg-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/requirementForm" element={<RequirementForm />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/property/:id" element={<SingleProduct />} />
          <Route path="/homeLone" element={<HomeLone />} />
          <Route path="/homeLone/applyOnline" element={<HomeLoneOnline />} />
          <Route path="/payRentOnline" element={<PayRentOnline />} />
          <Route path="/LegalHelp" element={<LegalHelp />} />
          <Route path="/emiCalculator" element={<EmiCalculatorPage />} />
          <Route path="/rateandtrend" element={<RateAndTrends />} />
          <Route path="/investment" element={<Investment />} />
          <Route path="/investment/export" element={<InvestmentExplore />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPassword {...props} />}
          />
          <Route
            path="/my-profile?section=post-property"
            element={
              <Protected>
                <PostProperty />
              </Protected>
            }
          />
          <Route path="/properties" element={<AllProperties />} />
          <Route path="/propertyDemand" element={<PropertyDemand />} />
          <Route path="/agents" element={<FindAgent />} />
          <Route path="/agent/:id" element={<SingleAgent />} />
          <Route path="/productSearch" element={<ProductSearch />} />
          <Route path="/my-profile/messages" element={<Message />} />
          <Route path="/investDetail" element={<InvestDetails />} />
          <Route path="/project" element={<Project />} />
          <Route path="/test" element={<Test />} />
          <Route
            path="/investment/viewallproduct"
            element={<InvestmentAllProduct />}
          />

          <Route
            path="/my-profile"
            element={
              <Protected>
                <MyProfile />
              </Protected>
            }
          />
        </Routes>
      </div>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="font-base text-normal"
      />
    </div>
  );
}

export default App;
