import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import { supabase } from '../lib/supabase';

const { FiPhone, FiCheck, FiX } = FiIcons;

const PhoneVerification = ({ onVerificationComplete, onCancel }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationId, setVerificationId] = useState(null);

  const formatPhoneNumber = (input) => {
    try {
      if (!input) return '';
      // Remove all non-numeric characters except +
      const cleaned = input.replace(/[^\d+]/g, '');
      // If it doesn't start with +, assume US number and add +1
      const withCountryCode = cleaned.startsWith('+') ? cleaned : `+1${cleaned}`;
      const phoneNumber = parsePhoneNumber(withCountryCode);
      if (phoneNumber) {
        return phoneNumber.formatInternational();
      }
      return cleaned;
    } catch (error) {
      return input;
    }
  };

  const handlePhoneChange = (e) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setPhone(formattedNumber);
    setError('');
  };

  const validatePhone = () => {
    try {
      return isValidPhoneNumber(phone);
    } catch (error) {
      return false;
    }
  };

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      setError('');

      if (!validatePhone()) {
        throw new Error('Please enter a valid phone number');
      }

      // Create a verification request in Supabase
      const { data, error: dbError } = await supabase
        .from('phone_verifications_xyz123')
        .insert([
          {
            phone_number: phone,
            verification_code: Math.floor(100000 + Math.random() * 900000).toString(),
            expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes expiry
          }
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      // In a real application, you would send the OTP via SMS here
      // For demo purposes, we'll show it in the console
      console.log('OTP:', data.verification_code);

      setVerificationId(data.id);
      setStep('otp');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      setError('');

      if (!otp || otp.length !== 6) {
        throw new Error('Please enter a valid 6-digit OTP');
      }

      // Verify OTP in Supabase
      const { data, error: dbError } = await supabase
        .from('phone_verifications_xyz123')
        .select()
        .match({ id: verificationId, verification_code: otp })
        .single();

      if (dbError) throw new Error('Invalid OTP');

      if (!data) {
        throw new Error('Verification failed');
      }

      const expiresAt = new Date(data.expires_at);
      if (expiresAt < new Date()) {
        throw new Error('OTP has expired');
      }

      // Update verification status
      await supabase
        .from('phone_verifications_xyz123')
        .update({ verified: true })
        .eq('id', verificationId);

      onVerificationComplete(phone);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-auto"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        {step === 'phone' ? 'Phone Verification' : 'Enter OTP'}
      </h2>

      {step === 'phone' ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiPhone} className="text-gray-400" />
              </div>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={handlePhoneChange}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="+1 (555) 555-5555"
              />
              {phone && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {validatePhone() ? (
                    <SafeIcon icon={FiCheck} className="text-green-500" />
                  ) : (
                    <SafeIcon icon={FiX} className="text-red-500" />
                  )}
                </div>
              )}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 mt-1">{error}</p>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={onCancel}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSendOTP}
              disabled={!validatePhone() || loading}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                validatePhone() && !loading
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Sending...
                </span>
              ) : (
                'Send OTP'
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              Enter OTP sent to {phone}
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(value);
                setError('');
              }}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 mt-1">{error}</p>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setStep('phone');
                setOtp('');
                setError('');
              }}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back
            </button>
            <button
              onClick={handleVerifyOTP}
              disabled={otp.length !== 6 || loading}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                otp.length === 6 && !loading
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Verifying...
                </span>
              ) : (
                'Verify OTP'
              )}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PhoneVerification;