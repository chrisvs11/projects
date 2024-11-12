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

import { CollectionNames } from "@/shared/types";

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

export default class FirebaseService {
  private database = getFirestore(app);

  constructor() {}

  getDatabase = this.database;

  private getCollectionReference(
    CollectionName: CollectionNames
  ): CollectionReference {
    const collectionRef = collection(this.database, CollectionName);
    return collectionRef;
  }

  private getDocReference(
    collectionName: CollectionNames,
    entityId: string
  ): DocumentReference {
    const ref: DocumentReference = doc(this.database, collectionName, entityId);

    return ref;
  }

  async getData<T>(
    collectionName: CollectionNames,
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
    collectionName: CollectionNames
  ): Promise<T[]> {
    try {
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

  async getDocByName<T>(
    CollectionName: CollectionNames,
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
    collectionName: CollectionNames,
    setDataState: (value:T[]) => void
  ): { unsubscribe: Unsubscribe; data: T[] } {
    const colRef = this.getCollectionReference(collectionName);
    let realTimeData: T[] = [];
    const unsubscribe = onSnapshot(colRef, (querySnapshot) => {
      realTimeData = [];
      querySnapshot.forEach((doc) => {
        const id = doc.id;
        const finalData:T = {id,...doc.data()} as T
        realTimeData.push(finalData);
      });
      setDataState(realTimeData);
    });

     return { unsubscribe, data: realTimeData };
  }

  getRealTimeDocument<T>(
    CollectionName: CollectionNames,
    entityId: string,
    setDataState: (value: T) => void,
    errorFn: () => void
  ): Unsubscribe {
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
