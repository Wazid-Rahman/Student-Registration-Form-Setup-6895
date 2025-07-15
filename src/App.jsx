import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import StudentOnboarding from './components/StudentOnboarding';
import AdminDashboard from './components/AdminDashboard';
import PaymentForm from './components/PaymentForm';
import PaymentSuccess from './components/PaymentSuccess';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-xl font-bold text-blue-600">
                    EduAdmin
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/"
                    className="inline-flex items-center px-1 pt-1 text-gray-600 hover:text-gray-900"
                  >
                    Home
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-1 pt-1 text-gray-600 hover:text-gray-900"
                  >
                    Student Registration
                  </Link>
                  <Link
                    to="/admin"
                    className="inline-flex items-center px-1 pt-1 text-gray-600 hover:text-gray-900"
                  >
                    Admin Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<StudentOnboarding />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/payment" element={<PaymentForm />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;