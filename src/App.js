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
import RateAndTrends from "./pages/RateAndTrends";
import Investment from "./pages/Investment";
import InvestmentExplore from "./pages/InvestmentExplore";
import InvestmentAllProduct from "./pages/InvestmentAllProduct";
import Project from "./pages/Project";
import About from "./pages/About";
import Rent from "./pages/Rent";
import Sale from "./pages/Sale";
import MyProfile from "./pages/MyProfile";
import VerifyEmail from "./pages/VerifyEmail";
import PostProperty from "./pages/PostProperty";
import PropertyDemand from "./pages/PropertyDemand";
import FindAgent from "./pages/FindAgent";
import PrivacyPolicy from "./pages/privacy-policy";
import TermsAndConditions from "./pages/TermsAndConditions";
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
import Blog from './pages/Blog';
import BlogSingle from './pages/BlogSingle';
import BlogCategory from './pages/BlogCategory';
import UnitConverter        from "./pages/UnitConverter";
import EmiCalculatorPage    from "./pages/EmiCalculatorPage";
import ROICalculator        from "./pages/ROICalculator";
import LandPriceEstimator   from "./pages/LandPriceEstimator";
import PropertyTaxEstimator from "./pages/PropertyTaxEstimator";
import RentVsBuy            from "./pages/RentVsBuy";
import {
  fetchFavoritesList,
  removeAllFavorites,
} from "./features/slices/favourites";
import Test from "./pages/Test";
import ResetPassword from "./pages/ResetPassword";
import AllProperties from "./pages/AllProperties";
import axios from "axios";

// --- GLOBAL AXIOS CONFIG ---
axios.defaults.baseURL = process.env.REACT_APP_API_LINK;
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("sheetal_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID);

// ── Scroll to top on every route change ──────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function App(props) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const token = localStorage.getItem("sheetal_token");
  const location = useLocation();

  useEffect(() => {
    const init = async () => {
      try {
        const apiLink = process.env.REACT_APP_API_LINK || "";
        const sanctumBase = apiLink.split('/api')[0];

        await axios.get(`${sanctumBase}/sanctum/csrf-cookie`);
        await new Promise((resolve) => setTimeout(resolve, 300));

        const currentToken = localStorage.getItem("sheetal_token");
        if (currentToken) {
          dispatch(fetchUserInformation());
        }
      } catch (e) {
        console.error("Auth Init Error:", e);
      }
    };
    init();
  }, [dispatch]);

  useEffect(() => {
    if (user?.data?.id) {
      dispatch(fetchFavoritesList());
    } else if (!user?.data && !localStorage.getItem("sheetal_token")) {
      dispatch(removeAllFavorites());
    }
  }, [user?.data?.id, user?.data, dispatch]);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + location.search);
  }, [location.pathname, location.search]);

  return (
    <div className="bg-gray-100">
      <ScrollToTop />   {/* ← only addition */}
      <Header />
      <div className="mx-auto w-full bg-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/requirementForm" element={<RequirementForm />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/property/:id" element={<SingleProduct />} />
          <Route path="/homeLone" element={<HomeLone />} />
          <Route path="/About" element={<About />} />
          <Route path="/homeLone/applyOnline" element={<HomeLoneOnline />} />
          <Route path="/payRentOnline" element={<PayRentOnline />} />
          <Route path="/LegalHelp" element={<LegalHelp />} />
          <Route path="/rateandtrend" element={<RateAndTrends />} />
          <Route path="/investment" element={<Investment />} />
          <Route path="/investment/export" element={<InvestmentExplore />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPassword {...props} />}
          />
          <Route path="/properties" element={<AllProperties />} />
          <Route path="/propertyDemand" element={<PropertyDemand />} />
          <Route path="/agents" element={<FindAgent />} />
          <Route path="/agent/:id" element={<SingleAgent />} />
          <Route path="/productSearch" element={<ProductSearch />} />
          <Route path="/my-profile/messages" element={<Message />} />
          <Route path="/investDetail/:id" element={<InvestDetails />} />
          <Route path="/project" element={<Project />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/sale" element={<Sale />} />
          <Route path="/test" element={<Test />} />
          <Route
            path="/investment/viewallproduct"
            element={<InvestmentAllProduct />}
          />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogSingle />} />
          <Route path="/blog/category/:slug" element={<BlogCategory />} />
         

          <Route path="/tools/unit-converter" element={<UnitConverter />} />
          <Route path="/tools/emi-calculator" element={<EmiCalculatorPage />} />
          <Route path="/tools/roi-calculator" element={<ROICalculator />} />
          <Route path="/tools/land-estimator" element={<LandPriceEstimator />} />
          <Route path="/tools/property-tax" element={<PropertyTaxEstimator />} />
          <Route path="/tools/rent-vs-buy" element={<RentVsBuy />} />
          {/* Protected Routes */}
          <Route
            path="/my-profile"
            element={
              <Protected>
                <MyProfile />
              </Protected>
            }
          />
          <Route
            path="/post-property"
            element={
              <Protected>
                <PostProperty />
              </Protected>
            }
          />
        </Routes>
      </div>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        theme="colored"
      />
    </div>
  );
}

export default App;