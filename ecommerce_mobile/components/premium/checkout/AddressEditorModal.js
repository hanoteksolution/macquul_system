import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import usePremiumTheme from '../../../hooks/usePremiumTheme';
import useThemedStyles from '../../../hooks/useThemedStyles';
import premiumAlert from '../../../utils/premiumAlert';

const EMPTY = { line1: '', line2: '' };

export default function AddressEditorModal({ visible, initial, onClose, onSave }) {
  const premium = usePremiumTheme();
  const styles = useThemedStyles(createStyles);


  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (visible) {
      setForm({
        line1: initial?.line1 || '',
        line2: initial?.line2 || '',
      });
    }
  }, [visible, initial]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = () => {
    if (!form.line1.trim()) {
      premiumAlert('Missing address', 'Please enter your street or delivery location.', [{ text: 'OK' }], {
        variant: 'warning',
      });
      return;
    }
    onSave({
      line1: form.line1.trim(),
      line2: form.line2.trim(),
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetWrap}
        >
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <Text style={styles.title}>Delivery address</Text>
            <Text style={styles.hint}>Your name is taken from your account.</Text>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.label}>Street / location *</Text>
              <TextInput
                style={[styles.input, styles.inputMulti]}
                value={form.line1}
                onChangeText={(v) => set('line1', v)}
                placeholder="Building, street, area"
                multiline
                placeholderTextColor={premium.textMuted}
              />
              <Text style={styles.label}>City / district (optional)</Text>
              <TextInput
                style={styles.input}
                value={form.line2}
                onChangeText={(v) => set('line2', v)}
                placeholder="City, district"
                placeholderTextColor={premium.textMuted}
              />
            </ScrollView>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveText}>Save address</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const createStyles = (premium) => ({

  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15,23,42,0.45)' },
  sheetWrap: { maxHeight: '85%' },
  sheet: {
    backgroundColor: premium.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: premium.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: '800', color: premium.text },
  hint: { fontSize: 13, color: premium.textMuted, marginTop: 4, marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600', color: premium.textSecondary, marginBottom: 6, marginTop: 8 },
  input: {
    backgroundColor: premium.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: premium.text,
    borderWidth: 1,
    borderColor: premium.border,
  },
  inputMulti: { minHeight: 72, textAlignVertical: 'top' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: premium.background,
    alignItems: 'center',
  },
  cancelText: { fontWeight: '700', color: premium.textSecondary },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: premium.indigo,
    alignItems: 'center',
  },
  saveText: { fontWeight: '800', color: '#fff' },
});

