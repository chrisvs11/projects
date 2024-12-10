import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  Query,
  query,
  QuerySnapshot,
  Unsubscribe,
  where,
} from "firebase/firestore";

import { FirebaseApp, initializeApp } from "firebase/app";

// import { getAnalytics } from "firebase/analytics";

import { CollectionName } from "@/shared/types";

const firebaseConfig = {
  apiKey: "AIzaSyAR0gvUaCaGeNeUPEmYdt3FPg0CuNO7Z1E",
  authDomain: "pacmen-e7657.firebaseapp.com",
  projectId: "pacmen-e7657",
  storageBucket: "pacmen-e7657.appspot.com",
  messagingSenderId: "666449297581",
  appId: "1:666449297581:web:10497b4fc743ff18ca0624",
  measurementId: "G-0Y5S6WR7DD",
};

const app: FirebaseApp = initializeApp(firebaseConfig);

// const analytics = getAnalytics(app);

class FirebaseService {
  private database = getFirestore(app);

  constructor() {}

  getDatabase = this.database;

  private getCollectionReference(
    CollectionName: CollectionName
  ): CollectionReference {
    const collectionRef = collection(this.database, CollectionName);
    return collectionRef;
  }

  private getDocReference(
    collectionName: CollectionName,
    entityId: string
  ): DocumentReference {
    const ref: DocumentReference = doc(this.database, collectionName, entityId);

    return ref;
  }

  async getData<T>(
    collectionName: CollectionName,
    entityId: string
  ): Promise<T | undefined> {
    try {
      const ref = this.getDocReference(collectionName, entityId);

      const docSnapshot = await getDoc(ref);

      if (!docSnapshot.exists()) throw new Error("Data not found");

      const resultData = { id: docSnapshot.id, ...docSnapshot.data() } as T;

      return resultData;
    } catch (e) {
      console.error("Error getting the data", e);
    }
  }

  async getAllDocsInCollection<T>(
    collectionName: CollectionName
  ): Promise<T[]> {
    try {
      console.log(`Getting the documents for ${collectionName}`)
      const collectionRef = this.getCollectionReference(collectionName);

      const querySnapshot = await getDocs(collectionRef);

      const docsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as T),
      }));
      return docsData;
    } catch {
      console.error("Error getting the data");
      return [];
    }
  }

  async getDocByQuery<T>(
    collectionName: CollectionName,
    propToQuery: string,
    queryValue: string | number
  ): Promise<T|null> {
    try {
      const collectionRef: CollectionReference =
        this.getCollectionReference(collectionName);

      const q = query(collectionRef, where(propToQuery, "==", queryValue));

      const querySnapshot = await getDocs(q);
      const doc = querySnapshot.docs[0]

      if(!doc) return null

      const result = doc.data() as T;
      return {id:doc.id, ...result};

    } catch (e) {
      console.error("Error", e);
      return null
    }
  }

  async getDocByName<T>(
    CollectionName: CollectionName,
    name: string
  ): Promise<T | undefined> {
    try {
      const collectionRef: CollectionReference =
        this.getCollectionReference(CollectionName);

      const queryResults: Query = query(
        collectionRef,
        where("name", "==", { name })
      );

      const querySnapshot: QuerySnapshot = await getDocs(queryResults);

      return querySnapshot.docs[0] as T;
    } catch (e) {
      console.error(e);

      return undefined;
    }
  }

  getRealTimeDocuments<T>(
    collectionName: CollectionName,
    setDataState: (value: T[]) => void
  ): { unsubscribe: Unsubscribe; data: T[] } {
    const colRef = this.getCollectionReference(collectionName);
    let realTimeData: T[] = [];
    const unsubscribe = onSnapshot(colRef, (querySnapshot) => {
      realTimeData = [];
      querySnapshot.forEach((doc) => {
        const id = doc.id;
        const finalData: T = { id, ...doc.data() } as T;
        realTimeData.push(finalData);
      });
      setDataState(realTimeData);
    });

    return { unsubscribe, data: realTimeData };
  }

  getRealTimeDocument<T>(
    CollectionName: CollectionName,
    entityId: string,
    setDataState: (value: T) => void,
    errorFn: () => void
  ): Unsubscribe {
    console.log(`websocket created for ${CollectionName}`)
    const docRef = this.getDocReference(CollectionName, entityId);
    let docData = undefined;
    const unsubscribe = onSnapshot(docRef, (docSnapshot: DocumentSnapshot) => {
      const id = docSnapshot.id;
      if (!docSnapshot.data()) {
        errorFn();
      }
      docData = { id, ...docSnapshot.data() } as T;
      setDataState(docData);
    });
    return unsubscribe;
  }
}

export const firebaseService = new FirebaseService()
