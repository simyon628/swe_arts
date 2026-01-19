import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

export interface UserAddress {
    id: string;
    fullName: string;
    mobile: string;
    house: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
}

export const userService = {
    async getUserData(uid: string) {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    },

    async saveAddress(uid: string, address: UserAddress) {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                addresses: [address],
                createdAt: new Date().toISOString()
            });
        } else {
            await updateDoc(userRef, {
                addresses: arrayUnion(address)
            });
        }
    },

    async updateAddresses(uid: string, addresses: UserAddress[]) {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, { addresses });
    },

    async savePaymentPreference(uid: string, method: string) {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, { savedPaymentMethod: method });
    }
};
