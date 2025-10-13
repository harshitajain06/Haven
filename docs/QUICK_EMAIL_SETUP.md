# Quick Email Verification Setup

## 🚀 5-Minute Setup (Recommended Method)

This is the easiest way to add real email verification to Haven.

### Step 1: Update Firebase Configuration (Done ✅)
Your Firebase is already configured in `config/firebase.js`

### Step 2: Install Required Package (if not already installed)
```bash
npm install firebase
```

### Step 3: Replace Signup Code

Copy this into `app/auth/signup.jsx` - replace the `handleSignUp` function:

```javascript
import { sendEmailVerification } from 'firebase/auth';

const handleSignUp = async () => {
  if (!fullName || !email || !password || !confirmPassword) {
    Alert.alert('Error', 'Please fill in all fields');
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert('Error', 'Passwords do not match');
    return;
  }

  if (password.length < 6) {
    Alert.alert('Error', 'Password must be at least 6 characters');
    return;
  }

  setLoading(true);
  try {
    // Create account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: fullName,
    });

    // Save to Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      fullName,
      email,
      createdAt: new Date().toISOString(),
      location: 'Manchester, UK',
      emailVerified: false,
    });

    // 🎯 SEND VERIFICATION EMAIL
    await sendEmailVerification(userCredential.user);

    // Show success message
    Alert.alert(
      'Check Your Email! 📧',
      `We've sent a verification link to ${email}. Please check your email and click the link to verify your account.`,
      [{ text: 'OK', onPress: () => router.replace('/auth/email-sent') }]
    );

  } catch (error) {
    Alert.alert('Sign Up Error', error.message);
  } finally {
    setLoading(false);
  }
};
```

### Step 4: Create Email Sent Screen

Create `app/auth/email-sent.jsx`:

```javascript
import { useRouter } from 'expo-router';
import { reload, sendEmailVerification } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { auth } from '../../config/firebase';

export default function EmailSentScreen() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);

  useEffect(() => {
    // Countdown for resend button
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const checkVerification = async () => {
    setChecking(true);
    try {
      await reload(auth.currentUser);
      
      if (auth.currentUser?.emailVerified) {
        Alert.alert('✅ Verified!', 'Your email has been verified successfully!', [
          { text: 'Continue', onPress: () => router.replace('/onboarding/step1') }
        ]);
      } else {
        Alert.alert('Not Yet', 'Please click the link in your email first, then try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Please try again');
    } finally {
      setChecking(false);
    }
  };

  const resendEmail = async () => {
    if (resendCountdown > 0) return;
    
    try {
      await sendEmailVerification(auth.currentUser);
      Alert.alert('✅ Sent!', 'Verification email sent again!');
      setResendCountdown(60);
    } catch (error) {
      Alert.alert('Error', 'Failed to resend. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Image 
            source={require('../../assets/images/icon.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      <Text style={styles.emoji}>📧</Text>
      <Text style={styles.title}>Check Your Email</Text>
      <Text style={styles.subtitle}>
        We sent a verification link to:{'\n'}
        <Text style={styles.email}>{auth.currentUser?.email}</Text>
      </Text>

      <View style={styles.stepsContainer}>
        <Text style={styles.stepTitle}>Next Steps:</Text>
        <Text style={styles.step}>1. Open your email app</Text>
        <Text style={styles.step}>2. Find the email from Haven</Text>
        <Text style={styles.step}>3. Click "Verify Email" button</Text>
        <Text style={styles.step}>4. Come back and tap "I Verified"</Text>
      </View>

      <TouchableOpacity 
        style={styles.verifyButton}
        onPress={checkVerification}
        disabled={checking}
      >
        {checking ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.verifyButtonText}>I Verified My Email ✓</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.resendButton, resendCountdown > 0 && styles.disabledButton]}
        onPress={resendEmail}
        disabled={resendCountdown > 0}
      >
        <Text style={styles.resendText}>
          {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Email'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.changeEmail}>Wrong email? Go back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#F4C430',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 60,
    height: 60,
  },
  emoji: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    lineHeight: 22,
  },
  email: {
    fontWeight: '600',
    color: '#000',
  },
  stepsContainer: {
    backgroundColor: '#F9F9F9',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  step: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    paddingLeft: 10,
  },
  verifyButton: {
    backgroundColor: '#F4C430',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  verifyButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendButton: {
    borderWidth: 2,
    borderColor: '#F4C430',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.4,
  },
  resendText: {
    color: '#F4C430',
    fontSize: 14,
    fontWeight: '600',
  },
  changeEmail: {
    color: '#4A90E2',
    textAlign: 'center',
    fontSize: 14,
  },
});
```

### Step 5: Test It!

1. Reload your app (`r` in terminal)
2. Try signing up with a **real email** (your own)
3. Check your inbox (and spam folder)
4. Click the verification link
5. Come back and tap "I Verified My Email"

### That's It! 🎉

You now have real email verification working!

---

## Customize Email Template (Optional)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Templates**
4. Click **Email address verification**
5. Customize:
   - From name: "Haven"
   - Subject: "Welcome to Haven - Verify Your Email"
   - Add your app logo
   - Customize the message

---

## Troubleshooting

**Email not arriving?**
- Check spam/junk folder
- Try a different email provider (Gmail usually works best)
- Wait 1-2 minutes (sometimes delayed)

**Link not working?**
- Make sure you're clicking the link from the same device
- Try copying the link and opening in browser
- Make sure you're logged into the app

**Need to test multiple times?**
- Use different email addresses
- Or delete test accounts from Firebase Console

---

## Production Ready! ✅

This implementation is:
- ✅ Secure (Firebase handles all security)
- ✅ Free (no backend needed)
- ✅ Reliable (professional email delivery)
- ✅ Scalable (handles any number of users)

For advanced features (custom 6-digit codes, SMS verification), see the full guide: `EMAIL_VERIFICATION_GUIDE.md`

