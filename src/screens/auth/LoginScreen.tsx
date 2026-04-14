import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AnimatedCard } from '../../components/AnimatedCard';
import { useAuth } from '../../context/AuthProvider';
import { useAppTheme } from '../../hooks/useAppTheme';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    try {
      setSubmitting(true);
      setError(null);
      await signIn(email, password);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to sign in');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <LinearGradient colors={theme.colors.cardGradient} style={styles.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.overlay}>
          <AnimatedCard style={[styles.card, { backgroundColor: theme.colors.surface }]} delay={60}>
            <Text style={[styles.eyebrow, { color: theme.colors.accent }]}>SMART BIN CONTROL</Text>
            <Text style={[styles.title, { color: theme.colors.text }]}>Log in to monitor the live bin network</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
              Staff users get alert routing and push notifications. Citizens see nearby available bins and points.
            </Text>

            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.colors.textMuted }]}>Email</Text>
                <TextInput
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  placeholder="name@example.com"
                  placeholderTextColor={theme.colors.textMuted}
                  style={[
                    styles.input,
                    {
                      borderColor: theme.colors.border,
                      color: theme.colors.text,
                      backgroundColor: theme.colors.background,
                    },
                  ]}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.colors.textMuted }]}>Password</Text>
                <TextInput
                  autoCapitalize="none"
                  secureTextEntry
                  placeholder="Enter your password"
                  placeholderTextColor={theme.colors.textMuted}
                  style={[
                    styles.input,
                    {
                      borderColor: theme.colors.border,
                      color: theme.colors.text,
                      backgroundColor: theme.colors.background,
                    },
                  ]}
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              {error ? <Text style={[styles.errorText, { color: theme.colors.danger }]}>{error}</Text> : null}

              <Pressable
                style={[styles.submitButton, { backgroundColor: theme.colors.accent }]}
                onPress={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#07131D" />
                ) : (
                  <Text style={styles.submitLabel}>Continue</Text>
                )}
              </Pressable>

              <Pressable style={styles.linkButton} onPress={() => navigation.navigate('SignUp')}>
                <Text style={[styles.linkLabel, { color: theme.colors.accent }]}>
                  New here? Create an account
                </Text>
              </Pressable>
            </View>
          </AnimatedCard>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 28,
    padding: 24,
    gap: 16,
  },
  eyebrow: {
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  form: {
    gap: 14,
    marginTop: 8,
  },
  field: {
    gap: 8,
  },
  label: {
    fontWeight: '700',
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  submitButton: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    marginTop: 8,
  },
  submitLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: '#07131D',
  },
  errorText: {
    fontSize: 13,
    lineHeight: 18,
  },
  linkButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  linkLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
});
