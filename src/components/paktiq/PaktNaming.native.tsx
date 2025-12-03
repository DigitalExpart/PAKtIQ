import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';

type PaktNamingProps = {
  currentPakt: any;
  onUpdate: (data: any) => void;
  onContinue: () => void;
  onBack: () => void;
  navigation?: any;
};

export default function PaktNaming({ currentPakt, onUpdate, onContinue, onBack }: PaktNamingProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Name Your Pakt</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter name"
          value={currentPakt.name || ''}
          onChangeText={(text) => onUpdate({ name: text })}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          multiline
          value={currentPakt.description || ''}
          onChangeText={(text) => onUpdate({ description: text })}
        />
        <TouchableOpacity style={styles.button} onPress={onContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>Back</Text>
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
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#9163F2',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  backText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});

