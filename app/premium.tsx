import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const features = [
  {
    id: '1',
    title: 'Advanced Analytics',
    description: 'Get detailed insights into your progress with custom reports and trends',
    icon: '📊',
    included: false,
  },
  {
    id: '2',
    title: 'Unlimited Pakts',
    description: 'Create as many pakts as you want without restrictions',
    icon: '♾️',
    included: false,
  },
  {
    id: '3',
    title: 'AI Coach',
    description: 'Get personalized recommendations and motivation from AI',
    icon: '🤖',
    included: false,
  },
  {
    id: '4',
    title: 'Priority Support',
    description: '24/7 premium customer support with faster response times',
    icon: '💬',
    included: false,
  },
  {
    id: '5',
    title: 'Custom Themes',
    description: 'Personalize your app with exclusive themes and colors',
    icon: '🎨',
    included: false,
  },
  {
    id: '6',
    title: 'Export Data',
    description: 'Export all your data in multiple formats (PDF, CSV, JSON)',
    icon: '📥',
    included: false,
  },
  {
    id: '7',
    title: 'Team Collaboration',
    description: 'Share pakts and collaborate with friends or team members',
    icon: '👥',
    included: false,
  },
  {
    id: '8',
    title: 'Ad-Free Experience',
    description: 'Enjoy PaktIQ without any interruptions or advertisements',
    icon: '✨',
    included: false,
  },
];

export default function PremiumFeatures() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.heroSection}>
          <Text style={styles.badge}>⭐ PREMIUM</Text>
          <Text style={styles.heroTitle}>Unlock Your Full Potential</Text>
          <Text style={styles.heroSubtitle}>
            Get access to powerful features designed to help you achieve more
          </Text>
        </View>

        <View style={styles.pricingCard}>
          <View style={styles.pricingHeader}>
            <View>
              <Text style={styles.pricingPrice}>$9.99</Text>
              <Text style={styles.pricingPeriod}>per month</Text>
            </View>
            <View style={styles.savingsBadge}>
              <Text style={styles.savingsText}>Save 20%</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.subscribeButton}>
            <Text style={styles.subscribeButtonText}>Start Free Trial</Text>
          </TouchableOpacity>
          <Text style={styles.trialText}>7-day free trial • Cancel anytime</Text>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Premium Features</Text>
          {features.map((feature) => (
            <View key={feature.id} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>{feature.icon}</Text>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.testimonialSection}>
          <Text style={styles.testimonialTitle}>What Users Say</Text>
          <View style={styles.testimonialCard}>
            <Text style={styles.testimonialStars}>⭐⭐⭐⭐⭐</Text>
            <Text style={styles.testimonialText}>
              "Premium features helped me stay on track and achieve my goals faster than ever!"
            </Text>
            <Text style={styles.testimonialAuthor}>— Sarah K.</Text>
          </View>
          <View style={styles.testimonialCard}>
            <Text style={styles.testimonialStars}>⭐⭐⭐⭐⭐</Text>
            <Text style={styles.testimonialText}>
              "The AI coach is like having a personal mentor. Best investment I've made this year."
            </Text>
            <Text style={styles.testimonialAuthor}>— Michael R.</Text>
          </View>
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Can I cancel anytime?</Text>
            <Text style={styles.faqAnswer}>
              Yes! You can cancel your subscription at any time with no penalties.
            </Text>
          </View>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Is there a free trial?</Text>
            <Text style={styles.faqAnswer}>
              Absolutely! Try Premium free for 7 days, no credit card required.
            </Text>
          </View>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>What happens to my data?</Text>
            <Text style={styles.faqAnswer}>
              Your data is always yours. Even if you cancel, you keep all your pakts and progress.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerButtonText}>Upgrade to Premium</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F6',
  },
  header: {
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    fontSize: 16,
    color: '#9163F2',
  },
  content: {
    flex: 1,
  },
  heroSection: {
    backgroundColor: '#9163F2',
    padding: 40,
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#FFD88A',
    color: '#3C2B63',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#FFD88A',
    textAlign: 'center',
    lineHeight: 24,
  },
  pricingCard: {
    backgroundColor: '#FFFFFF',
    margin: 24,
    marginTop: -40,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pricingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pricingPrice: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#3C2B63',
  },
  pricingPeriod: {
    fontSize: 16,
    color: '#666',
  },
  savingsBadge: {
    backgroundColor: '#E8DEFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9163F2',
  },
  subscribeButton: {
    backgroundColor: '#9163F2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  trialText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  featuresSection: {
    padding: 24,
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3C2B63',
    marginBottom: 16,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureIconText: {
    fontSize: 24,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3C2B63',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  testimonialSection: {
    padding: 24,
    backgroundColor: '#F5F0FF',
  },
  testimonialTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3C2B63',
    marginBottom: 16,
  },
  testimonialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
  },
  testimonialStars: {
    fontSize: 16,
    marginBottom: 8,
  },
  testimonialText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 8,
  },
  testimonialAuthor: {
    fontSize: 14,
    color: '#9163F2',
    fontWeight: '500',
  },
  faqSection: {
    padding: 24,
  },
  faqTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3C2B63',
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3C2B63',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerButton: {
    backgroundColor: '#9163F2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

