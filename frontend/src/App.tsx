import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Scanner from './pages/Scanner';
import Result from './pages/Result';
import History from './pages/History';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background text-textMain">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/results/:id" element={<Result />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/login" element={<div className="p-20 text-center">Login Page (Coming Soon)</div>} />
            <Route path="/register" element={<div className="p-20 text-center">Register Page (Coming Soon)</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
