import Chat from "./Chat"
import Header from "./Header"
import Login from "./forms/Login"
import Home from "./Home"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from "./Footer"
import Register from "./forms/Register"
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import ChatLayout from "./ChatLayout";
import Profile from "./Profile";
import CreateGuide from "./CreateGuide";
import BecomeDoctor from "./BecomeDoctor";
import MedicalGuides from "./Guides";
import Team from "./Team"
import DoctorDetail from "./DoctorDetail";
import Favorites from "./Favorites";
import Services from "./Services";

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
