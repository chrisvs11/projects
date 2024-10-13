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

import { getAnalytics } from "firebase/analytics";

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

  async getData(
    collectionName: CollectionNames,
    entityId: string
  ): Promise<any> {
    try {
      const ref = this.getDocReference(collectionName, entityId);

      const docSnapshot = await getDoc(ref);

      if(!docSnapshot.exists())  throw new Error("Data not found");

      const doc = docSnapshot.data()

      return {id:docSnapshot.id,...doc}
      
    } catch (e) {
      console.error("Error getting the data", e);
    }
  }

  async getAllDocsInCollection(
    collectionName: CollectionNames
  ): Promise<any[]> {
    try {
      const collectionRef = this.getCollectionReference(collectionName);

      const querySnapshot = await getDocs(collectionRef);

      const docsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return docsData;
    } catch {
      console.error("Error getting the data");

      return [];
    }
  }

  async getDocByName(
    CollectionName: CollectionNames,
    name: string
  ): Promise<any[]> {
    try {
      const collectionRef: CollectionReference =
        this.getCollectionReference(CollectionName);

      const queryResults: Query = query(
        collectionRef,
        where("name", "==", { name })
      );

      const querySnapshot: QuerySnapshot = await getDocs(queryResults);

      console.log(querySnapshot);

      return querySnapshot.docs;
    } catch (e) {
      console.error(e);

      return [];
    }
  }

  getRealTimeDocuments(
    collectionName: CollectionNames,
    setDataState: (value: React.SetStateAction<any>) => void
  ): { unsubscribe: Unsubscribe; data: any[] } {
    const colRef = this.getCollectionReference(collectionName);
    let realTimeData: any[] = [];

    const unsubscribe = onSnapshot(colRef, (querySnapshot) => {
      realTimeData = [];
      querySnapshot.forEach((doc) => {
        const id = doc.id;
        realTimeData.push({ id, ...doc.data() });
      });
      setDataState(realTimeData);
    });

    console.log(realTimeData);

    return { unsubscribe, data: realTimeData };
  }

  getRealTimeDocument(
    CollectionName: CollectionNames,
    entityId: string,
    setDataState: (value: React.SetStateAction<any>) => void
  ): { unsubscribe: Unsubscribe; data: any } {
    const docRef = this.getDocReference(CollectionName, entityId);
    let docData = undefined;

    const unsubscribe = onSnapshot(docRef, (docSnapshot: DocumentSnapshot) => {
      const id = docSnapshot.id;
      if(docSnapshot.exists()) {
        docData = { id, ...docSnapshot.data() };
        setDataState(docData);
      } else {
        console.error("Data not found")
      }
 
    });

    return { unsubscribe, data: docData };
  }
}
