# Haven - Child Protection & Support App

Haven is a comprehensive React Native application built with Expo, designed to provide support and protection for children and young people in need. The app features authentication, social features, messaging, and case management.

## Features

### Authentication
- **Login/Register**: Secure authentication using Firebase Auth
- **Email Verification**: Code-based verification system
- **Password Reset**: Forgot password functionality
- **Onboarding**: 3-step introduction for new users

### Main Features
- **Home Feed**: View and interact with posts from the community
- **Create Posts**: Share concerns with picture/video/audio support
- **Notifications**: Stay updated on interactions and responses
- **Messages**: Private messaging with Child Protection Services chatbot
- **Profile Management**: Personal profile with stats and settings
- **Settings**: Comprehensive settings including:
  - Account and App settings
  - Privacy & Security
  - Notification preferences
  - Case Progress tracking
  - Access Adult Zone
  - Post Controls
  - Parental Control
  - Donations
  - Help and Support

### Special Features
- **Case Progress Tracking**: Monitor ongoing cases with progress indicators
- **Adult Zone**: Age-verified section for adult content
- **Chatbot Integration**: AI-powered chat with Child Protection Services
- **Activity Hub**: Quick access to notifications, messages, and case updates

## Tech Stack

- **Frontend**: React Native with Expo
- **Navigation**: Expo Router
- **Backend**: Firebase
  - Authentication
  - Firestore Database
  - Cloud Storage
- **UI Components**: React Native Paper, Ionicons
- **State Management**: React Hooks

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Haven
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore Database
   - Enable Cloud Storage
   - Update `config/firebase.js` with your Firebase configuration:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
     measurementId: "YOUR_MEASUREMENT_ID"
   };
   ```

4. **Start the development server**
   ```bash
   npx expo start --clear
   ```

5. **Run on device/emulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on physical device

## Project Structure

```
Haven/
├── app/
│   ├── (tabs)/              # Tab navigation screens
│   │   ├── HomeScreen.jsx    # Main feed
│   │   ├── UploadScreen.jsx  # Create posts
│   │   ├── ActivityScreen.jsx # Activity hub
│   │   ├── ProfileScreen.jsx  # User profile
│   │   ├── index.jsx         # Auth entry point
│   │   └── _layout.jsx       # Tab layout
│   ├── auth/                # Authentication screens
│   │   ├── login.jsx
│   │   ├── signup.jsx
│   │   ├── verify.jsx
│   │   └── forgot.jsx
│   ├── onboarding/          # Onboarding screens
│   │   ├── step1.jsx
│   │   ├── step2.jsx
│   │   └── step3.jsx
│   ├── screens/             # Additional screens
│   │   ├── notifications.jsx
│   │   ├── messages.jsx
│   │   ├── chat.jsx
│   │   ├── settings.jsx
│   │   ├── create-post.jsx
│   │   ├── adult-zone.jsx
│   │   ├── thank-you.jsx
│   │   └── case-progress.jsx
│   └── _layout.tsx          # Root layout
├── assets/                  # Images, fonts, etc.
├── components/              # Reusable components
├── config/
│   └── firebase.js          # Firebase configuration
├── constants/               # App constants
├── hooks/                   # Custom hooks
└── services/               # API services

```

## Firebase Collections Structure

### Users Collection
```javascript
{
  uid: "user_id",
  fullName: "John Doe",
  email: "john@example.com",
  createdAt: "timestamp",
  location: "Manchester, UK"
}
```

### Posts Collection
```javascript
{
  id: "post_id",
  content: "Post content",
  imageUrl: "url_to_image",
  userId: "user_id",
  userName: "John Doe",
  userPhoto: "url_to_photo",
  location: "Location",
  createdAt: "timestamp",
  likes: ["user_id1", "user_id2"],
  likeCount: 5,
  comments: [],
  commentCount: 0
}
```

### Notifications Collection
```javascript
{
  id: "notification_id",
  userId: "target_user_id",
  userName: "Friend Name",
  userPhoto: "url_to_photo",
  content: "Notification text",
  createdAt: "timestamp",
  read: false
}
```

## Features Breakdown

### Authentication Flow
1. Welcome Screen → Login/Signup
2. Email Verification (optional)
3. Onboarding (Steps 1-3)
4. Main App (Home)

### Post Creation Flow
1. Navigate to Upload tab
2. Add media (photo/video/audio)
3. Write content
4. Post to Firebase
5. Display in Home feed

### Messaging Flow
1. Navigate to Messages
2. Select conversation (or start with Child Protection Services)
3. Chat interface with text/media support
4. Real-time updates

## Security Considerations

⚠️ **Important**: This is a child protection app, so extra security measures are crucial:

1. **Authentication**: Always verify user authentication before accessing sensitive data
2. **Data Privacy**: Ensure all user data is properly secured and encrypted
3. **Content Moderation**: Implement content moderation for posts
4. **Age Verification**: Properly verify age for Adult Zone access
5. **Case Data**: Encrypt sensitive case information
6. **Reporting**: Implement proper reporting mechanisms for abuse

## Environment Variables

Create a `.env` file in the root directory:

```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
```

## Troubleshooting

### Metro Bundler Cache Issues
If you encounter module resolution errors:
```bash
npx expo start --clear
```

### Firebase Authentication Errors
- Ensure Firebase Auth is enabled in Firebase Console
- Check that email/password provider is enabled
- Verify Firebase configuration in `config/firebase.js`

### Image/Media Upload Issues
- Ensure Firebase Storage is enabled
- Check Storage rules in Firebase Console
- Verify proper permissions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please open an issue in the GitHub repository.

## Acknowledgments

- Firebase for backend services
- Expo for React Native framework
- React Navigation for routing
- All contributors and supporters of child protection initiatives

---

**Note**: This app deals with sensitive child protection matters. Please ensure compliance with local laws and regulations regarding child safety and data protection (GDPR, COPPA, etc.) before deployment.
