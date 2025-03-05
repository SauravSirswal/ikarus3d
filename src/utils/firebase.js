
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCaEp6fBFa_RBIx6Xz1sAM2SYoMHkdiNH8",
  authDomain: "d-solar-system-4e423.firebaseapp.com",
  projectId: "d-solar-system-4e423",
  storageBucket: "d-solar-system-4e423.appspot.com",
  messagingSenderId: "610301362623",
  appId: "1:610301362623:web:e92b3f6c0e6c0f2ba8610a",
  measurementId: "G-WGLQ9114GM"
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
