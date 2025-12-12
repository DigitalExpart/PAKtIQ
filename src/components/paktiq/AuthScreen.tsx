import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type AuthScreenProps = {
  onSuccess: () => void;
};

export default function AuthScreen({ onSuccess }: AuthScreenProps) {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password, formData.fullName);
        // Show success message
        alert('Account created! Please check your email to verify your account (if email verification is enabled).');
      } else {
        await signIn(formData.email, formData.password);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3C2B63] via-[#9163F2] to-[#3C2B63] text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-[#FFD88A]/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-32 right-10 w-40 h-40 bg-[#96E6B3]/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-12 max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center mb-8"
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-[#FFD88A] blur-xl opacity-50"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Sparkles className="w-16 h-16 relative z-10" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-lg opacity-90">
            {isSignUp ? 'Start your commitment journey' : 'Continue your progress'}
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 text-center"
            >
              {error}
            </motion.div>
          )}

          {isSignUp && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-70" />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFD88A]"
                required={isSignUp}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-70" />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFD88A]"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-70" />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFD88A]"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#FFD88A] to-[#96E6B3] text-[#3C2B63] py-4 rounded-2xl flex items-center justify-center gap-3 hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-[#3C2B63] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="text-lg font-semibold">
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </motion.form>

        {/* Toggle Sign In/Sign Up */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-white/80 hover:text-white transition-colors"
          >
            {isSignUp ? (
              <>Already have an account? <span className="font-semibold text-[#FFD88A]">Sign In</span></>
            ) : (
              <>Don't have an account? <span className="font-semibold text-[#FFD88A]">Sign Up</span></>
            )}
          </button>
        </motion.div>

        {/* Guest Mode (Optional) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-4 text-center"
        >
          <button
            type="button"
            onClick={() => {
              // For testing, you can skip to dashboard
              // Remove this in production
              console.log('Guest mode - for testing only');
            }}
            className="text-white/60 text-sm hover:text-white/80 transition-colors"
          >
            Continue as guest (testing)
          </button>
        </motion.div>
      </div>
    </div>
  );
}

