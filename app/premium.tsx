import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import { useLanguage } from '../src/contexts/LanguageContext';
import BottomTabBar from '../src/components/BottomTabBar';

export default function PremiumFeatures() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();

const features = [
  {
    id: '1',
      title: t('premium.advancedAnalytics'),
      description: t('premium.advancedAnalyticsDesc'),
    icon: '📊',
    included: false,
  },
  {
    id: '2',
      title: t('premium.unlimitedPakts'),
      description: t('premium.unlimitedPaktsDesc'),
    icon: '♾️',
    included: false,
  },
  {
    id: '3',
      title: t('premium.aiCoach'),
      description: t('premium.aiCoachDesc'),
    icon: '🤖',
    included: false,
  },
  {
    id: '4',
      title: t('premium.prioritySupport'),
      description: t('premium.prioritySupportDesc'),
    icon: '💬',
    included: false,
  },
  {
    id: '5',
      title: t('premium.customThemes'),
      description: t('premium.customThemesDesc'),
    icon: '🎨',
    included: false,
  },
  {
    id: '6',
      title: t('premium.exportData'),
      description: t('premium.exportDataDesc'),
    icon: '📥',
    included: false,
  },
  {
    id: '7',
      title: t('premium.teamCollaboration'),
      description: t('premium.teamCollaborationDesc'),
    icon: '👥',
    included: false,
  },
  {
    id: '8',
      title: t('premium.adFree'),
      description: t('premium.adFreeDesc'),
    icon: '✨',
    included: false,
  },
];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>{t('common.back')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.heroSection, { backgroundColor: colors.primary }]}>
          <Text style={[styles.badge, { backgroundColor: '#FFD88A', color: '#3C2B63' }]}>⭐ {t('premium.badge')}</Text>
          <Text style={styles.heroTitle}>{t('premium.heroTitle')}</Text>
          <Text style={styles.heroSubtitle}>
            {t('premium.heroSubtitle')}
          </Text>
        </View>

        <View style={[styles.pricingCard, { backgroundColor: colors.surface }]}>
          <View style={styles.pricingHeader}>
            <View>
              <Text style={[styles.pricingPrice, { color: colors.text }]}>{t('premium.pricingPrice')}</Text>
              <Text style={[styles.pricingPeriod, { color: colors.textSecondary }]}>{t('premium.pricingPeriod')}</Text>
            </View>
            <View style={[styles.savingsBadge, { backgroundColor: `${colors.primary}20` }]}>
              <Text style={[styles.savingsText, { color: colors.primary }]}>{t('premium.save20')}</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.subscribeButton, { backgroundColor: colors.primary }]}>
            <Text style={styles.subscribeButtonText}>{t('premium.startFreeTrial')}</Text>
          </TouchableOpacity>
          <Text style={[styles.trialText, { color: colors.textSecondary }]}>{t('premium.trialText')}</Text>
        </View>

        <View style={styles.featuresSection}>
          <Text style={[styles.featuresTitle, { color: colors.text }]}>{t('premium.featuresTitle')}</Text>
          {features.map((feature) => (
            <View key={feature.id} style={[styles.featureCard, { backgroundColor: colors.surface }]}>
              <View style={[styles.featureIcon, { backgroundColor: `${colors.primary}10` }]}>
                <Text style={styles.featureIconText}>{feature.icon}</Text>
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>{feature.title}</Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.testimonialSection, { backgroundColor: `${colors.primary}10` }]}>
          <Text style={[styles.testimonialTitle, { color: colors.text }]}>{t('premium.testimonialTitle')}</Text>
          <View style={[styles.testimonialCard, { backgroundColor: colors.surface }]}>
            <Text style={styles.testimonialStars}>⭐⭐⭐⭐⭐</Text>
            <Text style={[styles.testimonialText, { color: colors.text }]}>
              "{t('premium.testimonial1')}"
            </Text>
            <Text style={[styles.testimonialAuthor, { color: colors.primary }]}>{t('premium.testimonial1Author')}</Text>
          </View>
          <View style={[styles.testimonialCard, { backgroundColor: colors.surface }]}>
            <Text style={styles.testimonialStars}>⭐⭐⭐⭐⭐</Text>
            <Text style={[styles.testimonialText, { color: colors.text }]}>
              "{t('premium.testimonial2')}"
            </Text>
            <Text style={[styles.testimonialAuthor, { color: colors.primary }]}>{t('premium.testimonial2Author')}</Text>
          </View>
        </View>

        <View style={styles.faqSection}>
          <Text style={[styles.faqTitle, { color: colors.text }]}>{t('premium.faqTitle')}</Text>
          <View style={[styles.faqItem, { backgroundColor: colors.surface }]}>
            <Text style={[styles.faqQuestion, { color: colors.text }]}>{t('premium.faq1Question')}</Text>
            <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
              {t('premium.faq1Answer')}
            </Text>
          </View>
          <View style={[styles.faqItem, { backgroundColor: colors.surface }]}>
            <Text style={[styles.faqQuestion, { color: colors.text }]}>{t('premium.faq2Question')}</Text>
            <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
              {t('premium.faq2Answer')}
            </Text>
          </View>
          <View style={[styles.faqItem, { backgroundColor: colors.surface }]}>
            <Text style={[styles.faqQuestion, { color: colors.text }]}>{t('premium.faq3Question')}</Text>
            <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
              {t('premium.faq3Answer')}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity style={[styles.footerButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.footerButtonText}>{t('premium.upgradeToPremium')}</Text>
        </TouchableOpacity>
      </View>
      
      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
  },
  backButton: {
    fontSize: 16,
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
  },
  pricingPeriod: {
    fontSize: 16,
  },
  savingsBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '600',
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
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  testimonialSection: {
    padding: 24,
  },
  testimonialTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  testimonialCard: {
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
    lineHeight: 22,
    marginBottom: 8,
  },
  testimonialAuthor: {
    fontSize: 14,
    fontWeight: '500',
  },
  faqSection: {
    padding: 24,
  },
  faqTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  faqItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
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

