/**
 * SignUpScreen
 * 이메일/비밀번호 기반 회원가입 화면
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { register } from '../../services/auth.service';
import { RegisterRequest } from '../../types/auth.types';

const SignUpScreen = () => {
  // 입력 필드 상태
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');

  // UI 상태
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
  });

  /**
   * 유효성 검사
   */
  const validateForm = (): boolean => {
    const newErrors = {
      email: '',
      password: '',
      passwordConfirm: '',
      nickname: '',
    };

    // 이메일 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    // 비밀번호 검증 (최소 8자, 영문+숫자+특수문자)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (!passwordRegex.test(password)) {
      newErrors.password = '비밀번호는 8자 이상, 영문+숫자+특수문자를 포함해야 합니다.';
    }

    // 비밀번호 확인 검증
    if (!passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호 확인을 입력해주세요.';
    } else if (password !== passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    // 닉네임 검증 (2-20자, 한글/영문/숫자/언더스코어)
    const nicknameRegex = /^[a-zA-Z0-9가-힣_]{2,20}$/;
    if (!nickname) {
      newErrors.nickname = '닉네임을 입력해주세요.';
    } else if (!nicknameRegex.test(nickname)) {
      newErrors.nickname = '닉네임은 2-20자의 한글, 영문, 숫자, 언더스코어만 사용 가능합니다.';
    }

    setErrors(newErrors);

    // 모든 에러가 비어있으면 유효성 검사 통과
    return !Object.values(newErrors).some((error) => error !== '');
  };

  /**
   * 회원가입 처리
   */
  const handleSignUp = async () => {
    // 유효성 검사
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const requestData: RegisterRequest = {
        email,
        password,
        passwordConfirm,
        nickname,
      };

      const response = await register(requestData);

      if (response.success) {
        Alert.alert(
          '회원가입 성공',
          response.message,
          [
            {
              text: '확인',
              onPress: () => {
                // TODO: 로그인 화면으로 이동 또는 자동 로그인
                console.log('회원가입 완료:', response.data.user);
              },
            },
          ]
        );
      }
    } catch (error: any) {
      console.error('회원가입 에러:', error);

      let errorMessage = '회원가입 중 오류가 발생했습니다.';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('회원가입 실패', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>회원가입</Text>
          <Text style={styles.subtitle}>Anipharm에 오신 것을 환영합니다</Text>

          {/* 이메일 입력 */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              placeholder="example@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!loading}
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          {/* 비밀번호 입력 */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={[styles.input, errors.password ? styles.inputError : null]}
              placeholder="8자 이상, 영문+숫자+특수문자"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              editable={!loading}
            />
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          </View>

          {/* 비밀번호 확인 입력 */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>비밀번호 확인</Text>
            <TextInput
              style={[styles.input, errors.passwordConfirm ? styles.inputError : null]}
              placeholder="비밀번호를 다시 입력해주세요"
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              secureTextEntry
              autoCapitalize="none"
              editable={!loading}
            />
            {errors.passwordConfirm ? (
              <Text style={styles.errorText}>{errors.passwordConfirm}</Text>
            ) : null}
          </View>

          {/* 닉네임 입력 */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>닉네임</Text>
            <TextInput
              style={[styles.input, errors.nickname ? styles.inputError : null]}
              placeholder="2-20자의 한글, 영문, 숫자, 언더스코어(_)로 설정해주세요."
              value={nickname}
              onChangeText={setNickname}
              autoCapitalize="none"
              editable={!loading}
            />
            {errors.nickname ? <Text style={styles.errorText}>{errors.nickname}</Text> : null}
          </View>

          {/* 회원가입 버튼 */}
          <TouchableOpacity
            style={[styles.signUpButton, loading ? styles.signUpButtonDisabled : null]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signUpButtonText}>회원가입</Text>
            )}
          </TouchableOpacity>

          {/* 로그인 링크 */}
          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginLinkText}>이미 계정이 있으신가요? </Text>
            <TouchableOpacity disabled={loading}>
              <Text style={styles.loginLink}>로그인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    fontSize: 12,
    color: '#ff4444',
    marginTop: 4,
  },
  signUpButton: {
    height: 52,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  signUpButtonDisabled: {
    backgroundColor: '#ccc',
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginLinkText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default SignUpScreen;
