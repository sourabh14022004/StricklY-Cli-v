import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Platform } from 'react-native';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  signInWithCredential,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, type Auth } from '../config/FirebaseConfig';
import { GoogleAuthProvider } from 'firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { upsertUser } from '../services/userService';

// Configure Google Sign-In
// Using client IDs from existing GoogleService-Info.plist
GoogleSignin.configure({
  webClientId: '277355716853-p6raq7um8eatb38nuqdmmu42tqkq15gr.apps.googleusercontent.com', // From Firebase Console (Web Client ID)
  iosClientId: '277355716853-ldo2mtq04a4l4bm5vf05kss36b0ggpu1.apps.googleusercontent.com', // From GoogleService-Info.plist (CLIENT_ID)
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  scopes: [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events',
  ],
});

interface User {
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  uid: string;
}

interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username?: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to convert Firebase User to our User interface
const convertFirebaseUser = (firebaseUser: FirebaseUser | null): User | null => {
  if (!firebaseUser) return null;
  return {
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    uid: firebaseUser.uid,
  };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? `User: ${firebaseUser.email}` : 'User signed out');
      const converted = convertFirebaseUser(firebaseUser);
      setUser(converted);

      // Best-effort upsert of profile data
      if (converted) {
        upsertUser(converted).catch((err) => {
          console.warn('Failed to upsert user profile on auth change:', err);
        });
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, username?: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update display name if username is provided
      if (username && firebaseUser) {
        try {
          await updateProfile(firebaseUser, {
            displayName: username,
          });
        } catch (profileError: any) {
          // If profile update fails, log but don't fail the signup
          console.warn('Failed to update profile:', profileError);
        }
      }
      
      const convertedUser = convertFirebaseUser(firebaseUser);
      setUser(convertedUser);
      // Persist profile to Firestore
      if (convertedUser) {
        await upsertUser(convertedUser);
      }
      setLoading(false);
      // Navigation to MainAppScreen happens automatically in App.tsx when user is set
      return { success: true, user: convertedUser || undefined };
    } catch (error: any) {
      setLoading(false);
      
      // Handle Firebase Auth errors with user-friendly messages
      let errorMessage = 'Sign up failed';
      
      if (error.code) {
        switch (error.code) {
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your internet connection and try again.';
            break;
          case 'auth/email-already-in-use':
            errorMessage = 'This email is already registered. Please sign in instead.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password is too weak. Please use a stronger password.';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Email/password accounts are not enabled. Please contact support.';
            break;
          default:
            errorMessage = error.message || 'Sign up failed. Please try again.';
        }
      } else {
        errorMessage = error.message || 'Sign up failed. Please try again.';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const convertedUser = convertFirebaseUser(firebaseUser);
      setUser(convertedUser);
      // Persist profile to Firestore
      if (convertedUser) {
        await upsertUser(convertedUser);
      }
      setLoading(false);
      // Navigation to MainAppScreen happens automatically in App.tsx when user is set
      return { success: true, user: convertedUser || undefined };
    } catch (error: any) {
      setLoading(false);
      
      // Handle Firebase Auth errors with user-friendly messages
      let errorMessage = 'Sign in failed';
      
      if (error.code) {
        switch (error.code) {
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your internet connection and try again.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email. Please sign up first.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled. Please contact support.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later.';
            break;
          case 'auth/invalid-credential':
            errorMessage = 'Invalid email or password. Please try again.';
            break;
          default:
            errorMessage = error.message || 'Sign in failed. Please try again.';
        }
      } else {
        errorMessage = error.message || 'Sign in failed. Please try again.';
      }
      
      console.error('Sign in error:', error.code, error.message);
      console.error('Sign up error:', error.code, error.message);
      return { success: false, error: errorMessage };
    }
  };

  const signInWithGoogle = async (): Promise<AuthResult> => {
    try {
      setLoading(true);
      
      // Check if your device supports Google Play (Android only)
      if (Platform.OS === 'android') {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      }
      
      // Sign in with Google
      await GoogleSignin.signIn();
      
      // Get the ID token
      const tokens = await GoogleSignin.getTokens();
      
      if (!tokens.idToken) {
        setLoading(false);
        return { success: false, error: 'No ID token received from Google' };
      }
      
      // Create a Google credential with the ID token
      const googleCredential = GoogleAuthProvider.credential(tokens.idToken);
      
      // Sign in to Firebase with the Google credential
      const userCredential = await signInWithCredential(auth, googleCredential);
      const firebaseUser = userCredential.user;
      
      const convertedUser = convertFirebaseUser(firebaseUser);
      setUser(convertedUser);
      // Persist profile to Firestore
      if (convertedUser) {
        await upsertUser(convertedUser);
      }
      setLoading(false);
      
      return { success: true, user: convertedUser || undefined };
    } catch (error: any) {
      setLoading(false);
      
      if (error.code === 'SIGN_IN_CANCELLED') {
        return { success: false, error: 'Google Sign-In was cancelled' };
      }
      
      const errorMessage = error.message || 'Google Sign-In failed';
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async (): Promise<AuthResult> => {
    try {
      setLoading(true);
      
      // Sign out from Google Sign-In if signed in (handle errors gracefully)
      try {
        const currentUser = await GoogleSignin.getCurrentUser();
        if (currentUser) {
          await GoogleSignin.signOut();
          console.log('Google Sign-In signed out successfully');
        }
      } catch (googleError: any) {
        // Continue with Firebase sign out even if Google sign out fails
        console.warn('Google sign out error (continuing with Firebase sign out):', googleError);
      }
      
      // Sign out from Firebase - onAuthStateChanged will handle state update
      await firebaseSignOut(auth);
      console.log('Firebase sign out successful');
      
      // Don't manually set user to null - let onAuthStateChanged handle it
      // This ensures consistency with Firebase auth state
      setLoading(false);
      return { success: true };
    } catch (error: any) {
      setLoading(false);
      console.error('Sign out error:', error.code, error.message);
      
      // Handle Firebase Auth errors with user-friendly messages
      let errorMessage = 'Sign out failed';
      
      if (error.code) {
        switch (error.code) {
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your internet connection and try again.';
            break;
          default:
            errorMessage = error.message || 'Sign out failed. Please try again.';
        }
      } else {
        errorMessage = error.message || 'Sign out failed. Please try again.';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const resetPassword = async (email: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setLoading(false);
      return { success: true };
    } catch (error: any) {
      setLoading(false);
      const errorMessage = error.message || 'Password reset failed';
      return { success: false, error: errorMessage };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
