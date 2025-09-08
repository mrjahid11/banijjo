// import logo from "./logo.svg";
// import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./layout/navbar";
import { Footer } from "./layout/footer";
import Home from "./pages/Home";
import SignUp from "./pages/Signup";
import Newsfeed from "./pages/community/Newsfeed";
import CreateCommunity from "./pages/community/CreateCommunity";
import CreatePost from "./pages/community/CreatePost";
import MyCommunities from "./pages/community/MyCommunities";
import Communities from "./pages/community/Communities";
import EmailVerification from "./pages/EmailVerification";
import SignIn from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import PortfolioManager from "./pages/PortfolioManager";
import ForgotPassword from "./pages/ForgotPassword";
import Education from "./pages/Education";
import AdminCourses from "./pages/education/AdminCourses";
import EducationHub from "./pages/education/EducationHub";
import YourCourses from "./pages/education/YourCourses";
import ProtectedRoute from "./components/ProtectedRoute";

import Products from "./User/products/Products";
import FundementalGraphs from "./User/products/FundementalGraphs";
import YieldCurves from "./User/products/YieldCurves";
import Options from "./User/products/Options";
import Portfolios from "./User/products/Portfolios";

import Community from "./User/community/Community";
import Idea from "./User/community/Idea";

import Stocks from "./User/products/screeners/Stocks";
import EFTs from "./User/products/screeners/EFTs";
import Bonds from "./User/products/screeners/Bonds";
import Crypto from "./User/products/screeners/Crypto";

import Earnings from "./User/products/calendars/Earnings";
import IPO from "./User/products/calendars/IPO";
import Dividends from "./User/products/calendars/Dividends";

import Users from "./Admin/Users";
import BlogList from "./pages/blog/BlogList";
import BlogCreate from "./pages/blog/BlogCreate";
import MarketBuy from "./pages/market/MarketBuy";
import AdminMonitor from "./pages/market/AdminMonitor";
import MyShare from "./pages/market/MyShare";
import BrokerDashboard from "./pages/market/BrokerDashboard";
import HelpCenter from "./pages/HelpCenter";
import HelpDashboard from "./pages/admin/HelpDashboard";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          {/* Landing pages */}
          <Route exact path="/" element={<Home />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route
            exact
            path="/signup/emailverification"
            element={<EmailVerification />}
          />
          <Route exact path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route exact path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route exact path="/portfolios" element={<ProtectedRoute><PortfolioManager /></ProtectedRoute>} />
          <Route exact path="/forgot-password" element={<ForgotPassword />} />
          <Route exact path="/education" element={<Education />} />
          <Route exact path="/education/hub" element={<ProtectedRoute><EducationHub /></ProtectedRoute>} />
          <Route exact path="/education/your-courses" element={<ProtectedRoute><YourCourses /></ProtectedRoute>} />
          <Route exact path="/admin/education/courses" element={<ProtectedRoute><AdminCourses /></ProtectedRoute>} />

          {/* Products pages  */}
          <Route exact path="/products" element={<Products />} />

          {/* products/calendars */}
          <Route
            exact
            path="/products/calenders/earnings"
            element={<Earnings />}
          />
          <Route exact path="/products/calenders/ipo" element={<IPO />} />
          <Route
            exact
            path="/products/calenders/dividends"
            element={<Dividends />}
          />

          {/* products/screeners */}
          <Route exact path="/products/screeners/stocks" element={<Stocks />} />
          <Route exact path="/products/screeners/efts" element={<EFTs />} />
          <Route exact path="/products/screeners/bonds" element={<Bonds />} />
          <Route exact path="/products/screeners/crypto" element={<Crypto />} />

          {/* products/fundementalgraphs */}
          <Route
            exact
            path="/products/fundementalgraphs"
            element={<FundementalGraphs />}
          />
          <Route exact path="/products/yieldcurves" element={<YieldCurves />} />
          <Route exact path="/products/options" element={<Options />} />
          <Route exact path="/products/portfolios" element={<Portfolios />} />

          {/* Community pages  */}
          <Route exact path="/community" element={<Community />} />
          <Route exact path="/community/newsfeed" element={<Newsfeed />} />
          <Route exact path="/community/create" element={<ProtectedRoute><CreateCommunity /></ProtectedRoute>} />
          <Route exact path="/community/post/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
          <Route exact path="/community/mine" element={<ProtectedRoute><MyCommunities /></ProtectedRoute>} />
          <Route exact path="/community/all" element={<Communities />} />
          <Route exact path="/community/ideas" element={<Idea />} />

          {/* Markets pages  */}
          <Route exact path="/market" element={<ProtectedRoute><MarketBuy /></ProtectedRoute>} />
          <Route exact path="/admin/market" element={<ProtectedRoute><AdminMonitor /></ProtectedRoute>} />
          <Route exact path="/market/my-share" element={<ProtectedRoute><MyShare /></ProtectedRoute>} />
          <Route exact path="/brokers" element={<ProtectedRoute roles={["broker","admin"]}><BrokerDashboard /></ProtectedRoute>} />
          {/* Blog */}
          <Route exact path="/blog" element={<BlogList />} />
          <Route exact path="/blog/create" element={<ProtectedRoute><BlogCreate /></ProtectedRoute>} />
          {/* Help */}
          <Route exact path="/more/help" element={<ProtectedRoute><HelpCenter /></ProtectedRoute>} />
          <Route exact path="/admin/help" element={<ProtectedRoute><HelpDashboard /></ProtectedRoute>} />
          {/* More pages */}
          {/* Admin panel */}
          <Route exact path="/admin/users" element={<Users />} />
          {/* Auth */}
          <Route exact path="/signin" element={<SignIn />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
