import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Dumbbell, DollarSign, BookOpen, Heart, Users, Briefcase, ArrowRight } from 'lucide-react';

type CategorySelectionProps = {
  onSelect: (category: string) => void;
};

const categories = [
  { id: 'fitness', name: 'Fitness', icon: Dumbbell, color: '#FF6A6A', gradient: 'from-[#FF6A6A] to-[#FF8A8A]' },
  { id: 'finance', name: 'Finance', icon: DollarSign, color: '#96E6B3', gradient: 'from-[#96E6B3] to-[#B6F6D3]' },
  { id: 'learning', name: 'Learning', icon: BookOpen, color: '#9163F2', gradient: 'from-[#9163F2] to-[#B183F2]' },
  { id: 'wellness', name: 'Wellness', icon: Heart, color: '#FFD88A', gradient: 'from-[#FFD88A] to-[#FFE8AA]' },
  { id: 'relationships', name: 'Relationships', icon: Users, color: '#FF6A6A', gradient: 'from-[#FF6A6A] to-[#FF8A8A]' },
  { id: 'productivity', name: 'Productivity', icon: Briefcase, color: '#96E6B3', gradient: 'from-[#96E6B3] to-[#B6F6D3]' },
];

export default function CategorySelection({ onSelect }: CategorySelectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleContinue = () => {
    if (selectedCategory) {
      onSelect(selectedCategory);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F4F6] to-[#E8E8EA] py-12 px-6">
      <div className="container mx-auto max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl text-[#3C2B63] mb-3">Choose Your Category</h1>
          <p className="text-lg text-[#3C2B63]/70">What area of life do you want to focus on?</p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;

            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSelect(category.id)}
                className={`relative bg-white rounded-3xl p-8 transition-all ${
                  isSelected
                    ? 'shadow-2xl scale-105 ring-4'
                    : 'shadow-lg hover:shadow-xl hover:scale-102'
                }`}
                style={{
                  ringColor: isSelected ? category.color : 'transparent',
                }}
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 rounded-3xl opacity-10 bg-gradient-to-br ${category.gradient}`}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div
                    className={`bg-gradient-to-br ${category.gradient} p-4 rounded-2xl shadow-lg`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-lg text-[#3C2B63]">{category.name}</span>
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br flex items-center justify-center"
                    style={{
                      background: `linear-gradient(to bottom right, ${category.color}, ${category.color}dd)`,
                    }}
                  >
                    <motion.svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Continue Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={handleContinue}
          disabled={!selectedCategory}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all ${
            selectedCategory
              ? 'bg-gradient-to-r from-[#9163F2] to-[#3C2B63] text-white hover:shadow-2xl hover:scale-105'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span className="text-lg">Continue</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
