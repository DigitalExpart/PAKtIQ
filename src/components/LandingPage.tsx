import { ArrowRight, Target, TrendingUp, Award, CheckCircle, Star, Zap, Heart, DollarSign, Book, Users, Sparkles, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showBundleChart, setShowBundleChart] = useState(false);

  const handleLearnMore = () => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Fitness Enthusiast',
      quote: 'This app helped me finally stick to my health goals. Down 20 lbs and feeling amazing!',
      image: '👩🏻'
    },
    {
      name: 'Michael Torres',
      role: 'Entrepreneur',
      quote: 'Breaking down big goals into milestones changed everything. I launched my business this year!',
      image: '👨🏽'
    },
    {
      name: 'Emily Parker',
      role: 'Teacher',
      quote: 'The daily reminders and progress tracking keep me motivated. Best resolution tool ever!',
      image: '👩🏼'
    }
  ];

  const modalContent: Record<string, { title: string; content: JSX.Element }> = {
    'features': {
      title: 'Features',
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-xl text-[#3E2C20] mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-[#FF8A3D]" />
              Smart Pakt Creation
            </h4>
            <p className="text-[#3E2C20]/70">Create detailed commitments with customizable categories, deadlines, and milestone tracking.</p>
          </div>
          <div>
            <h4 className="text-xl text-[#3E2C20] mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#FF8A3D]" />
              Progress Tracking
            </h4>
            <p className="text-[#3E2C20]/70">Visual charts, completion percentages, and milestone timelines keep you informed of your journey.</p>
          </div>
          <div>
            <h4 className="text-xl text-[#3E2C20] mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#FF8A3D]" />
              Achievement System
            </h4>
            <p className="text-[#3E2C20]/70">Earn badges and celebrate milestones with our comprehensive achievement system.</p>
          </div>
          <div>
            <h4 className="text-xl text-[#3E2C20] mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#FF8A3D]" />
              Streak Tracking
            </h4>
            <p className="text-[#3E2C20]/70">Build momentum with daily streak tracking and motivational reminders.</p>
          </div>
          <div>
            <h4 className="text-xl text-[#3E2C20] mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF8A3D]" />
              Smart Insights
            </h4>
            <p className="text-[#3E2C20]/70">Get personalized insights, statistics, and data export capabilities to track your growth.</p>
          </div>
        </div>
      )
    },
    'pricing': {
      title: 'Pricing',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#FFF2E6] to-white rounded-2xl p-6 border-2 border-[#FFD673]/30">
            <div className="text-center mb-4">
              <h4 className="text-3xl text-[#3E2C20] mb-2">Free Forever</h4>
              <p className="text-5xl text-[#FF8A3D] mb-2">$0</p>
              <p className="text-[#3E2C20]/70">Perfect for getting started</p>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-[#3E2C20]">
                <CheckCircle className="w-5 h-5 text-[#FF8A3D]" />
                2 Pakts per year (12 months)
              </li>
              <li className="flex items-center gap-2 text-[#3E2C20]">
                <CheckCircle className="w-5 h-5 text-[#FF8A3D]" />
                Milestone tracking
              </li>
              <li className="flex items-center gap-2 text-[#3E2C20]">
                <CheckCircle className="w-5 h-5 text-[#FF8A3D]" />
                Basic achievements
              </li>
              <li className="flex items-center gap-2 text-[#3E2C20]">
                <CheckCircle className="w-5 h-5 text-[#FF8A3D]" />
                Progress statistics
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-[#FF8A3D] to-[#FF5E6C] rounded-2xl p-6 text-white border-2 border-[#FF8A3D]">
            <div className="text-center mb-4">
              <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm mb-2">Coming Soon</div>
              <h4 className="text-3xl mb-2">PaktIQ Pro</h4>
              <p className="text-5xl mb-2">$4.99<span className="text-xl">/mo</span></p>
              <p className="opacity-90">For serious achievers</p>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Everything in Free
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Unlimited Pakts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Advanced analytics dashboard
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Custom categories
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Priority support
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Data export & backup
              </li>
            </ul>
          </div>
        </div>
      )
    },
    'reviews': {
      title: 'Reviews',
      content: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <div className="text-5xl text-[#FF8A3D] mb-2">4.9/5</div>
            <div className="flex justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-[#FFD673] text-[#FFD673]" />
              ))}
            </div>
            <p className="text-[#3E2C20]/70">Based on 2,847 reviews</p>
          </div>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gradient-to-br from-[#FFF2E6] to-white rounded-2xl p-5 border border-[#FFD673]/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">{testimonial.image}</div>
                <div>
                  <div className="text-[#3E2C20]">{testimonial.name}</div>
                  <div className="text-sm text-[#3E2C20]/60">{testimonial.role}</div>
                </div>
                <div className="ml-auto flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFD673] text-[#FFD673]" />
                  ))}
                </div>
              </div>
              <p className="text-[#3E2C20]/80 italic">&ldquo;{testimonial.quote}&rdquo;</p>
            </div>
          ))}
        </div>
      )
    },
    'about': {
      title: 'About PaktIQ',
      content: (
        <div className="space-y-4">
          <p className="text-[#3E2C20]/80">
            PaktIQ was born from a simple observation: people don't fail at achieving goals because they lack motivation—they fail because they lack the right tools to track progress and stay accountable.
          </p>
          <p className="text-[#3E2C20]/80">
            Founded in 2025, we set out to create more than just another goal-tracking app. We built an intelligent commitment system that combines psychology-backed milestone strategies with beautiful, intuitive design.
          </p>
          <div className="bg-gradient-to-br from-[#FFF2E6] to-white rounded-2xl p-6 border border-[#FFD673]/20">
            <h4 className="text-xl text-[#3E2C20] mb-3">Our Mission</h4>
            <p className="text-[#3E2C20]/70">
              To empower individuals worldwide to make meaningful commitments and achieve their most ambitious goals through smart tracking, actionable insights, and continuous motivation.
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#FFF2E6] to-white rounded-2xl p-6 border border-[#FFD673]/20">
            <h4 className="text-xl text-[#3E2C20] mb-3">Our Values</h4>
            <ul className="space-y-2 text-[#3E2C20]/70">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-[#FF8A3D] flex-shrink-0 mt-0.5" />
                <span><strong>Commitment:</strong> We believe in the power of keeping your word to yourself</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-[#FF8A3D] flex-shrink-0 mt-0.5" />
                <span><strong>Progress:</strong> Small steps lead to big transformations</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-[#FF8A3D] flex-shrink-0 mt-0.5" />
                <span><strong>Intelligence:</strong> Smart tools for smarter goal achievement</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    'blog': {
      title: 'Blog',
      content: (
        <div className="space-y-4">
          <p className="text-[#3E2C20]/70 text-center mb-6">Latest insights on goal achievement and personal growth</p>
          <div className="bg-gradient-to-br from-[#FFF2E6] to-white rounded-2xl p-5 border border-[#FFD673]/20 hover:shadow-lg transition-all cursor-pointer">
            <div className="text-sm text-[#FF8A3D] mb-2">Dec 1, 2026 • 5 min read</div>
            <h4 className="text-xl text-[#3E2C20] mb-2">The Science Behind Milestone-Based Goal Setting</h4>
            <p className="text-[#3E2C20]/70 mb-3">Discover why breaking down big goals into smaller milestones dramatically increases your success rate.</p>
            <div className="flex items-center gap-2 text-[#FF8A3D]">
              <span className="text-sm">Read more</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#FFF2E6] to-white rounded-2xl p-5 border border-[#FFD673]/20 hover:shadow-lg transition-all cursor-pointer">
            <div className="text-sm text-[#FF8A3D] mb-2">Nov 28, 2026 • 7 min read</div>
            <h4 className="text-xl text-[#3E2C20] mb-2">How Streak Tracking Builds Lasting Habits</h4>
            <p className="text-[#3E2C20]/70 mb-3">Learn the psychology behind why tracking daily streaks is one of the most powerful motivation tools.</p>
            <div className="flex items-center gap-2 text-[#FF8A3D]">
              <span className="text-sm">Read more</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#FFF2E6] to-white rounded-2xl p-5 border border-[#FFD673]/20 hover:shadow-lg transition-all cursor-pointer">
            <div className="text-sm text-[#FF8A3D] mb-2">Nov 25, 2026 • 4 min read</div>
            <h4 className="text-xl text-[#3E2C20] mb-2">5 Common Mistakes When Setting New Year Pakts</h4>
            <p className="text-[#3E2C20]/70 mb-3">Avoid these pitfalls and set yourself up for success in 2026 and beyond.</p>
            <div className="flex items-center gap-2 text-[#FF8A3D]">
              <span className="text-sm">Read more</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )
    },
    'contact': {
      title: 'Contact Us',
      content: (
        <div className="space-y-6">
          <p className="text-[#3E2C20]/70">We'd love to hear from you! Reach out with questions, feedback, or just to say hello.</p>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#FFF2E6] to-white rounded-2xl p-5 border border-[#FFD673]/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-[#FF8A3D] to-[#FF5E6C] p-2 rounded-lg">
                  <Book className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-[#3E2C20]">Email Support</h4>
              </div>
              <p className="text-[#3E2C20]/70">support@paktiq.com</p>
              <p className="text-sm text-[#3E2C20]/50 mt-1">We typically respond within 24 hours</p>
            </div>
            <div className="bg-gradient-to-br from-[#FFF2E6] to-white rounded-2xl p-5 border border-[#FFD673]/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-[#FF8A3D] to-[#FF5E6C] p-2 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-[#3E2C20]">Community</h4>
              </div>
              <p className="text-[#3E2C20]/70">Join our Discord community</p>
              <p className="text-sm text-[#3E2C20]/50 mt-1">Connect with other goal-achievers</p>
            </div>
            <div className="bg-gradient-to-br from-[#FFF2E6] to-white rounded-2xl p-5 border border-[#FFD673]/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-[#FF8A3D] to-[#FF5E6C] p-2 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-[#3E2C20]">Social Media</h4>
              </div>
              <p className="text-[#3E2C20]/70">@PaktIQ on Twitter, Instagram & LinkedIn</p>
              <p className="text-sm text-[#3E2C20]/50 mt-1">Follow for tips and updates</p>
            </div>
          </div>
        </div>
      )
    },
    'privacy': {
      title: 'Privacy Policy',
      content: (
        <div className="space-y-4 text-[#3E2C20]/80">
          <p className="text-sm text-[#3E2C20]/50">Last updated: December 1, 2026</p>
          <div>
            <h4 className="text-lg text-[#3E2C20] mb-2">Data Collection</h4>
            <p>PaktIQ collects only the information necessary to provide you with the best goal-tracking experience. This includes your Pakts, milestones, progress data, and basic account information.</p>
          </div>
          <div>
            <h4 className="text-lg text-[#3E2C20] mb-2">Data Usage</h4>
            <p>Your data is used solely to power your PaktIQ experience. We analyze aggregated, anonymized data to improve our features but never sell your personal information to third parties.</p>
          </div>
          <div>
            <h4 className="text-lg text-[#3E2C20] mb-2">Data Storage</h4>
            <p>All data is stored locally on your device. We use industry-standard encryption to protect your information.</p>
          </div>
          <div>
            <h4 className="text-lg text-[#3E2C20] mb-2">Your Rights</h4>
            <p>You have the right to access, modify, or delete your data at any time. Use the export feature to download your complete data history.</p>
          </div>
          <div className="bg-gradient-to-br from-[#FFF2E6] to-white rounded-2xl p-5 border border-[#FFD673]/20">
            <p className="text-sm"><strong>Your privacy matters.</strong> We're committed to protecting your data and being transparent about how we use it.</p>
          </div>
        </div>
      )
    },
    'terms': {
      title: 'Terms of Service',
      content: (
        <div className="space-y-4 text-[#3E2C20]/80">
          <p className="text-sm text-[#3E2C20]/50">Last updated: December 1, 2026</p>
          <div>
            <h4 className="text-lg text-[#3E2C20] mb-2">Acceptance of Terms</h4>
            <p>By accessing and using PaktIQ, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          </div>
          <div>
            <h4 className="text-lg text-[#3E2C20] mb-2">Use License</h4>
            <p>PaktIQ grants you a personal, non-transferable license to use this application for personal goal tracking and achievement purposes.</p>
          </div>
          <div>
            <h4 className="text-lg text-[#3E2C20] mb-2">User Responsibilities</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Maintain the confidentiality of your account</li>
              <li>Use the service in compliance with all applicable laws</li>
              <li>Not attempt to reverse engineer or exploit the application</li>
              <li>Not use the service for any illegal purposes</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg text-[#3E2C20] mb-2">Disclaimer</h4>
            <p>PaktIQ is provided "as is" without warranties of any kind. We strive for accuracy and reliability but cannot guarantee uninterrupted service.</p>
          </div>
          <div className="bg-gradient-to-br from-[#FFF2E6] to-white rounded-2xl p-5 border border-[#FFD673]/20">
            <p className="text-sm">Questions about these terms? Contact us at legal@paktiq.com</p>
          </div>
        </div>
      )
    },
    'security': {
      title: 'Security',
      content: (
        <div className="space-y-4">
          <p className="text-[#3E2C20]/80">Your security is our top priority. Here's how we protect your data:</p>
          <div className="space-y-3">
            <div className="bg-gradient-to-br from-[#FFF2E6] to-white rounded-2xl p-5 border border-[#FFD673]/20">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-[#FF8A3D] to-[#FF5E6C] p-2 rounded-lg mt-1">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-[#3E2C20] mb-1">Local-First Storage</h4>
                  <p className="text-[#3E2C20]/70">Your data is stored locally on your device, giving you complete control.</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#FFF2E6] to-white rounded-2xl p-5 border border-[#FFD673]/20">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-[#FF8A3D] to-[#FF5E6C] p-2 rounded-lg mt-1">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-[#3E2C20] mb-1">Encryption</h4>
                  <p className="text-[#3E2C20]/70">All sensitive data is encrypted using industry-standard protocols.</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#FFF2E6] to-white rounded-2xl p-5 border border-[#FFD673]/20">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-[#FF8A3D] to-[#FF5E6C] p-2 rounded-lg mt-1">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-[#3E2C20] mb-1">No Third-Party Sharing</h4>
                  <p className="text-[#3E2C20]/70">We never sell or share your personal data with third parties.</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#FFF2E6] to-white rounded-2xl p-5 border border-[#FFD673]/20">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-[#FF8A3D] to-[#FF5E6C] p-2 rounded-lg mt-1">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-[#3E2C20] mb-1">Regular Security Audits</h4>
                  <p className="text-[#3E2C20]/70">We conduct regular security reviews to identify and fix vulnerabilities.</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#FFF2E6] to-white rounded-2xl p-5 border border-[#FFD673]/20">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-[#FF8A3D] to-[#FF5E6C] p-2 rounded-lg mt-1">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-[#3E2C20] mb-1">Data Export & Backup</h4>
                  <p className="text-[#3E2C20]/70">Export your data anytime to maintain your own backups.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#FF8A3D]/10 to-[#FF5E6C]/10 rounded-2xl p-5 border border-[#FF8A3D]/30">
            <p className="text-sm text-[#3E2C20]"><strong>Security Concern?</strong> Report any security issues to security@paktiq.com</p>
          </div>
        </div>
      )
    }
  };

  const paktSuggestions: Record<string, string[]> = {
    'Fitness': [
      'Run a 5K race by March 2026',
      'Lose 15 pounds through healthy eating and exercise',
      'Complete a 30-day yoga challenge',
      'Build strength: do 50 push-ups in one set',
      'Walk 10,000 steps daily for 90 days',
      'Train for and complete a half-marathon'
    ],
    'Finance': [
      'Save $5,000 for an emergency fund',
      'Pay off $10,000 in credit card debt',
      'Increase income by 20% through side hustle',
      'Invest $500 monthly in index funds',
      'Create and stick to a monthly budget',
      'Build a passive income stream of $1,000/month'
    ],
    'Learning': [
      'Learn Spanish: achieve conversational fluency',
      'Complete a professional certification course',
      'Read 24 books (2 per month) in 2026',
      'Master Python programming basics',
      'Take an online course in data science',
      'Learn to play guitar: master 20 songs'
    ],
    'Wellness': [
      'Meditate for 10 minutes daily for 100 days',
      'Improve sleep: 8 hours nightly for 3 months',
      'Practice gratitude journaling daily',
      'Reduce screen time by 2 hours per day',
      'Establish a consistent morning routine',
      'Complete a digital detox weekend monthly'
    ],
    'Relationships': [
      'Have weekly quality time with family',
      'Reconnect with 12 old friends (1 per month)',
      'Join a community group or club',
      'Volunteer 50 hours for a cause I care about',
      'Plan monthly date nights with partner',
      'Write handwritten letters to 24 loved ones'
    ],
    'Productivity': [
      'Launch my own business or side project',
      'Complete that unfinished project by June',
      'Wake up at 6 AM daily for 90 days',
      'Implement GTD (Getting Things Done) system',
      'Reduce meeting time by 30%',
      'Learn and use a new productivity tool/method'
    ]
  };

  const categories = [
    { icon: Target, name: 'Fitness', color: 'from-[#FF8A3D] to-[#FF5E6C]' },
    { icon: DollarSign, name: 'Finance', color: 'from-[#FFD673] to-[#FF8A3D]' },
    { icon: Book, name: 'Learning', color: 'from-[#FF5E6C] to-[#FF8A3D]' },
    { icon: Heart, name: 'Wellness', color: 'from-[#FF8A3D] to-[#FFD673]' },
    { icon: Users, name: 'Relationships', color: 'from-[#FF5E6C] to-[#FFD673]' },
    { icon: Zap, name: 'Productivity', color: 'from-[#FFD673] to-[#FF5E6C]' }
  ];

  const steps = [
    {
      number: '01',
      title: 'Make a Pakt',
      description: 'Create commitments with clear goals and timelines',
      icon: Target
    },
    {
      number: '02',
      title: 'Build Milestones',
      description: 'Break down your Pakt into actionable steps',
      icon: TrendingUp
    },
    {
      number: '03',
      title: 'Track Progress',
      description: 'Monitor achievements and stay accountable with smart insights',
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFF2E6]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FF8A3D] via-[#FF5E6C] to-[#FF8A3D] text-white">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFD673]/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Sparkles className="w-32 h-32 text-white/5 animate-pulse" />
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Sparkle decoration */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 animate-pulse" />
              <span className="text-sm tracking-widest uppercase opacity-90">Smart Commitment Tracking</span>
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>

            <h1 className="text-5xl lg:text-7xl mb-6 leading-tight">
              PaktIQ
            </h1>
            <p className="text-xl lg:text-2xl mb-10 opacity-95 max-w-2xl mx-auto">
              Make commitments. Track progress. Achieve your goals with intelligence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 bg-[#FF3D2E] text-white rounded-full hover:bg-[#CC6A39] transition-all shadow-2xl hover:shadow-[#FF3D2E]/50 hover:scale-105 flex items-center gap-2 group"
              >
                <span>Start My First Pakt</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={handleLearnMore}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full hover:bg-white/10 transition-all"
              >
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 flex flex-col items-center justify-center text-center">
                <div className="text-4xl mb-2">10K+</div>
                <div className="text-sm opacity-90">Active Users</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 flex flex-col items-center justify-center text-center">
                <div className="text-4xl mb-2">50K+</div>
                <div className="text-sm opacity-90">Pakts Achieved</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 flex flex-col items-center justify-center text-center">
                <div className="text-4xl mb-2">95%</div>
                <div className="text-sm opacity-90">Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#FFF2E6"/>
          </svg>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6" id="how-it-works">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl text-[#3E2C20] mb-4">How It Works</h2>
            <p className="text-lg text-[#3E2C20]/70 max-w-2xl mx-auto">
              Three simple steps to make and keep your commitments
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-[#FFD673]/20"
              >
                <div className="bg-gradient-to-br from-[#FFD673] to-[#FF8A3D] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-[#FFD673] text-sm mb-3 tracking-widest">STEP {step.number}</div>
                <h3 className="text-2xl text-[#3E2C20] mb-3">{step.title}</h3>
                <p className="text-[#3E2C20]/70">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-[#FFF2E6]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl text-[#3E2C20] mb-4">
              Choose Your Path to Growth
            </h2>
            <p className="text-lg text-[#3E2C20]/70 max-w-2xl mx-auto">
              Make Pakts in any area of your life that matters to you
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group cursor-pointer"
                onClick={() => setSelectedCategory(category.name)}
              >
                <div className={`bg-gradient-to-br ${category.color} rounded-3xl p-6 aspect-square flex flex-col items-center justify-center text-white hover:scale-110 transition-all shadow-lg hover:shadow-2xl`}>
                  <category.icon className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-center">{category.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pakt Suggestions Modal */}
      {selectedCategory && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCategory(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-br from-[#FF8A3D] to-[#FF5E6C] text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {categories.find(c => c.name === selectedCategory)?.icon && (
                  <div className="bg-white/20 p-3 rounded-xl">
                    {(() => {
                      const Icon = categories.find(c => c.name === selectedCategory)!.icon;
                      return <Icon className="w-6 h-6" />;
                    })()}
                  </div>
                )}
                <div>
                  <h3 className="text-2xl">{selectedCategory} Pakts</h3>
                  <p className="text-sm opacity-90">Popular goals to get you started</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
              <div className="space-y-3">
                {paktSuggestions[selectedCategory]?.map((suggestion, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-[#FFF2E6] to-white border border-[#FFD673]/30 rounded-2xl p-4 hover:shadow-lg transition-all cursor-pointer group hover:scale-[1.02]"
                    onClick={() => {
                      setSelectedCategory(null);
                      onGetStarted();
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-[#FF8A3D] to-[#FF5E6C] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-[#3E2C20] flex-1">{suggestion}</p>
                      <ChevronRight className="w-5 h-5 text-[#FF8A3D] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-[#FFD673]/20 bg-[#FFF2E6]">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  onGetStarted();
                }}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#FF8A3D] to-[#FF5E6C] text-white rounded-full hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
              >
                <span>Create Custom Pakt</span>
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Tracker Preview */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl text-[#3E2C20] mb-6">
                Track Every Victory
              </h2>
              <p className="text-lg text-[#3E2C20]/70 mb-8">
                Visualize your progress with beautiful charts, streak tracking, and milestone celebrations. Stay motivated with daily reminders and achievement badges.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#FF8A3D] flex-shrink-0 mt-1" />
                  <span className="text-[#3E2C20]">Real-time progress tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#FF8A3D] flex-shrink-0 mt-1" />
                  <span className="text-[#3E2C20]">Smart reminders and notifications</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#FF8A3D] flex-shrink-0 mt-1" />
                  <span className="text-[#3E2C20]">Achievement badges and rewards</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#FF8A3D] flex-shrink-0 mt-1" />
                  <span className="text-[#3E2C20]">Detailed analytics and insights</span>
                </li>
              </ul>
            </div>

            {/* Mock UI */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border-8 border-[#3E2C20]">
                <div className="space-y-6">
                  {/* Progress Ring */}
                  <div className="bg-gradient-to-br from-[#FFF2E6] to-white rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[#3E2C20]">Overall Progress</span>
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div className="relative w-32 h-32 mx-auto">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="#FFD673" strokeWidth="8" fill="none" opacity="0.2" />
                        <circle cx="64" cy="64" r="56" stroke="#FF8A3D" strokeWidth="8" fill="none" strokeDasharray="351.68" strokeDashoffset="87.92" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl text-[#FF8A3D]">75%</span>
                      </div>
                    </div>
                  </div>

                  {/* Streak */}
                  <div className="bg-gradient-to-r from-[#FF8A3D] to-[#FF5E6C] rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm opacity-90 mb-1">Current Streak</div>
                        <div className="text-3xl">🔥 14 Days</div>
                      </div>
                      <Zap className="w-12 h-12 opacity-50" />
                    </div>
                  </div>

                  {/* Recent Achievement */}
                  <div className="bg-gradient-to-br from-[#FFD673] to-[#FF8A3D] rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 p-3 rounded-xl">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm opacity-90">Latest Achievement</div>
                        <div>First Week Complete! 🎉</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-[#FF3D2E] to-[#FF5E6C] text-white rounded-full p-4 shadow-2xl animate-bounce">
                <Star className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#FFF2E6] to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl text-[#3E2C20] mb-4">
              Real Stories, Real Results
            </h2>
            <p className="text-lg text-[#3E2C20]/70">
              Join thousands who've transformed their lives
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all border border-[#FFD673]/20"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-5xl">{testimonial.image}</div>
                  <div>
                    <div className="text-[#3E2C20]">{testimonial.name}</div>
                    <div className="text-sm text-[#3E2C20]/60">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-[#3E2C20]/80 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFD673] text-[#FFD673]" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Support Apps Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-[#FFF2E6]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF8A3D]/10 to-[#FF5E6C]/10 px-4 py-2 rounded-full mb-4">
              <Heart className="w-5 h-5 text-[#FF8A3D]" />
              <span className="text-sm text-[#FF8A3D]">Additional Support Apps</span>
            </div>
            <h2 className="text-4xl lg:text-5xl text-[#3E2C20] mb-4">
              Complete Your Growth Journey
            </h2>
            <p className="text-lg text-[#3E2C20]/70 max-w-2xl mx-auto">
              Combine PaktIQ with our sister apps for comprehensive personal and relationship development
            </p>
          </div>

          {/* App Tabs */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* One2oneLove */}
            <a
              href="https://one2onelove.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-[#FFD673]/20 hover:border-[#FF8A3D] hover:-translate-y-2"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-[#FF5E6C] to-[#FF8A3D] p-4 rounded-2xl">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl text-[#3E2C20] group-hover:text-[#FF8A3D] transition-colors">One2oneLove</h3>
                    <p className="text-sm text-[#3E2C20]/60">Relationship Growth</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-[#FF8A3D] opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
              </div>
              <p className="text-[#3E2C20]/70 mb-4">
                Build stronger, deeper connections with your partner through guided exercises, communication tools, and relationship milestones.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#FFF2E6] text-[#3E2C20] px-3 py-1 rounded-full text-sm">Couple Goals</span>
                <span className="bg-[#FFF2E6] text-[#3E2C20] px-3 py-1 rounded-full text-sm">Communication</span>
                <span className="bg-[#FFF2E6] text-[#3E2C20] px-3 py-1 rounded-full text-sm">Date Ideas</span>
              </div>
            </a>

            {/* MyMatchIQ */}
            <a
              href="https://mymatchiq.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-[#FFD673]/20 hover:border-[#FF8A3D] hover:-translate-y-2"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-[#FFD673] to-[#FF8A3D] p-4 rounded-2xl">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl text-[#3E2C20] group-hover:text-[#FF8A3D] transition-colors">MyMatchIQ</h3>
                    <p className="text-sm text-[#3E2C20]/60">Compatibility & Insights</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-[#FF8A3D] opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
              </div>
              <p className="text-[#3E2C20]/70 mb-4">
                Discover compatibility insights, personality assessments, and intelligent matching tools for meaningful relationships of all types.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#FFF2E6] text-[#3E2C20] px-3 py-1 rounded-full text-sm">Compatibility</span>
                <span className="bg-[#FFF2E6] text-[#3E2C20] px-3 py-1 rounded-full text-sm">Assessments</span>
                <span className="bg-[#FFF2E6] text-[#3E2C20] px-3 py-1 rounded-full text-sm">Insights</span>
              </div>
            </a>
          </div>

          {/* Package Pricing */}
          <div className="bg-gradient-to-br from-white to-[#FFF2E6] rounded-3xl p-8 border-2 border-[#FF8A3D]/30 shadow-xl">
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-r from-[#FF8A3D] to-[#FF5E6C] text-white px-4 py-2 rounded-full text-sm mb-4">
                💎 Bundle & Save
              </div>
              <h3 className="text-3xl text-[#3E2C20] mb-2">Multi-App Packages</h3>
              <p className="text-[#3E2C20]/70">Get all three apps at a reduced price</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Single App */}
              <div className="bg-white rounded-2xl p-6 border border-[#FFD673]/30">
                <div className="text-center mb-4">
                  <div className="text-[#3E2C20]/60 text-sm mb-2">Single App</div>
                  <div className="text-4xl text-[#3E2C20] mb-2">$4.99</div>
                  <div className="text-sm text-[#3E2C20]/60">/month per app</div>
                </div>
                <ul className="space-y-2 text-sm text-[#3E2C20]/70">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#FF8A3D]" />
                    Choose any one app
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#FF8A3D]" />
                    Full features unlocked
                  </li>
                </ul>
              </div>

              {/* Two App Bundle */}
              <div className="bg-gradient-to-br from-[#FFF2E6] to-white rounded-2xl p-6 border-2 border-[#FF8A3D]/50 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF8A3D] to-[#FF5E6C] text-white px-3 py-1 rounded-full text-xs">
                  Save 20%
                </div>
                <div className="text-center mb-4">
                  <div className="text-[#FF8A3D] text-sm mb-2">Two Apps</div>
                  <div className="text-4xl text-[#3E2C20] mb-1">
                    $7.99
                    <span className="text-lg text-[#3E2C20]/50 line-through ml-2">$9.98</span>
                  </div>
                  <div className="text-sm text-[#3E2C20]/60">/month total</div>
                </div>
                <ul className="space-y-2 text-sm text-[#3E2C20]/70">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#FF8A3D]" />
                    Pick any 2 apps
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#FF8A3D]" />
                    All premium features
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#FF8A3D]" />
                    $2/month savings
                  </li>
                </ul>
              </div>

              {/* Three App Bundle */}
              <div className="bg-gradient-to-br from-[#FF8A3D] to-[#FF5E6C] rounded-2xl p-6 text-white relative shadow-2xl">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFD673] text-[#3E2C20] px-3 py-1 rounded-full text-xs font-semibold">
                  🎉 Best Value - Save 33%
                </div>
                <div className="text-center mb-4">
                  <div className="text-white/90 text-sm mb-2">Complete Suite</div>
                  <div className="text-4xl mb-1">
                    $9.99
                    <span className="text-lg text-white/60 line-through ml-2">$14.97</span>
                  </div>
                  <div className="text-sm text-white/80">/month total</div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    All 3 apps included
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Complete growth toolkit
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    $5/month savings
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Priority support
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-[#3E2C20]/60 mb-4">
                🎁 <strong>Limited Time:</strong> Get your first month at 50% off any bundle
              </p>
              <button
                onClick={() => setShowBundleChart(true)}
                className="px-8 py-4 bg-gradient-to-r from-[#FF8A3D] to-[#FF5E6C] text-white rounded-full hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-2 group"
              >
                <span>Explore Bundle Options</span>
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 px-6 bg-gradient-to-br from-[#CC6A39] to-[#FF8A3D] text-white overflow-hidden">
        {/* Confetti effect */}
        <div className="absolute inset-0 overflow-hidden">
          <Sparkles className="absolute top-10 left-10 w-12 h-12 animate-pulse opacity-30" />
          <Sparkles className="absolute top-20 right-20 w-8 h-8 animate-pulse opacity-40 animation-delay-1000" />
          <Sparkles className="absolute bottom-20 left-1/4 w-10 h-10 animate-pulse opacity-20 animation-delay-2000" />
          <Sparkles className="absolute bottom-10 right-1/3 w-6 h-6 animate-pulse opacity-30" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl lg:text-6xl mb-6">
            Ready to Commit?
          </h2>
          <p className="text-xl mb-10 opacity-95">
            Don't just set goals. Make Pakts and achieve them with intelligence.
          </p>
          <button
            onClick={onGetStarted}
            className="px-10 py-5 bg-[#FF3D2E] text-white rounded-full hover:bg-white hover:text-[#FF3D2E] transition-all shadow-2xl hover:shadow-[#FF3D2E]/50 hover:scale-110 text-lg flex items-center gap-3 mx-auto group"
          >
            <span>Start Your Journey Now</span>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#FFF2E6] border-t border-[#FFD673]/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div>
              <h3 className="text-[#3E2C20] mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#FF8A3D]" />
                PaktIQ
              </h3>
              <p className="text-sm text-[#3E2C20]/70">
                Transform your life, one Pakt at a time.
              </p>
            </div>
            <div>
              <h4 className="text-[#3E2C20] mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-[#3E2C20]/70">
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('features'); }} className="hover:text-[#FF8A3D] transition-colors cursor-pointer">Features</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('pricing'); }} className="hover:text-[#FF8A3D] transition-colors cursor-pointer">Pricing</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('reviews'); }} className="hover:text-[#FF8A3D] transition-colors cursor-pointer">Reviews</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#3E2C20] mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-[#3E2C20]/70">
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('about'); }} className="hover:text-[#FF8A3D] transition-colors cursor-pointer">About</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('blog'); }} className="hover:text-[#FF8A3D] transition-colors cursor-pointer">Blog</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('contact'); }} className="hover:text-[#FF8A3D] transition-colors cursor-pointer">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#3E2C20] mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-[#3E2C20]/70">
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('privacy'); }} className="hover:text-[#FF8A3D] transition-colors cursor-pointer">Privacy</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('terms'); }} className="hover:text-[#FF8A3D] transition-colors cursor-pointer">Terms</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('security'); }} className="hover:text-[#FF8A3D] transition-colors cursor-pointer">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#3E2C20] mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#FF8A3D]" />
                Sister Apps
              </h4>
              <ul className="space-y-2 text-sm text-[#3E2C20]/70">
                <li>
                  <a 
                    href="https://one2onelove.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-[#FF8A3D] transition-colors cursor-pointer flex items-center gap-1 group"
                  >
                    One2oneLove
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://mymatchiq.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-[#FF8A3D] transition-colors cursor-pointer flex items-center gap-1 group"
                  >
                    MyMatchIQ
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              </ul>
              <p className="text-xs text-[#3E2C20]/50 mt-3">
                Growth tools for relationships & life
              </p>
            </div>
          </div>
          <div className="text-center text-sm text-[#3E2C20]/60 pt-8 border-t border-[#FFD673]/20">
            © 2026 PaktIQ. Smart commitments, better results.
          </div>
        </div>
      </footer>

      {/* Footer Info Modal */}
      {activeModal && modalContent[activeModal] && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-br from-[#FF8A3D] to-[#FF5E6C] text-white p-6 flex items-center justify-between sticky top-0 z-10">
              <h3 className="text-2xl">{modalContent[activeModal].title}</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-88px)]">
              {modalContent[activeModal].content}
            </div>
          </div>
        </div>
      )}

      {/* Bundle Comparison Chart Modal */}
      {showBundleChart && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowBundleChart(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-br from-[#FF8A3D] to-[#FF5E6C] text-white p-6 flex items-center justify-between sticky top-0 z-10">
              <div>
                <h3 className="text-3xl mb-1">App Feature Comparison</h3>
                <p className="text-sm opacity-90">Choose the perfect bundle for your growth journey</p>
              </div>
              <button
                onClick={() => setShowBundleChart(false)}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Scrollable container for mobile */}
              <div className="overflow-x-auto -mx-4 md:-mx-6 px-4 md:px-6">
                <div className="min-w-[600px]">
                  {/* App Headers */}
                  <div className="grid grid-cols-4 gap-2 md:gap-4 mb-6">
                    <div className="text-[#3E2C20] p-2 md:p-4">
                      <h4 className="text-sm md:text-lg">Features</h4>
                    </div>
                    <div className="bg-gradient-to-br from-[#FF8A3D]/10 to-[#FF5E6C]/10 rounded-xl md:rounded-2xl p-2 md:p-4 border-2 border-[#FF8A3D]/30">
                      <div className="flex flex-col items-center text-center mb-1 md:mb-2">
                        <Target className="w-4 h-4 md:w-6 md:h-6 text-[#FF8A3D] mb-1 md:mb-2" />
                        <h4 className="text-xs md:text-base text-[#3E2C20] leading-tight">PaktIQ</h4>
                      </div>
                      <p className="text-[10px] md:text-xs text-[#3E2C20]/60 text-center">Goal<br/>Tracking</p>
                    </div>
                    <div className="bg-gradient-to-br from-[#FF5E6C]/10 to-[#FF8A3D]/10 rounded-xl md:rounded-2xl p-2 md:p-4 border-2 border-[#FF5E6C]/30">
                      <div className="flex flex-col items-center text-center mb-1 md:mb-2">
                        <Heart className="w-4 h-4 md:w-6 md:h-6 text-[#FF5E6C] mb-1 md:mb-2" />
                        <h4 className="text-xs md:text-base text-[#3E2C20] leading-tight">One2one<br/>Love</h4>
                      </div>
                      <p className="text-[10px] md:text-xs text-[#3E2C20]/60 text-center">Relationship<br/>Growth</p>
                    </div>
                    <div className="bg-gradient-to-br from-[#FFD673]/10 to-[#FF8A3D]/10 rounded-xl md:rounded-2xl p-2 md:p-4 border-2 border-[#FFD673]/30">
                      <div className="flex flex-col items-center text-center mb-1 md:mb-2">
                        <Users className="w-4 h-4 md:w-6 md:h-6 text-[#FF8A3D] mb-1 md:mb-2" />
                        <h4 className="text-xs md:text-base text-[#3E2C20] leading-tight">MyMatchIQ</h4>
                      </div>
                      <p className="text-[10px] md:text-xs text-[#3E2C20]/60 text-center">Compatibility<br/>& Insights</p>
                    </div>
                  </div>

              {/* Feature Comparison Table */}
              <div className="space-y-3">
                {/* Goal & Commitment Features */}
                <div className="bg-[#FFF2E6] rounded-xl p-2 md:p-3">
                  <h5 className="text-xs md:text-sm text-[#FF8A3D] mb-2 md:mb-3">📊 Goal & Commitment Features</h5>
                  <div className="space-y-2">
                    <div className="grid grid-cols-4 gap-2 md:gap-4 items-center py-2 border-b border-[#FFD673]/20">
                      <div className="text-xs md:text-sm text-[#3E2C20]">Smart goal creation</div>
                      <div className="text-center"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF8A3D] mx-auto" /></div>
                      <div className="text-center"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF5E6C] mx-auto" /></div>
                      <div className="text-center"><X className="w-4 h-4 md:w-5 md:h-5 text-[#3E2C20]/20 mx-auto" /></div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 md:gap-4 items-center py-2 border-b border-[#FFD673]/20">
                      <div className="text-xs md:text-sm text-[#3E2C20]">Milestone tracking</div>
                      <div className="text-center"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF8A3D] mx-auto" /></div>
                      <div className="text-center"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF5E6C] mx-auto" /></div>
                      <div className="text-center"><X className="w-4 h-4 md:w-5 md:h-5 text-[#3E2C20]/20 mx-auto" /></div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 md:gap-4 items-center py-2">
                      <div className="text-xs md:text-sm text-[#3E2C20]">Progress analytics</div>
                      <div className="text-center"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF8A3D] mx-auto" /></div>
                      <div className="text-center"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF5E6C] mx-auto" /></div>
                      <div className="text-center"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF8A3D] mx-auto" /></div>
                    </div>
                  </div>
                </div>

                {/* Relationship Features */}
                <div className="bg-[#FFF2E6] rounded-xl p-2 md:p-3">
                  <h5 className="text-xs md:text-sm text-[#FF8A3D] mb-2 md:mb-3">💕 Relationship Features</h5>
                  <div className="space-y-2">
                    <div className="grid grid-cols-4 gap-2 md:gap-4 items-center py-2 border-b border-[#FFD673]/20">
                      <div className="text-xs md:text-sm text-[#3E2C20]">Couple goal setting</div>
                      <div className="text-center"><X className="w-4 h-4 md:w-5 md:h-5 text-[#3E2C20]/20 mx-auto" /></div>
                      <div className="text-center"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF5E6C] mx-auto" /></div>
                      <div className="text-center"><X className="w-4 h-4 md:w-5 md:h-5 text-[#3E2C20]/20 mx-auto" /></div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 md:gap-4 items-center py-2 border-b border-[#FFD673]/20">
                      <div className="text-xs md:text-sm text-[#3E2C20]">Communication tools</div>
                      <div className="text-center"><X className="w-4 h-4 md:w-5 md:h-5 text-[#3E2C20]/20 mx-auto" /></div>
                      <div className="text-center"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF5E6C] mx-auto" /></div>
                      <div className="text-center"><X className="w-4 h-4 md:w-5 md:h-5 text-[#3E2C20]/20 mx-auto" /></div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 md:gap-4 items-center py-2 border-b border-[#FFD673]/20">
                      <div className="text-xs md:text-sm text-[#3E2C20]">Date idea generator</div>
                      <div className="text-center"><X className="w-4 h-4 md:w-5 md:h-5 text-[#3E2C20]/20 mx-auto" /></div>
                      <div className="text-center"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF5E6C] mx-auto" /></div>
                      <div className="text-center"><X className="w-4 h-4 md:w-5 md:h-5 text-[#3E2C20]/20 mx-auto" /></div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 md:gap-4 items-center py-2">
                      <div className="text-xs md:text-sm text-[#3E2C20]">Relationship milestones</div>
                      <div className="text-center"><X className="w-4 h-4 md:w-5 md:h-5 text-[#3E2C20]/20 mx-auto" /></div>
                      <div className="text-center"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF5E6C] mx-auto" /></div>
                      <div className="text-center"><X className="w-4 h-4 md:w-5 md:h-5 text-[#3E2C20]/20 mx-auto" /></div>
                    </div>
                  </div>
                </div>

                {/* Compatibility & Assessment Features */}
                <div className="bg-[#FFF2E6] rounded-xl p-2 md:p-3">
                  <h5 className="text-xs md:text-sm text-[#FF8A3D] mb-2 md:mb-3">🧠 Compatibility & Assessment</h5>
                  <div className="space-y-2">
                    <div className="grid grid-cols-4 gap-2 md:gap-4 items-center py-2 border-b border-[#FFD673]/20">
                      <div className="text-xs md:text-sm text-[#3E2C20]">Personality assessments</div>
                      <div className="text-center"><X className="w-4 h-4 md:w-5 md:h-5 text-[#3E2C20]/20 mx-auto" /></div>
                      <div className="text-center"><X className="w-4 h-4 md:w-5 md:h-5 text-[#3E2C20]/20 mx-auto" /></div>
                      <div className="text-center"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF8A3D] mx-auto" /></div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 md:gap-4 items-center py-2 border-b border-[#FFD673]/20">
                      <div className="text-xs md:text-sm text-[#3E2C20]">Compatibility scoring</div>
                      <div className="text-center"><X className="w-4 h-4 md:w-5 md:h-5 text-[#3E2C20]/20 mx-auto" /></div>
                      <div className="text-center"><X className="w-4 h-4 md:w-5 md:h-5 text-[#3E2C20]/20 mx-auto" /></div>
                      <div className="text-center"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF8A3D] mx-auto" /></div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 md:gap-4 items-center py-2 border-b border-[#FFD673]/20">
                      <div className="text-xs md:text-sm text-[#3E2C20]">Relationship insights</div>
                      <div className="text-center"><X className="w-4 h-4 md:w-5 md:h-5 text-[#3E2C20]/20 mx-auto" /></div>
                      <div className="text-center"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF5E6C] mx-auto" /></div>
                      <div className="text-center"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF8A3D] mx-auto" /></div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 md:gap-4 items-center py-2">
                      <div className="text-xs md:text-sm text-[#3E2C20]">Matching algorithms</div>
                      <div className="text-center"><X className="w-4 h-4 md:w-5 md:h-5 text-[#3E2C20]/20 mx-auto" /></div>
                      <div className="text-center"><X className="w-4 h-4 md:w-5 md:h-5 text-[#3E2C20]/20 mx-auto" /></div>
                      <div className="text-center"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF8A3D] mx-auto" /></div>
                    </div>
                  </div>
                </div>

                {/* Tracking & Motivation Features */}
                <div className="bg-[#FFF2E6] rounded-xl p-2 md:p-3">
                  <h5 className="text-xs md:text-sm text-[#FF8A3D] mb-2 md:mb-3">⚡ Tracking & Motivation</h5>
                  <div className="space-y-2">
                    <div className="grid grid-cols-4 gap-2 md:gap-4 items-center py-2 border-b border-[#FFD673]/20">
                      <div className="text-xs md:text-sm text-[#3E2C20]">Streak tracking</div>
                      <div className="text-center"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF8A3D] mx-auto" /></div>
                      <div className="text-center"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF5E6C] mx-auto" /></div>
                      <div className="text-center"><X className="w-4 h-4 md:w-5 md:h-5 text-[#3E2C20]/20 mx-auto" /></div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 md:gap-4 items-center py-2 border-b border-[#FFD673]/20">
                      <div className="text-xs md:text-sm text-[#3E2C20]">Achievement badges</div>
                      <div className="text-center"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF8A3D] mx-auto" /></div>
                      <div className="text-center"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF5E6C] mx-auto" /></div>
                      <div className="text-center"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF8A3D] mx-auto" /></div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 md:gap-4 items-center py-2 border-b border-[#FFD673]/20">
                      <div className="text-xs md:text-sm text-[#3E2C20]">Daily reminders</div>
                      <div className="text-center"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF8A3D] mx-auto" /></div>
                      <div className="text-center"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF5E6C] mx-auto" /></div>
                      <div className="text-center"><X className="w-4 h-4 md:w-5 md:h-5 text-[#3E2C20]/20 mx-auto" /></div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 md:gap-4 items-center py-2">
                      <div className="text-xs md:text-sm text-[#3E2C20]">Data export</div>
                      <div className="text-center"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF8A3D] mx-auto" /></div>
                      <div className="text-center"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF5E6C] mx-auto" /></div>
                      <div className="text-center"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF8A3D] mx-auto" /></div>
                    </div>
                  </div>
                </div>
              </div>
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="mt-8 grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 border-2 border-[#FFD673]/30 text-center">
                  <div className="text-xl md:text-2xl text-[#3E2C20] mb-2">$4.99<span className="text-xs md:text-sm">/mo</span></div>
                  <p className="text-xs md:text-sm text-[#3E2C20]/60 mb-3">Single App</p>
                  <button
                    onClick={() => {
                      setShowBundleChart(false);
                      onGetStarted();
                    }}
                    className="w-full px-4 py-2 bg-gradient-to-r from-[#FFD673] to-[#FF8A3D] text-white rounded-full hover:shadow-lg transition-all text-xs md:text-sm"
                  >
                    Choose Plan
                  </button>
                </div>
                <div className="bg-gradient-to-br from-[#FFF2E6] to-white rounded-xl md:rounded-2xl p-4 md:p-5 border-2 border-[#FF8A3D] text-center">
                  <div className="text-xl md:text-2xl text-[#3E2C20] mb-1">$7.99<span className="text-xs md:text-sm">/mo</span></div>
                  <div className="text-[10px] md:text-xs text-[#3E2C20]/50 line-through mb-2">$9.98/mo</div>
                  <p className="text-xs md:text-sm text-[#FF8A3D] mb-3">Two Apps • Save 20%</p>
                  <button
                    onClick={() => {
                      setShowBundleChart(false);
                      onGetStarted();
                    }}
                    className="w-full px-4 py-2 bg-gradient-to-r from-[#FF8A3D] to-[#FF5E6C] text-white rounded-full hover:shadow-lg transition-all text-xs md:text-sm"
                  >
                    Choose Plan
                  </button>
                </div>
                <div className="bg-gradient-to-br from-[#FF8A3D] to-[#FF5E6C] rounded-xl md:rounded-2xl p-4 md:p-5 text-white text-center shadow-xl">
                  <div className="text-[10px] md:text-xs bg-[#FFD673] text-[#3E2C20] px-2 py-1 rounded-full inline-block mb-2">Best Value</div>
                  <div className="text-xl md:text-2xl mb-1">$9.99<span className="text-xs md:text-sm">/mo</span></div>
                  <div className="text-[10px] md:text-xs opacity-70 line-through mb-2">$14.97/mo</div>
                  <p className="text-xs md:text-sm mb-3">All 3 Apps • Save 33%</p>
                  <button
                    onClick={() => {
                      setShowBundleChart(false);
                      onGetStarted();
                    }}
                    className="w-full px-4 py-2 bg-white text-[#FF8A3D] rounded-full hover:shadow-lg transition-all text-xs md:text-sm"
                  >
                    Choose Plan
                  </button>
                </div>
              </div>

              <p className="text-center text-xs md:text-sm text-[#3E2C20]/60 mt-6">
                🎁 All bundles include 50% off your first month!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}