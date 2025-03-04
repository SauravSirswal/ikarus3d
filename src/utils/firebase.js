
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';

// Your web app's Firebase configuration - Replace with your own config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // ⚠️ Replace with your Firebase API key
  authDomain: "YOUR_AUTH_DOMAIN", // ⚠️ Replace with your Firebase auth domain
  projectId: "YOUR_PROJECT_ID", // ⚠️ Replace with your Firebase project ID
  storageBucket: "YOUR_STORAGE_BUCKET", // ⚠️ Replace with your Firebase storage bucket
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // ⚠️ Replace with your Firebase messaging sender ID
  appId: "YOUR_APP_ID" // ⚠️ Replace with your Firebase app ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Save a configuration to Firestore
export const saveConfiguration = async (name, planetData) => {
  try {
    const docRef = await addDoc(collection(db, "configurations"), {
      name,
      planetData,
      createdAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving configuration:", error);
    return { success: false, error };
  }
};

// Get all saved configurations
export const getAllConfigurations = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "configurations"));
    const configurations = [];
    querySnapshot.forEach((doc) => {
      configurations.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return { success: true, configurations };
  } catch (error) {
    console.error("Error getting configurations:", error);
    return { success: false, error };
  }
};

// Get a specific configuration by ID
export const getConfigurationById = async (id) => {
  try {
    const docRef = doc(db, "configurations", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, configuration: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: "Configuration not found" };
    }
  } catch (error) {
    console.error("Error getting configuration:", error);
    return { success: false, error };
  }
};
