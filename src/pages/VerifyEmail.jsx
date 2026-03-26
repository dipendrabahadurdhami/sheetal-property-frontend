import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setLogin } from '../features/slices/auth';
import { fetchUserInformation } from '../features/slices/userInformation';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const verifyUser = async () => {
            const params = new URLSearchParams(location.search);
            const queryURL = params.get('queryURL');

            if (!queryURL) {
                toast.error("Invalid verification link");
                return navigate('/');
            }

            try {
                // This hits your Laravel backend verify route
                const res = await axios.get(queryURL);

                if (res.data?.token) {
                    // Save token and login automatically
                    localStorage.setItem("sheetal_token", res.data.token);
                    dispatch(setLogin({ 
                        token: res.data.token, 
                        user_name: res.data.user_name 
                    }));
                    
                    toast.success("Email verified and logged in!");
                    dispatch(fetchUserInformation());
                    navigate('/'); // Go to dashboard/home
                }
            } catch (err) {
                toast.error(err.response?.data?.message || "Verification failed");
                navigate('/login');
            }
        };

        verifyUser();
    }, [location, navigate, dispatch]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <FaSpinner className="animate-spin text-red-700 text-5xl mb-4" />
            <h2 className="text-xl font-bold uppercase">Verifying your account...</h2>
            <p className="text-gray-500">Please wait a moment.</p>
        </div>
    );
};

export default VerifyEmail;