import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

const REPORT_TYPES = [
  { id: 'bullying', label: 'Bullying', icon: 'person.2.fill' },
  { id: 'harassment', label: 'Harassment', icon: 'exclamationmark.bubble.fill' },
  { id: 'violence', label: 'Violence', icon: 'exclamationmark.triangle.fill' },
  { id: 'other', label: 'Other', icon: 'ellipsis.circle.fill' },
] as const;

export default function ReportScreen() {
  const { profile } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !selectedType) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('reports')
        .insert({
          user_id: profile!.id,
          title: title.trim(),
          description: description.trim(),
          type: selectedType as any,
          status: 'pending',
        });

      if (error) throw error;

      Alert.alert(
        'Report Submitted',
        'Your report has been submitted successfully. School administrators will review it and take appropriate action.',
        [
          {
            text: 'OK',
            onPress: () => {
              setTitle('');
              setDescription('');
              setSelectedType('');
            }
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', 'Failed to submit report. Please try again.');
      console.error('Error submitting report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Report an Incident</Text>
        <Text style={[styles.subtitle, { color: theme.secondary }]}>
          Your report will be reviewed by school administrators. All reports are taken seriously.
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={[styles.label, { color: theme.text }]}>Type of Incident</Text>
        <View style={styles.typeGrid}>
          {REPORT_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeCard,
                { 
                  backgroundColor: selectedType === type.id ? theme.accent : theme.card,
                  borderColor: selectedType === type.id ? theme.accent : theme.border,
                }
              ]}
              onPress={() => setSelectedType(type.id)}
            >
              <IconSymbol 
                name={type.icon as any} 
                size={24} 
                color={selectedType === type.id ? '#FFFFFF' : theme.icon} 
              />
              <Text style={[
                styles.typeLabel,
                { color: selectedType === type.id ? '#FFFFFF' : theme.text }
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: theme.text }]}>Title</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
          placeholder="Brief description of the incident"
          placeholderTextColor={theme.secondary}
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />

        <Text style={[styles.label, { color: theme.text }]}>Description</Text>
        <TextInput
          style={[styles.textArea, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
          placeholder="Provide detailed information about what happened, when, where, and who was involved..."
          placeholderTextColor={theme.secondary}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          maxLength={1000}
        />

        <View style={styles.infoBox}>
          <IconSymbol name="info.circle.fill" size={20} color={theme.accent} />
          <Text style={[styles.infoText, { color: theme.secondary }]}>
            Your identity will be kept confidential. Only authorized school personnel will have access to this report.
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            { 
              backgroundColor: theme.accent,
              opacity: loading ? 0.7 : 1,
            }
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitText}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  form: {
    gap: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    gap: 8,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  submitButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});