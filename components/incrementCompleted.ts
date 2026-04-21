import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

export const incrementCompletedCount = async () => {
  const metadataRef = doc(db, 'metadata', 'global');
  try {
    const docSnap = await getDoc(metadataRef);
    if (!docSnap.exists()) {
      await setDoc(metadataRef, { visitCount: 23, completedCount: 101 });
    } else {
      await updateDoc(metadataRef, {
        completedCount: increment(1)
      });
    }
  } catch (error: any) {
    if (error?.message?.includes('offline') || error?.message?.includes('Backend didn\'t respond')) {
      return;
    }
    console.error('Error incrementing completed:', error);
  }
};
