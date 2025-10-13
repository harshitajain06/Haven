# Database Collection Name Update ✅

## Change Summary
Updated the Firestore collection name from `posts` to `postshaven` across the entire codebase.

## Files Updated

### 1. ✅ `app/(tabs)/UploadScreen.jsx` (Line 53)
**Before:**
```javascript
await addDoc(collection(db, 'posts'), {
```

**After:**
```javascript
await addDoc(collection(db, 'postshaven'), {
```

### 2. ✅ `app/(tabs)/HomeScreen.jsx` (Line 14)
**Before:**
```javascript
const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
```

**After:**
```javascript
const q = query(collection(db, 'postshaven'), orderBy('createdAt', 'desc'));
```

### 3. ✅ `app/screens/create-post.jsx` (Line 57)
**Before:**
```javascript
await addDoc(collection(db, 'posts'), {
```

**After:**
```javascript
await addDoc(collection(db, 'postshaven'), {
```

## Impact

### What This Changes:
- ✅ All new posts will be saved to the `postshaven` collection
- ✅ The home feed will read from the `postshaven` collection
- ✅ The upload screen will save to the `postshaven` collection
- ✅ The create-post screen will save to the `postshaven` collection

### Important Notes:
⚠️ **Existing Data**: If you have existing posts in the old `posts` collection in Firebase, they will NOT be automatically visible. You have two options:

1. **Start Fresh** (Recommended for development):
   - The app will now use `postshaven` collection
   - Create new posts and they'll appear immediately

2. **Migrate Existing Data** (If you have important data):
   - Manually copy/rename the collection in Firebase Console
   - Or use a Firebase migration script to copy data from `posts` to `postshaven`

### Firebase Console Check:
After creating a new post, verify in your Firebase Console:
- Navigate to: Firestore Database
- Look for: `postshaven` collection
- Confirm: New documents appear there

## Testing Steps

1. **Reload the app**: Press `r` in the terminal
2. **Create a new post**:
   - Go to Upload tab
   - Add content and optional media
   - Submit
3. **Verify on Home screen**:
   - Go to Home tab
   - New post should appear in the feed
4. **Check Firebase Console**:
   - Open Firebase Console
   - Go to Firestore Database
   - Confirm `postshaven` collection exists with your new post

---

**Status**: ✅ All references updated to `postshaven`
**Date**: Updated just now
**Collections Checked**: 3 files updated, no other references found

