import React, { useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../Context/AppContext';

const Verify = () => {
  const navigate = useNavigate();
  const  {backendUrl} = useContext (AppContext);
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id'); // Retrieve session_id from URL

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const { data } = await axios.post(backendUrl + '/api/user/verify-payment', {sessionId})

        if (data.success) {
          toast.success('Payment Successful! Credits added to your account.');
            setTimeout(() => {
            navigate('/'); // Redirect to home page
          }, 3000);
        } else {
          toast.error(data.message || 'Payment verification failed.');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        toast.error('An error occurred during payment verification.');
      }
    };

    if (sessionId) {
      verifyPayment(); // Trigger payment verification if sessionId exists
    } else {
      toast.error('Invalid session. Please try again.');
      navigate('/'); // Redirect to home page on invalid session
    }
  }, [sessionId, navigate]);

  return (
    <div className="text-center">
      <h1>Thank You for Your Purchase!</h1>
      <p>We are verifying your payment. You will be redirected shortly.</p>
    </div>
  );
};

export default Verify;
