import { ConfigService } from './../../config/config.service';

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  initializeApp,
  cert,
  ServiceAccount,
  AppOptions,
} from 'firebase-admin/app';

import {
  CollectionReference,
  DocumentReference,
  getFirestore,
} from 'firebase-admin/firestore';

import { Collection } from 'src/shared/types';

@Injectable()
export class FirebaseService {
  private conflictError: ConflictException;
  private database: FirebaseFirestore.Firestore;

  constructor(private readonly configService: ConfigService) {
    const firebaseConfig: AppOptions = {
      credential: cert(this.configService.firebase as ServiceAccount),
    };

    initializeApp(firebaseConfig);
    this.database = getFirestore();
    this.conflictError = new ConflictException(
      'There was an error accessing database',
    );
  }

  async createEntity(
    collectionName: Collection,
    data: any,
    entityId?: string,
  ): Promise<any> {
    try {
      const collectionRef = this.getCollectionReference(collectionName);

      const docRef = entityId
        ? await collectionRef.doc(entityId)
        : await collectionRef.doc();

      await docRef.set(data);

      const docData = await this.getDocData(docRef);

      return { uuid: docRef.id, ...docData };
    } catch (e) {
      console.error(e);
      throw this.conflictError;
    }
  }

  getDocReference(
    collectionName: Collection,
    entityId?: string,
  ): DocumentReference {
    if (entityId) {
      return this.database.collection(collectionName).doc(entityId);
    } else {
      return this.database.collection(collectionName).doc();
    }
  }

  getCollectionReference(collection: Collection): CollectionReference {
    return this.database.collection(collection);
  }

  async getDocData(docRef: DocumentReference): Promise<any> {
    try {
      const docSnapshot = await docRef.get();
      return docSnapshot.data();
    } catch (e) {
      throw this.conflictError;
    }
  }

  async updateEntity(
    collectionName: Collection,
    entityId: string,
    data: any,
  ): Promise<any> {
    try {

      const docRef = this.getDocReference(collectionName, entityId);
      const doesDocExist = (await docRef.get()).exists;
      if (!doesDocExist) throw new NotFoundException(`Data not found`);

      await docRef.update(data);
      const updateDoc = await docRef.get();

      return { uuid: docRef.id, ...updateDoc.data() };
      
    } catch (e) {

      console.error(e);
      throw this.conflictError;
    }
  }

  async getOneById(collectionName: Collection, entityId: string): Promise<any> {
    try {
      const doc = await this.database
        .collection(collectionName)
        .doc(entityId)
        .get();

      if (!doc.exists)
        throw new NotFoundException(`entity not found with id ${entityId}`);

      const entityData = doc.data();

      return { uuid: entityId, ...entityData };
    } catch (e) {
      console.error(e);
      throw this.conflictError;
    }
  }

  async getOneByQuery(
    collectionName: Collection,
    queryParam: string,
    targetParam: string,
  ): Promise<any> {
    try {
      const collectionRef = this.database.collection(collectionName);

      const querySnapshot = await collectionRef
        .where(queryParam, '==', targetParam)
        .get();
      if (querySnapshot.empty) throw new NotFoundException('entity not found');

      const docId = querySnapshot.docs[0].id;
      const docData = querySnapshot.docs[0].data();

      return { uuid: docId, ...docData };
    } catch (e) {
      console.error(e);
      throw this.conflictError;
    }
  }

  async getAll(collectionName: Collection): Promise<any> {
    try {
      const collectionRef = this.database.collection(collectionName);
      const snapshot = await collectionRef.get();

      const documents = snapshot.docs.map((doc) => ({
        uuid: doc.id,
        ...doc.data(),
      }));
      return documents;
    } catch (e) {
      console.error(e);
      throw this.conflictError;
    }
  }

  async deleteEntity(
    collectionName: Collection,
    entityId: string,
  ): Promise<any> {
    try {
      const activeDocData = await this.getOneById(collectionName, entityId);

      if (activeDocData.deletedAt) throw new Error('User is already deleted');

      const data = { ...activeDocData, deletedAt: new Date() };
      return this.updateEntity(collectionName, entityId, data);
    } catch (e) {
      console.error(e);
      throw this.conflictError;
    }
  }

}
