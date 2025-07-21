import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loginuser } from '../../apicalls/users';
import { message } from 'antd';
import ReCAPTCHA from 'react-google-recaptcha';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, LockOutlined, ShoppingCartOutlined, SafetyOutlined } from '@ant-design/icons';

function Login() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = (values) => {
    const newErrors = {};
    if (!values.email || !/^[a-zA-Z0-9._%+-]+@iiit\.ac\.in$/.test(values.email)) {
      newErrors.email = "Please enter a valid @iiit.ac.in email address";
    }

    if (!values.password || values.password.length < 1) {
      newErrors.password = "Password is required";
    }

    if (!recaptchaToken) {
      newErrors.recaptcha = "Please complete the security verification";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const loginData = {
        ...values,
        recaptchaToken: recaptchaToken
      };

      console.log("Attempting login with:", { email: loginData.email });
      
      const response = await Loginuser(loginData);
      
      console.log("Login response:", response);
      
      if (response.success && response.data && response.data.token) {
        console.log("Login successful, token received");
        localStorage.setItem('token', response.data.token);
        message.success('Welcome back!');
        
        window.location.href = '/';
      } else {
        console.log("Login failed:", response.message);
        setErrors({ login: response.message || 'Login failed' });
        message.error(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ login: 'An error occurred during login. Please try again.' });
      message.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
    if (errors.recaptcha) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.recaptcha;
        return newErrors;
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const values = Object.fromEntries(formData.entries());
    
    if (validateForm(values)) {
      onFinish(values);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center">
            <ShoppingCartOutlined className="h-12 w-12 text-indigo-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">IIITH Marketplace</h1>
              <p className="text-sm text-gray-600">Campus Buy & Sell Platform</p>
            </div>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your IIIT email"
                  className={`block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none sm:text-sm ${
                    errors.email
                      ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                />
                <UserOutlined className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  className={`block w-full appearance-none rounded-md border px-3 py-2 pr-10 placeholder-gray-400 shadow-sm focus:outline-none sm:text-sm ${
                    errors.password
                      ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeInvisibleOutlined className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeTwoTone className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* reCAPTCHA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Security Verification
              </label>
              <div className={`flex justify-center p-4 rounded-md border ${
                errors.recaptcha ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  onChange={handleRecaptchaChange}
                  onExpired={() => setRecaptchaToken("")}
                  theme="light"
                />
              </div>
              {errors.recaptcha && (
                <p className="mt-1 text-sm text-red-600">{errors.recaptcha}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            {/* Login Error */}
            {errors.login && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{errors.login}</p>
                  </div>
                </div>
              </div>
            )}
          </form>

        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            This platform is exclusively for IIIT Hyderabad students and faculty.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;