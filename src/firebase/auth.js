// src/firebase/auth.js
import { auth, database } from "./firebase"; // import the database
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { ref, set, get, update } from "firebase/database"; // import database methods

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  // Send email verification
  await doSendEmailVerification();

  // Additional user data initialization
  await set(ref(database, "users/" + user.uid), {
    email: user.email,
    role: "Guest",
    profilePicture: "",
    login_status: "Online",
    verification: "Incomplete",
    subscription_status: "Free",
    rating: 0,
    totalRatings: 0,
  });

  return userCredential;
};

export const doSignInWithEmailAndPassword = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user; // Check if user data exists in the database

  // Check if user's email is verified
  if (!user.emailVerified) {
    throw new Error(
      "Email not verified. Please check your email for verification."
    );
  }

  const userRef = ref(database, "users/" + user.uid);
  await update(userRef, {
    login_status: "Online",
  });

  return userCredential;
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  // Check if user data exists in the database
  const userRef = ref(database, "users/" + user.uid);
  const snapshot = await get(userRef);
  if (!snapshot.exists()) {
    await set(userRef, {
      email: user.email,
      role: "Guest",
      profilePicture: "",
      login_status: "Online",
      verification: "Completed",
      subscription_status: "Free",
      rating: 0,
      totalRatings: 0,
    });
  }
  if (snapshot.exists()) {
    await update(userRef, {
      login_status: "Online",
    });
  }
  return result;
};

export const doSignOut = async () => {
  if (auth.currentUser) {
    const userRef = ref(database, "users/" + auth.currentUser.uid);
    await update(userRef, {
      login_status: "Offline",
    });
  }

  return auth.signOut();
};

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
  const actionCodeSettings = {
    url: "http://localhost:5173/login", // The URL to redirect to after email verification
    handleCodeInApp: true,
  };

  return sendEmailVerification(auth.currentUser, actionCodeSettings);
};
