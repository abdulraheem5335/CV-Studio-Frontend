import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiArrowRight, FiAlertCircle, FiCheck, FiArrowLeft } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { useAuthStore } from '../store/authStore';
import { 
  ExplorerIcon, CreatorIcon, SocialiteIcon, AchieverIcon 
} from '../components/ui';
import toast from 'react-hot-toast';

const userTypes = [
  { id: 'explorer', label: 'Explorer', Icon: ExplorerIcon, desc: 'Discover every corner of campus' },
  { id: 'creator', label: 'Creator', Icon: CreatorIcon, desc: 'Share content & inspire others' },
  { id: 'socialite', label: 'Socialite', Icon: SocialiteIcon, desc: 'Connect with the community' },
  { id: 'achiever', label: 'Achiever', Icon: AchieverIcon, desc: 'Complete quests & earn rewards' },
];

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    userType: 'explorer',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserTypeSelect = (type) => {
    setFormData({ ...formData, userType: type });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await register({
      email: formData.email,
      password: formData.password,
      nickname: formData.nickname,
      userType: formData.userType,
    });
    
    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/game');
    } else {
      toast.error(result.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0f]">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-blue-600/20" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <HiSparkles className="text-white text-2xl" />
            </div>
            <span className="font-bold text-xl text-white">NUST Campus</span>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Begin your<br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              campus adventure
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg max-w-md">
            Create your account and unlock the full NUST experience with quests, events, and an amazing community.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <HiSparkles className="text-white text-xl" />
            </div>
            <span className="font-bold text-lg text-white">NUST Campus</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2 text-center lg:text-left">
              {step === 1 ? 'Create account' : 'Choose your style'}
            </h2>
            <p className="text-gray-400 text-center lg:text-left">
              {step === 1 ? 'Fill in your details to get started' : 'Pick what describes you best'}
            </p>

            {/* Progress Steps */}
            <div className="flex items-center gap-2 mt-6">
              <div className={`flex-1 h-1 rounded-full transition-colors ${step >= 1 ? 'bg-purple-500' : 'bg-white/10'}`} />
              <div className={`flex-1 h-1 rounded-full transition-colors ${step >= 2 ? 'bg-purple-500' : 'bg-white/10'}`} />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3"
            >
              <FiAlertCircle className="text-red-400 text-lg flex-shrink-0" />
              <span className="text-red-400 text-sm">{error}</span>
            </motion.div>
          )}

          {/* Step 1: Account Info */}
          {step === 1 && (
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleNext}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@nust.edu.pk"
                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nickname</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    placeholder="Your anonymous name"
                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-colors"
                    maxLength={30}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-colors"
                    required
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-shadow mt-6"
              >
                Continue
                <FiArrowRight />
              </motion.button>
            </motion.form>
          )}

          {/* Step 2: User Type Selection */}
          {step === 2 && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                {userTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    type="button"
                    onClick={() => handleUserTypeSelect(type.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative p-4 rounded-xl border transition-all text-left ${
                      formData.userType === type.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    {formData.userType === type.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                        <FiCheck className="text-white text-xs" />
                      </div>
                    )}
                    <div className="mb-2">
                      <type.Icon size={28} color={formData.userType === type.id ? '#a855f7' : '#9ca3af'} />
                    </div>
                    <div className="text-sm font-semibold text-white">{type.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{type.desc}</div>
                  </motion.button>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <motion.button
                  type="button"
                  onClick={() => setStep(1)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex-1 py-3.5 bg-white/5 border border-white/10 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                >
                  <FiArrowLeft />
                  Back
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex-1 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Create Account'}
                </motion.button>
              </div>
            </motion.form>
          )}

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-400">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link 
              to="/" 
              className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
