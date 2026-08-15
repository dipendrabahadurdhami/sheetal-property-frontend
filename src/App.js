import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import ReactGA from "react-ga";
import { Suspense, lazy } from "react";
import GlobalSEO from "./components/SEO/GlobalSEO";
import PageLoader from "./components/SEO/PageLoader";
import Footer from "./components/Common/Footer/Footer";
import Header from "./components/Common/header/Header";
import WhatsAppButton from "./components/Common/WhatsAppButton";
import { trackPageView, startHeartbeat } from "./utils/trackVisit";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInformation } from "./features/slices/userInformation";
import Protected from "./routes/protectedRoute";
import {
  fetchFavoritesList,
  removeAllFavorites,
} from "./features/slices/favourites";
import axios from "axios";


// --- Lazy-loaded route pages (code splitting for SEO/perf) ---
const Home = lazy(() => import("./pages/Home"));
const RequirementForm = lazy(() => import("./pages/RequirementForm"));
const SingleProduct = lazy(() => import("./pages/SingleProduct"));
const HomeLone = lazy(() => import("./pages/HomeLone"));
const PayRentOnline = lazy(() => import("./pages/PayRentOnline"));
const LegalHelp = lazy(() => import("./pages/LegalHelp"));
const RateAndTrends = lazy(() => import("./pages/RateAndTrends"));
const PropertyManagement = lazy(() => import("./pages/PropertyManagement"));
const Investment = lazy(() => import("./pages/Investment"));
const InvestmentExplore = lazy(() => import("./pages/InvestmentExplore"));
const InvestmentAllProduct = lazy(() => import("./pages/InvestmentAllProduct"));
const Project = lazy(() => import("./pages/Project"));
const About = lazy(() => import("./pages/About"));
const Rent = lazy(() => import("./pages/Rent"));
const Sale = lazy(() => import("./pages/Sale"));
const ShetalLeadExtractor = lazy(() => import("./pages/ShetalLeadExtractor"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const PostProperty = lazy(() => import("./pages/PostProperty"));
const PropertyDemand = lazy(() => import("./pages/PropertyDemand"));
const FindAgent = lazy(() => import("./pages/FindAgent"));
const PrivacyPolicy = lazy(() => import("./pages/privacy-policy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const DataDeletion = lazy(() => import("./pages/DataDeletion"));
const ProductSearch = lazy(() => import("./pages/ProductSearch"));
const SingleAgent = lazy(() => import("./pages/SingleAgent"));
const InvestDetails = lazy(() => import("./pages/InvestDetails"));
const Message = lazy(() => import("./pages/Message"));
const HomeLoneOnline = lazy(() => import("./pages/HomeLoneOnline"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogSingle = lazy(() => import("./pages/BlogSingle"));
const BlogCategory = lazy(() => import("./pages/BlogCategory"));
const UnitConverter = lazy(() => import("./pages/UnitConverter"));
const Services = lazy(() => import("./pages/Services"));
const EmiCalculatorPage = lazy(() => import("./pages/EmiCalculatorPage"));
const ROICalculator = lazy(() => import("./pages/ROICalculator"));
const LandPriceEstimator = lazy(() => import("./pages/LandPriceEstimator"));
const PropertyTaxEstimator = lazy(() => import("./pages/PropertyTaxEstimator"));
const RentVsBuy = lazy(() => import("./pages/RentVsBuy"));
const Test = lazy(() => import("./pages/Test"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AllProperties = lazy(() => import("./pages/AllProperties"));
const Gallery = lazy(() => import("./pages/Gallery"));

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

// ── Website traffic tracking: logs a visit per route change, plus a
// recurring heartbeat so the admin dashboard's "active now" count works ──
function TrafficTracker() {
  const { pathname } = useLocation();

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  useEffect(() => {
    const interval = startHeartbeat();
    return () => clearInterval(interval);
  }, []);

  return null;
}

function App(props) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const token = localStorage.getItem("sheetal_token");
  const location = useLocation();

  // Pages that render their own full-bleed layout and should not get the
  // global site Header / Footer / WhatsApp button. ok o
  const NO_CHROME_ROUTES = ["/galery"];
  const hideChrome = NO_CHROME_ROUTES.includes(location.pathname);

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
      <GlobalSEO />
      <TrafficTracker />
      {!hideChrome && <Header />}
      <div className={hideChrome ? "" : "mx-auto w-full bg-white"}>
        <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/requirementForm" element={<RequirementForm />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/data-deletion" element={<DataDeletion />} />
          <Route path="/property/:id" element={<SingleProduct />} />
          <Route path="/homeLone" element={<HomeLone />} />
          <Route path="/About" element={<About />} />
          <Route path="/homeLone/applyOnline" element={<HomeLoneOnline />} />
          <Route path="/payRentOnline" element={<PayRentOnline />} />
          <Route path="/LegalHelp" element={<LegalHelp />} />
          <Route path="/rateandtrend" element={<RateAndTrends />} />
          <Route path="/investment" element={<Investment />} />
          <Route path="/ShetalLeadExtractor" element={<ShetalLeadExtractor />} />
          <Route path="/investment/export" element={<InvestmentExplore />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPassword {...props} />}
          />
          <Route path="/properties" element={<AllProperties />} />
          <Route path="/galery" element={<Gallery />} />
          <Route path="/propertyDemand" element={<PropertyDemand />} />
          <Route path="/property-demand" element={<PropertyDemand />} />
          <Route path="/agents" element={<FindAgent />} />
          <Route path="/agent/:id" element={<SingleAgent />} />
          <Route path="/productSearch" element={<ProductSearch />} />
          <Route path="/my-profile/messages" element={<Message />} />
          <Route path="/investDetail/:id" element={<InvestDetails />} />
          <Route path="/services/management" element={<PropertyManagement />} />
          <Route path="/services" element={<Services />} />
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
        </Suspense>
      </div>
      {!hideChrome && <Footer />}
      {!hideChrome && <WhatsAppButton />}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        theme="colored"
      />
    </div>
  );
}

export default App;