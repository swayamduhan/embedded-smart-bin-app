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
import type { AppRole } from '../../types/auth';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

const roles: AppRole[] = ['USER', 'STAFF'];

export function SignUpScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const { signUp } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<AppRole>('USER');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError('Email and password are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await signUp({
        email: normalizedEmail,
        password,
        role,
        displayName,
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to create your account');
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
            <Text style={[styles.eyebrow, { color: theme.colors.accent }]}>CREATE ACCOUNT</Text>
            <Text style={[styles.title, { color: theme.colors.text }]}>Sign up for Smart Bin</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
              Choose whether this account is for a citizen or an operations staff member.
            </Text>

            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.colors.textMuted }]}>Name</Text>
                <TextInput
                  placeholder="Your name"
                  placeholderTextColor={theme.colors.textMuted}
                  style={[
                    styles.input,
                    {
                      borderColor: theme.colors.border,
                      color: theme.colors.text,
                      backgroundColor: theme.colors.background,
                    },
                  ]}
                  value={displayName}
                  onChangeText={setDisplayName}
                />
              </View>

              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.colors.textMuted }]}>Role</Text>
                <View style={styles.roleRow}>
                  {roles.map((option) => {
                    const selected = option === role;

                    return (
                      <Pressable
                        key={option}
                        style={[
                          styles.roleButton,
                          {
                            borderColor: selected ? theme.colors.accent : theme.colors.border,
                            backgroundColor: selected ? theme.colors.accent : theme.colors.background,
                          },
                        ]}
                        onPress={() => setRole(option)}
                      >
                        <Text
                          style={[
                            styles.roleLabel,
                            { color: selected ? '#07131D' : theme.colors.text },
                          ]}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

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
                  placeholder="Create a password"
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

              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.colors.textMuted }]}>Confirm password</Text>
                <TextInput
                  autoCapitalize="none"
                  secureTextEntry
                  placeholder="Re-enter your password"
                  placeholderTextColor={theme.colors.textMuted}
                  style={[
                    styles.input,
                    {
                      borderColor: theme.colors.border,
                      color: theme.colors.text,
                      backgroundColor: theme.colors.background,
                    },
                  ]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
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
                  <Text style={styles.submitLabel}>Create account</Text>
                )}
              </Pressable>

              <Pressable style={styles.linkButton} onPress={() => navigation.goBack()}>
                <Text style={[styles.linkLabel, { color: theme.colors.accent }]}>
                  Already have an account? Log in
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
    paddingVertical: 24,
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
  roleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleLabel: {
    fontSize: 15,
    fontWeight: '900',
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
