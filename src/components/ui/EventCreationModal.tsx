import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CreateEventInput } from '../../services/googleCalendar';

interface EventCreationModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateEvent: (event: CreateEventInput) => Promise<void>;
}

const EventCreationModal: React.FC<EventCreationModalProps> = ({
  visible,
  onClose,
  onCreateEvent,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 60 * 60 * 1000)); // 1 hour from now
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an event title');
      return;
    }

    if (endDate <= startDate) {
      Alert.alert('Error', 'End time must be after start time');
      return;
    }

    setLoading(true);
    try {
      await onCreateEvent({
        summary: title.trim(),
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        start: startDate,
        end: endDate,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setLocation('');
      setStartDate(new Date());
      setEndDate(new Date(Date.now() + 60 * 60 * 1000));
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setTitle('');
      setDescription('');
      setLocation('');
      setStartDate(new Date());
      setEndDate(new Date(Date.now() + 60 * 60 * 1000));
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View style={styles.modalContent}>
          <LinearGradient
            colors={['#1A0B2E', '#2D1B4E', '#3D2B5E']}
            style={styles.gradient}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Create Event</Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
                disabled={loading}
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Title Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Event Title *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Add title"
                  placeholderTextColor="#6B7280"
                  value={title}
                  onChangeText={setTitle}
                  editable={!loading}
                />
              </View>

              {/* Start Date/Time */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Start</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowStartPicker(true)}
                  disabled={loading}
                >
                  <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
                  <Text style={styles.dateText}>{formatDateTime(startDate)}</Text>
                </TouchableOpacity>
                {showStartPicker && (
                  <View style={styles.pickerContainer}>
                    <DateTimePicker
                      value={startDate}
                      mode="datetime"
                      is24Hour={false}
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      textColor="#FFFFFF"
                      themeVariant="dark"
                      accentColor="#E88B6B"
                      onChange={(event, selectedDate) => {
                        if (Platform.OS === 'android') {
                          setShowStartPicker(false);
                        }
                        if (selectedDate) {
                          setStartDate(selectedDate);
                          // Auto-update end date if it's before new start date
                          if (endDate <= selectedDate) {
                            setEndDate(new Date(selectedDate.getTime() + 60 * 60 * 1000));
                          }
                        }
                        if (Platform.OS === 'android' && event.type === 'dismissed') {
                          setShowStartPicker(false);
                        }
                      }}
                    />
                    {Platform.OS === 'ios' && (
                      <View style={styles.pickerActions}>
                        <TouchableOpacity
                          style={styles.pickerButton}
                          onPress={() => setShowStartPicker(false)}
                        >
                          <Text style={styles.pickerButtonText}>Done</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              </View>

              {/* End Date/Time */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>End</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowEndPicker(true)}
                  disabled={loading}
                >
                  <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
                  <Text style={styles.dateText}>{formatDateTime(endDate)}</Text>
                </TouchableOpacity>
                {showEndPicker && (
                  <View style={styles.pickerContainer}>
                    <DateTimePicker
                      value={endDate}
                      mode="datetime"
                      is24Hour={false}
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      textColor="#FFFFFF"
                      themeVariant="dark"
                      accentColor="#E88B6B"
                      onChange={(event, selectedDate) => {
                        if (Platform.OS === 'android') {
                          setShowEndPicker(false);
                        }
                        if (selectedDate) {
                          setEndDate(selectedDate);
                        }
                        if (Platform.OS === 'android' && event.type === 'dismissed') {
                          setShowEndPicker(false);
                        }
                      }}
                      minimumDate={startDate}
                    />
                    {Platform.OS === 'ios' && (
                      <View style={styles.pickerActions}>
                        <TouchableOpacity
                          style={styles.pickerButton}
                          onPress={() => setShowEndPicker(false)}
                        >
                          <Text style={styles.pickerButtonText}>Done</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              </View>

              {/* Location Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Location</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Add location"
                  placeholderTextColor="#6B7280"
                  value={location}
                  onChangeText={setLocation}
                  editable={!loading}
                />
              </View>

              {/* Description Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Add description"
                  placeholderTextColor="#6B7280"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  editable={!loading}
                />
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleClose}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.createButton, loading && styles.buttonDisabled]}
                onPress={handleCreate}
                disabled={loading}
              >
                <Text style={styles.createButtonText}>
                  {loading ? 'Creating...' : 'Create Event'}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    height: '85%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  pickerContainer: {
    marginTop: 12,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: Platform.OS === 'ios' ? 16 : 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minHeight: Platform.OS === 'ios' ? 200 : 'auto',
    overflow: 'hidden',
  },
  pickerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  pickerButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#E88B6B',
    borderRadius: 8,
  },
  pickerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingTop: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#E88B6B',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default EventCreationModal;

