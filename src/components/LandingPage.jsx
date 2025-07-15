import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUsers, FiBookOpen, FiTarget, FiTrendingUp, FiCheck, FiStar, FiArrowRight, FiPlay, FiGlobe, FiAward, FiHeart, FiMail, FiPhone, FiMapPin } = FiIcons;

const LandingPage = () => {
  const [email, setEmail] = useState('');

  const features = [
    {
      icon: FiUsers,
      title: 'Expert Tutors',
      description: 'Learn from certified educators with years of experience in standardized test preparation.'
    },
    {
      icon: FiBookOpen,
      title: 'Comprehensive Curriculum',
      description: 'Access complete study materials for SAT, ACT, PSAT, and AP subjects with practice tests.'
    },
    {
      icon: FiTarget,
      title: 'Personalized Learning',
      description: 'Get customized study plans based on your strengths, weaknesses, and target scores.'
    },
    {
      icon: FiTrendingUp,
      title: 'Track Progress',
      description: 'Monitor your improvement with detailed analytics and performance insights.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      grade: '12th Grade',
      score: 'SAT: 1540',
      text: 'EduAdmin helped me improve my SAT score by 200 points! The personalized approach made all the difference.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      grade: '11th Grade',
      score: 'ACT: 34',
      text: 'The tutors are amazing and the practice tests are exactly like the real exam. Highly recommend!',
      rating: 5
    },
    {
      name: 'Emily Davis',
      grade: '10th Grade',
      score: 'PSAT: 1450',
      text: 'Started early with EduAdmin and already seeing great results. The dashboard is so helpful to track progress.',
      rating: 5
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Students Tutored' },
    { number: '250+', label: 'Average Score Increase' },
    { number: '95%', label: 'Success Rate' },
    { number: '50+', label: 'Expert Tutors' }
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
    alert('Thank you for subscribing!');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Ace Your
                <span className="text-yellow-400"> SAT, ACT & AP </span>
                Exams
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Join thousands of students who've improved their scores with our expert tutoring and personalized learning approach.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition-colors flex items-center justify-center"
                >
                  Start Learning Today
                  <SafeIcon icon={FiArrowRight} className="ml-2" />
                </Link>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-900 transition-colors flex items-center justify-center">
                  <SafeIcon icon={FiPlay} className="mr-2" />
                  Watch Demo
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 text-gray-900">
                <div className="flex items-center mb-6">
                  <SafeIcon icon={FiTarget} className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-bold">Score Improvement</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average SAT Increase</span>
                    <span className="text-2xl font-bold text-green-600">+250 pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average ACT Increase</span>
                    <span className="text-2xl font-bold text-green-600">+4 pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="text-2xl font-bold text-blue-600">95%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose EduAdmin?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform combines expert instruction with cutting-edge technology to deliver personalized learning experiences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <SafeIcon icon={feature.icon} className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600">
              Real results from real students who achieved their goals with EduAdmin.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <SafeIcon key={i} icon={FiStar} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.grade}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-blue-600">{testimonial.score}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Boost Your Test Scores?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of students who have already achieved their dream scores with EduAdmin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition-colors flex items-center justify-center"
              >
                Get Started Free
                <SafeIcon icon={FiArrowRight} className="ml-2" />
              </Link>
              <Link
                to="/admin"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-900 transition-colors flex items-center justify-center"
              >
                View Demo Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-300 mb-8">
              Get the latest test prep tips, study guides, and exclusive offers delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-blue-400">EduAdmin</h3>
              <p className="text-gray-300 mb-4">
                Empowering students to achieve their academic goals through personalized test preparation.
              </p>
              <div className="flex space-x-4">
                <SafeIcon icon={FiMail} className="w-6 h-6 text-gray-300 hover:text-blue-400 cursor-pointer" />
                <SafeIcon icon={FiPhone} className="w-6 h-6 text-gray-300 hover:text-blue-400 cursor-pointer" />
                <SafeIcon icon={FiGlobe} className="w-6 h-6 text-gray-300 hover:text-blue-400 cursor-pointer" />
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Courses</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-blue-400">SAT Prep</a></li>
                <li><a href="#" className="hover:text-blue-400">ACT Prep</a></li>
                <li><a href="#" className="hover:text-blue-400">PSAT Prep</a></li>
                <li><a href="#" className="hover:text-blue-400">AP Subjects</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-blue-400">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400">Our Tutors</a></li>
                <li><a href="#" className="hover:text-blue-400">Success Stories</a></li>
                <li><a href="#" className="hover:text-blue-400">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-blue-400">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-400">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 EduAdmin. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;