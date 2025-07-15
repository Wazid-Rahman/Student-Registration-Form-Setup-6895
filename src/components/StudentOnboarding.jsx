import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import { supabase } from '../lib/supabase';
import PhoneVerification from './PhoneVerification';
import { isValidEmail, getEmailValidationMessage } from '../utils/validation';

const { FiUser, FiMail, FiPhone, FiMapPin, FiBook, FiCheckSquare, FiArrowRight, FiLock, FiCheck, FiX } = FiIcons;

const StudentOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [errors, setErrors] = useState({
    studentEmail: '',
    parentEmail: ''
  });
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    studentOtp: '',
    grade: '',
    schoolName: '',
    city: '',
    zipcode: '',
    subjects: [],
    otherSubjects: '',
    parentName: '',
    parentEmail: '',
    parentPhone: ''
  });

  const validateEmail = (email, field) => {
    const message = getEmailValidationMessage(email);
    setErrors(prev => ({
      ...prev,
      [field]: message
    }));
    return !message;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (name === 'studentEmail' || name === 'parentEmail') {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEmailBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'studentEmail' || name === 'parentEmail') {
      validateEmail(value, name);
    }
  };

  const handlePhoneVerificationComplete = (verifiedPhone) => {
    setFormData(prev => ({
      ...prev,
      parentPhone: verifiedPhone
    }));
    setPhoneVerified(true);
    setShowPhoneVerification(false);
  };

  const handlePhoneVerificationCancel = () => {
    setShowPhoneVerification(false);
  };

  const handleSubjectChange = (subject) => {
    setFormData(prev => {
      const subjects = [...prev.subjects];
      if (subjects.includes(subject)) {
        return { ...prev, subjects: subjects.filter(s => s !== subject) };
      } else {
        return { ...prev, subjects: [...subjects, subject] };
      }
    });
  };

  const validateStep = () => {
    if (currentStep === 1) {
      const isStudentEmailValid = validateEmail(formData.studentEmail, 'studentEmail');
      return formData.studentName && isStudentEmailValid && formData.studentOtp;
    } else if (currentStep === 2) {
      return formData.grade && formData.schoolName && formData.city && formData.zipcode && formData.subjects.length > 0;
    } else if (currentStep === 3) {
      const isParentEmailValid = validateEmail(formData.parentEmail, 'parentEmail');
      return formData.parentName && isParentEmailValid && formData.parentPhone && phoneVerified;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // First create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.studentEmail,
        password: formData.studentOtp,
      });

      if (authError) throw authError;

      // Create student profile
      const { data: studentData, error: studentError } = await supabase
        .from('students_xyz123')
        .insert([
          {
            user_id: authData.user.id,
            full_name: formData.studentName,
            grade: formData.grade,
            school_name: formData.schoolName,
            city: formData.city,
            zipcode: formData.zipcode,
            subjects: formData.subjects,
            other_subjects: formData.otherSubjects
          }
        ])
        .select()
        .single();

      if (studentError) throw studentError;

      // Create parent info
      const { error: parentError } = await supabase
        .from('parent_info_xyz123')
        .insert([
          {
            student_id: studentData.id,
            full_name: formData.parentName,
            email: formData.parentEmail,
            phone: formData.parentPhone
          }
        ]);

      if (parentError) throw parentError;

      alert('Registration completed successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const subjects = [
    'SAT', 'ACT', 'PSAT', 'AP Calculus AB', 'AP Calculus BC', 'AP Statistics',
    'AP Biology', 'AP Chemistry', 'AP Physics', 'AP English Language', 'AP English Literature'
  ];

  const grades = ['9th Grade', '10th Grade', '11th Grade', '12th Grade'];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold text-gray-900">Student Information</h2>

            <div>
              <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiUser} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="studentName"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  className="pl-10 py-2 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="studentEmail" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiMail} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="studentEmail"
                  name="studentEmail"
                  value={formData.studentEmail}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  className={`pl-10 py-2 block w-full shadow-sm focus:ring-blue-500 border-gray-300 rounded-md ${
                    errors.studentEmail ? 'border-red-500' : 'focus:border-blue-500'
                  }`}
                  placeholder="john.doe@example.com"
                  required
                />
                {formData.studentEmail && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {errors.studentEmail ? (
                      <SafeIcon icon={FiX} className="text-red-500" />
                    ) : (
                      <SafeIcon icon={FiCheck} className="text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {errors.studentEmail && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.studentEmail}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="studentOtp" className="block text-sm font-medium text-gray-700">
                Create Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiLock} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  id="studentOtp"
                  name="studentOtp"
                  value={formData.studentOtp}
                  onChange={handleChange}
                  className="pl-10 py-2 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                  placeholder="Enter a secure password"
                  required
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold text-gray-900">Academic Information</h2>

            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                Current Grade
              </label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Grade</option>
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700">
                School Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiBook} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="schoolName"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  className="pl-10 py-2 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                  placeholder="High School Name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SafeIcon icon={FiMapPin} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="pl-10 py-2 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                    placeholder="City"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700">
                  Zipcode
                </label>
                <input
                  type="text"
                  id="zipcode"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  className="mt-1 py-2 px-3 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                  placeholder="Zipcode"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subjects of Interest
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {subjects.map((subject) => (
                  <div key={subject} className="flex items-center">
                    <input
                      id={`subject-${subject}`}
                      name="subjects"
                      type="checkbox"
                      checked={formData.subjects.includes(subject)}
                      onChange={() => handleSubjectChange(subject)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`subject-${subject}`}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {subject}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="otherSubjects" className="block text-sm font-medium text-gray-700">
                Other Subjects (Optional)
              </label>
              <textarea
                id="otherSubjects"
                name="otherSubjects"
                value={formData.otherSubjects}
                onChange={handleChange}
                rows={2}
                className="mt-1 py-2 px-3 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                placeholder="List any other subjects you're interested in..."
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold text-gray-900">Parent/Guardian Information</h2>

            <div>
              <label htmlFor="parentName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiUser} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="parentName"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleChange}
                  className="pl-10 py-2 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                  placeholder="Parent/Guardian Name"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiMail} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="parentEmail"
                  name="parentEmail"
                  value={formData.parentEmail}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  className={`pl-10 py-2 block w-full shadow-sm focus:ring-blue-500 border-gray-300 rounded-md ${
                    errors.parentEmail ? 'border-red-500' : 'focus:border-blue-500'
                  }`}
                  placeholder="parent@example.com"
                  required
                />
                {formData.parentEmail && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {errors.parentEmail ? (
                      <SafeIcon icon={FiX} className="text-red-500" />
                    ) : (
                      <SafeIcon icon={FiCheck} className="text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {errors.parentEmail && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.parentEmail}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700">
                Phone Number {phoneVerified && <span className="text-green-500 ml-2">(Verified)</span>}
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiPhone} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="parentPhone"
                  name="parentPhone"
                  value={formData.parentPhone}
                  onChange={handleChange}
                  className="pl-10 py-2 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                  placeholder="(123) 456-7890"
                  required
                  readOnly={phoneVerified}
                />
                <button
                  type="button"
                  onClick={() => setShowPhoneVerification(true)}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-sm ${
                    phoneVerified ? 'text-green-500' : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  {phoneVerified ? 'Verified' : 'Verify'}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                By completing registration, you agree to our Terms of Service and Privacy Policy.
                We will use this information to create your account and contact you regarding your
                student's progress.
              </p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white">
            <h1 className="text-2xl font-bold">Student Registration</h1>
            <p className="mt-1 text-blue-100">
              Join our test prep program to achieve your target scores
            </p>
          </div>

          {/* Progress Steps */}
          <div className="px-8 pt-6">
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step === currentStep
                        ? 'bg-blue-600 text-white'
                        : step < currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step < currentStep ? (
                      <SafeIcon icon={FiCheckSquare} className="w-5 h-5" />
                    ) : (
                      step
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {step === 1
                      ? 'Student Info'
                      : step === 2
                      ? 'Academic Details'
                      : 'Parent Info'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Form Steps */}
          <div className="px-8 pb-8">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <button
                  onClick={handlePrevious}
                  className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Previous
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={!validateStep()}
                  className={`ml-auto py-2 px-4 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    validateStep()
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next
                  <SafeIcon icon={FiArrowRight} className="ml-2 inline-block" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading || !validateStep()}
                  className={`ml-auto py-2 px-4 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    validateStep() && !loading
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                      Submitting...
                    </>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {showPhoneVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <PhoneVerification
            onVerificationComplete={handlePhoneVerificationComplete}
            onCancel={handlePhoneVerificationCancel}
          />
        </div>
      )}
    </div>
  );
};

export default StudentOnboarding;