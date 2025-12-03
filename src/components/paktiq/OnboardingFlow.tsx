import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, CheckCircle2, TrendingUp, Trophy, Flame, Award, ArrowRight, ArrowLeft, Dumbbell, DollarSign, BookOpen, Heart, Users, Briefcase } from 'lucide-react';

type OnboardingFlowProps = {
  onComplete: () => void;
  onSkip: () => void;
};

export default function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      title: "What is a Pakt?",
      subtitle: "A commitment you make to yourself",
      content: "A Pakt is your personal pledge—whether it's building a habit, achieving a goal, or making a lifestyle change. It's your accountability partner in digital form.",
      icon: <Target className="w-20 h-20 text-[#FFD88A]" />,
    },
    {
      title: "How It Works",
      subtitle: "Simple, powerful, effective",
      steps: [
        { icon: <Target className="w-8 h-8 text-[#9163F2]" />, title: "Make a Pakt", desc: "Define your commitment" },
        { icon: <CheckCircle2 className="w-8 h-8 text-[#96E6B3]" />, title: "Build Milestones", desc: "Break it into steps" },
        { icon: <TrendingUp className="w-8 h-8 text-[#FFD88A]" />, title: "Track Progress", desc: "Watch yourself succeed" },
      ],
    },
    {
      title: "Motivation Engine",
      subtitle: "Stay inspired every day",
      features: [
        { icon: <Flame className="w-10 h-10 text-[#FF6A6A]" />, label: "Streaks", desc: "Build consistency" },
        { icon: <Trophy className="w-10 h-10 text-[#FFD88A]" />, label: "Badges", desc: "Earn achievements" },
        { icon: <Award className="w-10 h-10 text-[#96E6B3]" />, label: "Rewards", desc: "Celebrate wins" },
      ],
    },
    {
      title: "Choose Your Focus",
      subtitle: "What matters most to you?",
      categories: [
        { icon: <Dumbbell className="w-8 h-8" />, name: "Fitness", color: "#FF6A6A" },
        { icon: <DollarSign className="w-8 h-8" />, name: "Finance", color: "#96E6B3" },
        { icon: <BookOpen className="w-8 h-8" />, name: "Learning", color: "#9163F2" },
        { icon: <Heart className="w-8 h-8" />, name: "Wellness", color: "#FFD88A" },
        { icon: <Users className="w-8 h-8" />, name: "Relationships", color: "#FF6A6A" },
        { icon: <Briefcase className="w-8 h-8" />, name: "Productivity", color: "#96E6B3" },
      ],
    },
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3C2B63] to-[#9163F2] text-white relative overflow-hidden">
      {/* Progress Dots */}
      <div className="absolute top-8 left-0 right-0 flex justify-center gap-2 z-20">
        {pages.map((_, index) => (
          <motion.div
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentPage ? 'w-8 bg-[#FFD88A]' : 'w-2 bg-white/30'
            }`}
            layoutId={`dot-${index}`}
          />
        ))}
      </div>

      {/* Skip Button */}
      <button
        onClick={onSkip}
        className="absolute top-8 right-6 text-sm opacity-70 hover:opacity-100 transition-opacity z-20"
      >
        Skip
      </button>

      {/* Content */}
      <div className="container mx-auto px-6 py-20 max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="min-h-[500px] flex flex-col"
          >
            {/* Page 0: What is a Pakt */}
            {currentPage === 0 && (
              <div className="text-center flex-1 flex flex-col justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="flex justify-center mb-8"
                >
                  {pages[0].icon}
                </motion.div>
                <h2 className="text-4xl mb-4">{pages[0].title}</h2>
                <p className="text-xl text-[#FFD88A] mb-6">{pages[0].subtitle}</p>
                <p className="text-lg opacity-90 leading-relaxed px-4">
                  {pages[0].content}
                </p>
              </div>
            )}

            {/* Page 1: How It Works */}
            {currentPage === 1 && (
              <div className="text-center flex-1 flex flex-col justify-center">
                <h2 className="text-4xl mb-4">{pages[1].title}</h2>
                <p className="text-xl text-[#FFD88A] mb-12">{pages[1].subtitle}</p>
                <div className="space-y-8">
                  {pages[1].steps?.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 flex items-center gap-4"
                    >
                      <div className="bg-white/10 rounded-full p-3">
                        {step.icon}
                      </div>
                      <div className="text-left flex-1">
                        <div className="text-xl mb-1">{step.title}</div>
                        <div className="text-sm opacity-70">{step.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Page 2: Motivation Engine */}
            {currentPage === 2 && (
              <div className="text-center flex-1 flex flex-col justify-center">
                <h2 className="text-4xl mb-4">{pages[2].title}</h2>
                <p className="text-xl text-[#FFD88A] mb-12">{pages[2].subtitle}</p>
                <div className="grid grid-cols-3 gap-4">
                  {pages[2].features?.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.2, type: "spring" }}
                      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 flex flex-col items-center gap-3"
                    >
                      {feature.icon}
                      <div className="text-lg">{feature.label}</div>
                      <div className="text-xs opacity-70">{feature.desc}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Page 3: Choose Your Focus */}
            {currentPage === 3 && (
              <div className="text-center flex-1 flex flex-col justify-center">
                <h2 className="text-4xl mb-4">{pages[3].title}</h2>
                <p className="text-xl text-[#FFD88A] mb-12">{pages[3].subtitle}</p>
                <div className="grid grid-cols-2 gap-4">
                  {pages[3].categories?.map((category, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer flex flex-col items-center gap-3"
                      style={{ borderColor: `${category.color}40` }}
                    >
                      <div style={{ color: category.color }}>
                        {category.icon}
                      </div>
                      <div className="text-sm">{category.name}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-12">
          {currentPage > 0 && (
            <button
              onClick={handleBack}
              className="flex-1 bg-white/10 backdrop-blur-lg border border-white/30 text-white py-4 rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-[#FFD88A] to-[#96E6B3] text-[#3C2B63] py-4 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <span>{currentPage === pages.length - 1 ? 'Get Started' : 'Next'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
