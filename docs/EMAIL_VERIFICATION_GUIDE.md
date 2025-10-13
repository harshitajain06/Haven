# Email Verification Implementation Guide

## 📧 Production-Ready Email Verification for Haven

This guide covers implementing real email verification using Firebase Authentication for your Haven app.

---

## Table of Contents
1. [Overview](#overview)
2. [Firebase Setup](#firebase-setup)
3. [Implementation Methods](#implementation-methods)
4. [Code Implementation](#code-implementation)
5. [Testing](#testing)
6. [Security Considerations](#security-considerations)
7. [Troubleshooting](#troubleshooting)

---

## Overview

Firebase offers two main approaches for email verification:

### Option 1: Built-in Email Verification (Recommended)
✅ Easy to implement
✅ No backend required
✅ Firebase handles email sending
✅ Professional email templates
❌ Users get a link, not a code

### Option 2: Custom Email with Code
✅ Show code in email (like your design)
✅ More control over email content
❌ Requires Firebase Functions or backend
❌ More complex setup

---

## Firebase Setup

### Step 1: Configure Email Templates

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `haven-94524`
3. Go to **Authentication** → **Templates**
4. Click on **Email verification**
5. Customize the template:

```
Subject: Verify your Haven account

Body:
Hello %DISPLAY_NAME%,

Thank you for signing up for Haven. To complete your registration, please verify your email address by clicking the link below:

%LINK%

If you didn't create a Haven account, you can safely ignore this email.

Best regards,
The Haven Team
```

### Step 2: Configure Authorized Domains

1. Go to **Authentication** → **Settings**
2. Under **Authorized domains**, add:
   - `localhost` (for testing)
   - Your production domain
   - Your Expo app domain

---

## Implementation Methods

## Method 1: Built-in Email Link Verification (Easiest)

### Advantages
- No backend needed
- Firebase handles everything
- Automatic email retry
- Built-in security

### Implementation

#### Step 1: Update Signup Flow

Replace `app/auth/signup.jsx`:

```javascript
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../config/firebase';

export default function SignUpScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        fullName,
        email,
        createdAt: new Date().toISOString(),
        location: 'Manchester, UK',
        emailVerified: false,
      });

      // Send verification email
      await sendEmailVerification(userCredential.user, {
        url: 'exp://192.168.1.9:8084', // Your app URL
        handleCodeInApp: true,
      });

      Alert.alert(
        'Verification Email Sent',
        'Please check your email and click the verification link to continue.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/auth/verify-pending')
          }
        ]
      );

    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Sign Up Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... rest of your JSX (same as before)
  );
}
```

#### Step 2: Create Verification Pending Screen

Create `app/auth/verify-pending.jsx`:

```javascript
import { useRouter } from 'expo-router';
import { reload } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { auth } from '../../config/firebase';

export default function VerifyPendingScreen() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    // Auto-check every 5 seconds
    const interval = setInterval(checkVerification, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Countdown for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const checkVerification = async () => {
    if (!auth.currentUser) return;

    setChecking(true);
    try {
      await reload(auth.currentUser);
      
      if (auth.currentUser.emailVerified) {
        Alert.alert('Success', 'Email verified! Welcome to Haven!', [
          {
            text: 'Continue',
            onPress: () => router.replace('/onboarding/step1')
          }
        ]);
      }
    } catch (error) {
      console.error('Error checking verification:', error);
    } finally {
      setChecking(false);
    }
  };

  const resendVerification = async () => {
    if (!auth.currentUser || countdown > 0) return;

    try {
      await sendEmailVerification(auth.currentUser);
      Alert.alert('Success', 'Verification email resent!');
      setCountdown(60);
    } catch (error) {
      Alert.alert('Error', 'Failed to resend email. Please try again.');
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

      <Text style={styles.title}>Check Your Email</Text>
      <Text style={styles.subtitle}>
        We've sent a verification link to{'\n'}
        {auth.currentUser?.email}
      </Text>

      <Text style={styles.instructions}>
        1. Open your email app{'\n'}
        2. Find the email from Haven{'\n'}
        3. Click the verification link{'\n'}
        4. Come back to this screen
      </Text>

      <TouchableOpacity 
        style={styles.checkButton}
        onPress={checkVerification}
        disabled={checking}
      >
        {checking ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.checkButtonText}>I've Verified My Email</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.resendButton, countdown > 0 && styles.disabledButton]}
        onPress={resendVerification}
        disabled={countdown > 0}
      >
        <Text style={styles.resendButtonText}>
          {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Email'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backLink}>Change Email Address</Text>
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
    marginBottom: 30,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#F4C430',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    lineHeight: 20,
  },
  instructions: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    lineHeight: 24,
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 10,
  },
  checkButton: {
    backgroundColor: '#F4C430',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  checkButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendButton: {
    borderWidth: 1,
    borderColor: '#F4C430',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  disabledButton: {
    opacity: 0.5,
  },
  resendButtonText: {
    color: '#F4C430',
    fontSize: 14,
    fontWeight: '600',
  },
  backLink: {
    color: '#4A90E2',
    textAlign: 'center',
    fontSize: 14,
  },
});
```

---

## Method 2: Custom 6-Digit Code (Advanced)

This requires Firebase Cloud Functions (backend).

### Prerequisites
- Firebase Blaze Plan (pay-as-you-go)
- Node.js installed
- Firebase CLI installed

### Step 1: Install Firebase Functions

```bash
npm install -g firebase-tools
firebase login
firebase init functions
```

### Step 2: Create Cloud Function

Create `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configure email transporter (use Gmail, SendGrid, or Mailgun)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password' // Use App Password, not regular password
  }
});

// Generate 6-digit code
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification email with code
exports.sendVerificationCode = functions.https.onCall(async (data, context) => {
  const { email, displayName } = data;
  
  // Generate code
  const code = generateCode();
  
  // Store code in Firestore (expires in 10 minutes)
  await admin.firestore().collection('verificationCodes').doc(email).set({
    code: code,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + 10 * 60 * 1000)
    ),
    verified: false
  });

  // Send email
  const mailOptions = {
    from: 'Haven <noreply@haven.com>',
    to: email,
    subject: 'Verify your Haven account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Haven, ${displayName}!</h2>
        <p>Your verification code is:</p>
        <div style="background: #F4C430; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
          <h1 style="margin: 0; font-size: 48px; letter-spacing: 8px;">${code}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't create a Haven account, please ignore this email.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
  
  return { success: true };
});

// Verify code
exports.verifyCode = functions.https.onCall(async (data, context) => {
  const { email, code } = data;
  
  const doc = await admin.firestore().collection('verificationCodes').doc(email).get();
  
  if (!doc.exists) {
    throw new functions.https.HttpsError('not-found', 'No verification code found');
  }
  
  const data = doc.data();
  
  // Check if expired
  if (data.expiresAt.toDate() < new Date()) {
    throw new functions.https.HttpsError('failed-precondition', 'Code expired');
  }
  
  // Check if code matches
  if (data.code !== code) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid code');
  }
  
  // Mark as verified
  await doc.ref.update({ verified: true });
  
  return { success: true };
});
```

### Step 3: Deploy Functions

```bash
cd functions
npm install nodemailer
cd ..
firebase deploy --only functions
```

### Step 4: Update App Code

Update `app/auth/signup.jsx`:

```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

const handleSignUp = async () => {
  // ... validation code ...
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // ... update profile and Firestore ...
    
    // Send verification code
    const sendCode = httpsCallable(functions, 'sendVerificationCode');
    await sendCode({ 
      email: email, 
      displayName: fullName 
    });
    
    Alert.alert('Success', 'Verification code sent to your email!');
    router.replace('/auth/verify');
    
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};
```

Update `app/auth/verify.jsx`:

```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

const handleVerify = async () => {
  if (!code || code.length !== 6) {
    Alert.alert('Error', 'Please enter the 6-digit code');
    return;
  }
  
  setLoading(true);
  try {
    const verifyCode = httpsCallable(functions, 'verifyCode');
    const result = await verifyCode({ 
      email: auth.currentUser?.email, 
      code: code 
    });
    
    if (result.data.success) {
      Alert.alert('Success', 'Email verified!');
      router.replace('/onboarding/step1');
    }
  } catch (error) {
    Alert.alert('Error', 'Invalid or expired code');
  } finally {
    setLoading(false);
  }
};
```

---

## Testing

### Test Email Verification Locally

1. **Use a real email** (Gmail, Outlook, etc.)
2. **Check spam folder** if email doesn't arrive
3. **Test on different devices** (iOS, Android, web)

### Testing Tips

```javascript
// For development: Add test mode
const IS_DEV = __DEV__;

if (IS_DEV) {
  console.log('Verification code:', code);
  // Skip email in dev mode
}
```

---

## Security Considerations

### ⚠️ Important Security Rules

1. **Rate Limiting**
```javascript
// Limit verification attempts
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes
```

2. **Code Expiration**
```javascript
// Always expire codes
expiresAt: Date.now() + (10 * 60 * 1000) // 10 minutes
```

3. **Firestore Security Rules**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /verificationCodes/{email} {
      allow read, write: if request.auth != null && request.auth.token.email == email;
    }
  }
}
```

4. **Email Protection**
```javascript
// Don't expose email in error messages
// Don't log sensitive data
// Use HTTPS only
```

---

## Production Checklist

- [ ] Configure custom email domain
- [ ] Set up SPF/DKIM records
- [ ] Test email delivery to major providers (Gmail, Outlook, Yahoo)
- [ ] Add email unsubscribe option
- [ ] Implement rate limiting
- [ ] Add email verification badge in UI
- [ ] Handle expired codes gracefully
- [ ] Log verification attempts for security
- [ ] Add resend code functionality
- [ ] Test on all platforms (iOS, Android, Web)

---

## Troubleshooting

### Emails Not Arriving

1. **Check Firebase Console Logs**
2. **Verify email provider settings**
3. **Check spam/junk folders**
4. **Verify authorized domains**

### Code Verification Fails

1. **Check code expiration**
2. **Verify Firestore security rules**
3. **Check for typos in code entry**
4. **Verify user authentication state**

### Common Errors

```javascript
// Error: PERMISSION_DENIED
// Fix: Update Firestore security rules

// Error: Email not sent
// Fix: Check email configuration in Firebase Console

// Error: Code expired
// Fix: Increase expiration time or implement resend
```

---

## Recommended Approach for Haven

For your Haven app, I recommend **Method 1 (Built-in Email Link Verification)** because:

✅ No backend/functions needed
✅ Lower cost (free tier)
✅ More reliable email delivery
✅ Firebase handles security
✅ Easier to maintain

You can always upgrade to Method 2 later if you need custom code verification.

---

## Need Help?

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Email Verification Guide](https://firebase.google.com/docs/auth/web/manage-users#send_a_user_a_verification_email)
- [Cloud Functions for Firebase](https://firebase.google.com/docs/functions)

---

*Last Updated: October 2024*
*Version: 1.0*

