import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

const { FiCreditCard, FiDollarSign, FiLock } = FiIcons;

const stripePromise = loadStripe('your_publishable_key');

const PaymentForm = ({ courseId, courseName, price }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please login to continue');

      // Create payment record in Supabase
      const { data: payment, error: paymentError } = await supabase
        .from('payments_xyz123')
        .insert([
          {
            user_id: user.id,
            course_id: courseId,
            amount: price,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: payment.id,
          courseId,
          courseName,
          price,
          userId: user.id,
          email: user.email
        }),
      });

      const session = await response.json();

      // Redirect to Stripe checkout
      const stripe = await stripePromise;
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (stripeError) throw stripeError;

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8"
    >
      <div className="flex items-center justify-center mb-6">
        <SafeIcon icon={FiCreditCard} className="w-12 h-12 text-blue-600" />
      </div>

      <h2 className="text-2xl font-bold text-center mb-6">{courseName}</h2>

      <div className="flex justify-center items-center mb-8">
        <SafeIcon icon={FiDollarSign} className="w-6 h-6 text-gray-600 mr-2" />
        <span className="text-3xl font-bold">${price}</span>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-4 px-8 rounded-lg hover:bg-blue-700 
                 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors
                 flex items-center justify-center"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-4 border-white border-t-transparent" />
        ) : (
          <>
            <SafeIcon icon={FiLock} className="w-5 h-5 mr-2" />
            Proceed to Payment
          </>
        )}
      </button>

      <p className="text-sm text-gray-500 text-center mt-4">
        Secure payment powered by Stripe
      </p>
    </motion.div>
  );
};

export default PaymentForm;