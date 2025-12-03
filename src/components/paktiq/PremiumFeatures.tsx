import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Sparkles, Zap, Shield, BarChart3, Brain, Users } from 'lucide-react';

type PremiumFeaturesProps = {
  onBack: () => void;
  onUpgrade: () => void;
};

export default function PremiumFeatures({ onBack, onUpgrade }: PremiumFeaturesProps) {
  const features = [
    { icon: Zap, title: 'Unlimited Pakts', description: 'Create as many commitments as you want' },
    { icon: BarChart3, title: 'Unlimited Milestones', description: 'Break down goals into detailed steps' },
    { icon: Sparkles, title: 'Streak Recovery', description: 'Don\'t lose your progress on tough days' },
    { icon: BarChart3, title: 'Full Insights Dashboard', description: 'Deep analytics and trends' },
    { icon: Brain, title: 'AI Suggestions', description: 'Personalized recommendations (coming soon)' },
    { icon: Shield, title: 'Priority Support', description: 'Get help when you need it most' },
  ];

  const bundles = [
    {
      name: 'Single App',
      price: '$4.99',
      period: '/mo',
      apps: ['PaktIQ'],
      savings: null,
      color: 'from-[#FFD88A] to-[#FF8A8A]',
    },
    {
      name: 'Two Apps Bundle',
      price: '$7.99',
      period: '/mo',
      original: '$9.98',
      apps: ['PaktIQ', 'One2OneLove or MyMatchIQ'],
      savings: 'Save 20%',
      color: 'from-[#96E6B3] to-[#9163F2]',
      popular: true,
    },
    {
      name: 'Complete Suite',
      price: '$9.99',
      period: '/mo',
      original: '$14.97',
      apps: ['PaktIQ', 'One2OneLove', 'MyMatchIQ'],
      savings: 'Save 33%',
      color: 'from-[#9163F2] to-[#3C2B63]',
      best: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F4F6] to-[#E8E8EA]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#3C2B63] to-[#9163F2] text-white p-6">
        <div className="container mx-auto max-w-md">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="p-2 bg-white/10 backdrop-blur rounded-full hover:bg-white/20 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl mb-1">Upgrade to Pro</h1>
              <p className="text-sm opacity-80">Unlock your full potential</p>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
            <div className="text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-3 text-[#FFD88A]" />
              <h2 className="text-2xl mb-2">PaktIQ Pro</h2>
              <p className="text-sm opacity-90">Everything you need to achieve your goals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-md px-6 py-6">
        {/* Features List */}
        <div className="mb-8">
          <h3 className="text-xl text-[#3C2B63] mb-4">Premium Features</h3>
          <div className="bg-white rounded-3xl p-6 shadow-lg space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="bg-gradient-to-br from-[#9163F2] to-[#3C2B63] p-3 rounded-xl flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[#3C2B63] mb-1">{feature.title}</div>
                    <div className="text-sm text-[#3C2B63]/70">{feature.description}</div>
                  </div>
                  <Check className="w-5 h-5 text-[#96E6B3] flex-shrink-0" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Pricing Options */}
        <div className="mb-8">
          <h3 className="text-xl text-[#3C2B63] mb-4">Choose Your Plan</h3>
          <div className="space-y-4">
            {bundles.map((bundle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`bg-white rounded-3xl p-6 shadow-lg relative ${
                  bundle.best ? 'ring-4 ring-[#9163F2]' : ''
                }`}
              >
                {/* Badge */}
                {bundle.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#96E6B3] to-[#9163F2] text-white px-4 py-1 rounded-full text-xs">
                    Popular
                  </div>
                )}
                {bundle.best && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FFD88A] to-[#FF8A8A] text-[#3C2B63] px-4 py-1 rounded-full text-xs">
                    Best Value
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-xl text-[#3C2B63] mb-1">{bundle.name}</h4>
                    {bundle.original && (
                      <div className="text-sm text-[#3C2B63]/50 line-through">{bundle.original}/mo</div>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl text-[#3C2B63]">{bundle.price}</span>
                      <span className="text-sm text-[#3C2B63]/70">{bundle.period}</span>
                    </div>
                  </div>
                  {bundle.savings && (
                    <div className={`bg-gradient-to-br ${bundle.color} text-white px-3 py-1 rounded-full text-xs`}>
                      {bundle.savings}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="text-sm text-[#3C2B63]/70 mb-2">Includes:</div>
                  {bundle.apps.map((app, appIndex) => (
                    <div key={appIndex} className="flex items-center gap-2 text-sm text-[#3C2B63] mb-1">
                      <Check className="w-4 h-4 text-[#96E6B3]" />
                      <span>{app}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={onUpgrade}
                  className={`w-full bg-gradient-to-r ${bundle.color} text-white py-3 rounded-2xl hover:shadow-xl transition-all`}
                >
                  Choose Plan
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Promo Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-gradient-to-r from-[#FFD88A] to-[#FF8A8A] rounded-3xl p-6 text-center text-white shadow-lg"
        >
          <div className="text-4xl mb-3">🎁</div>
          <h3 className="text-xl mb-2">Limited Time Offer</h3>
          <p className="text-sm opacity-90 mb-4">50% off your first month on all bundle plans!</p>
          <div className="text-xs opacity-80">Offer ends soon</div>
        </motion.div>

        {/* Comparison with Sister Apps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-8 bg-white rounded-3xl p-6 shadow-lg"
        >
          <h3 className="text-xl text-[#3C2B63] mb-4 text-center">Complete Your Growth Journey</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-[#F4F4F6] rounded-2xl">
              <div className="w-10 h-10 bg-gradient-to-br from-[#9163F2] to-[#3C2B63] rounded-xl flex items-center justify-center text-white">
                🎯
              </div>
              <div className="flex-1">
                <div className="text-sm text-[#3C2B63]">PaktIQ</div>
                <div className="text-xs text-[#3C2B63]/70">Goal tracking</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#F4F4F6] rounded-2xl">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF6A6A] to-[#FF8A8A] rounded-xl flex items-center justify-center text-white">
                ❤️
              </div>
              <div className="flex-1">
                <div className="text-sm text-[#3C2B63]">One2OneLove</div>
                <div className="text-xs text-[#3C2B63]/70">Relationship growth</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#F4F4F6] rounded-2xl">
              <div className="w-10 h-10 bg-gradient-to-br from-[#96E6B3] to-[#B6F6D3] rounded-xl flex items-center justify-center text-white">
                🧠
              </div>
              <div className="flex-1">
                <div className="text-sm text-[#3C2B63]">MyMatchIQ</div>
                <div className="text-xs text-[#3C2B63]/70">Compatibility insights</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
