import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { supabase } from '../lib/supabase';

const { FiCheckCircle } = FiIcons;

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    const updatePaymentStatus = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        if (!sessionId) throw new Error('No session ID found');

        // Update payment status in Supabase
        const { data, error: updateError } = await supabase
          .from('payments_xyz123')
          .update({ status: 'completed' })
          .eq('stripe_session_id', sessionId)
          .select()
          .single();

        if (updateError) throw updateError;
        setPayment(data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    updatePaymentStatus();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-500 p-6 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <SafeIcon
          icon={FiCheckCircle}
          className="w-16 h-16 text-green-500 mx-auto mb-6"
        />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your payment. Your transaction has been completed successfully.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600">
            Transaction ID: {payment?.id}
          </p>
          <p className="text-sm text-gray-600">
            Amount: ${payment?.amount}
          </p>
        </div>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 
                   transition-colors inline-flex items-center"
        >
          Return to Dashboard
        </button>
      </div>
    </motion.div>
  );
};

export default PaymentSuccess;