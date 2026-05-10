import Chat from "./pages/Chat"
import Header from "./components/Header"
import Login from "./forms/Login"
import Home from "./components/Home"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from "./components/Footer"
import Register from "./forms/Register"
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ChatLayout from "./pages/ChatLayout";
import Profile from "./pages/Profile";
import CreateGuide from "./forms/CreateGuide";
import BecomeDoctor from "./forms/BecomeDoctor";
import MedicalGuides from "./pages/Guides";
import Team from "./pages/Team"
import DoctorDetail from "./pages/DoctorDetail";
import Favorites from "./pages/Favorites";
import Services from "./components/Services";
import MedicalGuideDetail from "./components/MedicalGuideDetail";

function App() {

  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/team" element={<Team />} />
          <Route path="/favorites" element={<Favorites/>}/>
          <Route path="/services" element={<Services/>}/>
          <Route path="/doctors/:id" element={<DoctorDetail />} />
          <Route path="/guides" element={<MedicalGuides />} />
          <Route path="/guide-detail/:id" element={<MedicalGuideDetail/>}/>
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Chat />} />
            <Route path=":chatId" element={<Chat />} />
          </Route>
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route
            path="/create-guide"
            element={
              <ProtectedRoute>
                <CreateGuide />
              </ProtectedRoute>
            }
          />
          <Route
            path="/become-doctor"
            element={
              <ProtectedRoute>
                <BecomeDoctor />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      <Footer />
    </AuthProvider>
  )
}

export default App
