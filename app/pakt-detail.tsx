import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, Clock, Target, CheckCircle, Circle, Edit, Trash2, Share2, MoreVertical } from 'lucide-react-native';

export default function PaktDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showMenu, setShowMenu] = useState(false);
  
  // Mock data - in real app, fetch based on params.id
  const pakt = {
    id: '1',
    name: 'Master React Native',
    description: 'Build 5 complete mobile apps and learn advanced patterns',
    category: 'Skills & Learning',
    targetOutcome: 'Launch 5 apps on App Store',
    deadline: '2024-12-31',
    progress: 60,
    milestones: [
      { id: '1', name: 'Complete React Native basics', completed: true, dueDate: '2024-01-15' },
      { id: '2', name: 'Build first app', completed: true, dueDate: '2024-02-15' },
      { id: '3', name: 'Learn navigation', completed: true, dueDate: '2024-03-01' },
      { id: '4', name: 'Build social media app', completed: false, dueDate: '2024-04-15' },
      { id: '5', name: 'Publish to App Store', completed: false, dueDate: '2024-05-01' },
    ],
    reminders: {
      frequency: 'daily',
      time: '09:00',
    },
  };

  const completedMilestones = pakt.milestones.filter(m => m.completed).length;
  const totalMilestones = pakt.milestones.length;

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return '#96E6B3';
    if (progress >= 50) return '#FFD88A';
    if (progress >= 25) return '#9163F2';
    return '#FF6B6B';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Pakt Details</Text>
        
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setShowMenu(true)}
        >
          <MoreVertical size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.paktName}>{pakt.name}</Text>
              <Text style={styles.paktCategory}>{pakt.category}</Text>
            </View>
            <View style={[styles.progressCircle, { borderColor: getProgressColor(pakt.progress) }]}>
              <Text style={[styles.progressText, { color: getProgressColor(pakt.progress) }]}>
                {pakt.progress}%
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { 
                  width: `${pakt.progress}%`,
                  backgroundColor: getProgressColor(pakt.progress)
                }
              ]} 
            />
          </View>

          <Text style={styles.milestoneProgress}>
            {completedMilestones} of {totalMilestones} milestones completed
          </Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{pakt.description}</Text>
        </View>

        {/* Target Outcome */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target Outcome</Text>
          <View style={styles.infoCard}>
            <Target size={20} color="#9163F2" />
            <Text style={styles.infoText}>{pakt.targetOutcome}</Text>
          </View>
        </View>

        {/* Deadline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deadline</Text>
          <View style={styles.infoCard}>
            <Calendar size={20} color="#FFD88A" />
            <Text style={styles.infoText}>{new Date(pakt.deadline).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</Text>
          </View>
        </View>

        {/* Reminders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminders</Text>
          <View style={styles.infoCard}>
            <Clock size={20} color="#96E6B3" />
            <Text style={styles.infoText}>
              {pakt.reminders.frequency.charAt(0).toUpperCase() + pakt.reminders.frequency.slice(1)} at {pakt.reminders.time}
            </Text>
          </View>
        </View>

        {/* Milestones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Milestones</Text>
          {pakt.milestones.map((milestone, index) => (
            <View key={milestone.id} style={styles.milestoneItem}>
              <TouchableOpacity 
                style={styles.milestoneCheckbox}
                onPress={() => {/* Toggle milestone */}}
              >
                {milestone.completed ? (
                  <CheckCircle size={24} color="#96E6B3" />
                ) : (
                  <Circle size={24} color="#CCC" />
                )}
              </TouchableOpacity>
              <View style={styles.milestoneContent}>
                <Text style={[
                  styles.milestoneName,
                  milestone.completed && styles.milestoneNameCompleted
                ]}>
                  {milestone.name}
                </Text>
                <Text style={styles.milestoneDue}>
                  Due: {new Date(milestone.dueDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push('/milestone-builder')}
          >
            <Text style={styles.primaryButtonText}>Add Milestone</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => {/* Share pakt */}}
          >
            <Share2 size={20} color="#9163F2" />
            <Text style={styles.secondaryButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Menu Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuModal}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                // Navigate to edit
              }}
            >
              <Edit size={20} color="#333" />
              <Text style={styles.menuItemText}>Edit Pakt</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                // Share pakt
              }}
            >
              <Share2 size={20} color="#333" />
              <Text style={styles.menuItemText}>Share Pakt</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.menuItem, styles.menuItemDanger]}
              onPress={() => {
                setShowMenu(false);
                // Delete pakt
              }}
            >
              <Trash2 size={20} color="#FF6B6B" />
              <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Delete Pakt</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowMenu(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#9163F2',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  paktName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1625',
    marginBottom: 4,
    flex: 1,
    marginRight: 12,
  },
  paktCategory: {
    fontSize: 14,
    color: '#666',
  },
  progressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  milestoneProgress: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1625',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  milestoneCheckbox: {
    marginRight: 12,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1625',
    marginBottom: 4,
  },
  milestoneNameCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  milestoneDue: {
    fontSize: 12,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#9163F2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#9163F2',
  },
  secondaryButtonText: {
    color: '#9163F2',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  menuItemDanger: {
    borderBottomWidth: 0,
  },
  menuItemTextDanger: {
    color: '#FF6B6B',
  },
  cancelButton: {
    marginTop: 8,
    padding: 18,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
});

