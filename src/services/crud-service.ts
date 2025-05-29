import { db } from './firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  CollectionReference
} from 'firebase/firestore';

export type TipoDoc = 'receitas' | 'despesas';

export interface BaseDoc {
  id?: string;
}

export const getCollectionRef = (tipo: TipoDoc): CollectionReference => {
  return collection(db, 'financas', 'global', tipo);
};

export const getDocsByTipo = async <T extends BaseDoc>(tipo: TipoDoc): Promise<T[]> => {
  const snapshot = await getDocs(getCollectionRef(tipo));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
};

export const addDocByTipo = async <T extends BaseDoc>(
  tipo: TipoDoc,
  data: Omit<T, 'id'>
): Promise<T> => {
  const docRef = await addDoc(getCollectionRef(tipo), data);
  return { id: docRef.id, ...data } as T;
};

export const updateDocByTipo = async <T extends BaseDoc>(
  tipo: TipoDoc,
  id: string,
  data: Partial<Omit<T, 'id'>>
): Promise<void> => {
  const ref = doc(db, 'financas', 'global', tipo, id);
  await updateDoc(ref, data);
};

export const deleteDocByTipo = async (tipo: TipoDoc, id: string): Promise<void> => {
  const ref = doc(db, 'financas', 'global', tipo, id);
  await deleteDoc(ref);
};
