# Haven App Navigation Guide

## 🚀 How to See Login/Signup Screens

### Current App Flow:

1. **Welcome Screen** (First Screen)
   - Location: `app/(tabs)/welcome.jsx`
   - Shows: "Welcome to Haven" with Sign Up and Log In links
   - This is now your **landing page**

2. **From Welcome Screen → Auth Screens**
   - Tap "Sign Up" → Goes to `/auth/signup`
   - Tap "Log In" → Goes to `/auth/login`

3. **Auth Screens** (Beautiful UI you designed)
   - **Login**: `app/auth/login.jsx`
     - Email, Password fields
     - "Forgot Password?" link
     - Login button
   
   - **Sign Up**: `app/auth/signup.jsx`
     - Full Name, Email, Password, Confirm Password
     - "Already have an account?" link
     - Sign Up button
   
   - **Verify**: `app/auth/verify.jsx`
     - Code input for email verification
   
   - **Forgot Password**: `app/auth/forgot.jsx`
     - Email input for password reset

4. **After Login → Onboarding**
   - Step 1, 2, 3 screens explaining the app
   - Skip option or "Get Started" at the end

5. **Main App**
   - Home Feed
   - Upload
   - Activity
   - Profile

## 🔑 Quick Access Routes

When the app is running, you can manually navigate to:
- Welcome: `/(tabs)/welcome`
- Login: `/auth/login`
- Sign Up: `/auth/signup`
- Home: `/(tabs)/HomeScreen`

## 📱 Testing the Flow

1. **Open the app** (will show Welcome screen)
2. **Tap "Sign Up"** to test registration
3. **Create an account** with:
   - Name: Test User
   - Email: test@example.com
   - Password: test123 (min 6 chars)
4. **After signup** → Goes to verification screen
5. **Enter any code** → Goes to onboarding
6. **Complete onboarding** → Main app opens

## 🔄 To Reset Authentication

If you want to see the Welcome/Login screens again:
1. In the app, go to Profile → Settings
2. Use the logout function
3. Or use Firebase Console to delete test accounts

## 🎨 Screen Designs Implemented

All the screens from your images are now implemented:
- ✅ Welcome screen with Haven logo
- ✅ Login screen with yellow button
- ✅ Sign Up with all fields
- ✅ Verification screen
- ✅ Forgot password screen
- ✅ Onboarding Steps 1-3
- ✅ All main app screens

## 🚦 Current Status

The app will now start at the **Welcome Screen** when you:
- First install the app
- Are logged out
- Open the app fresh

Happy testing! 🎉

