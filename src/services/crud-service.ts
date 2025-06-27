import { db } from './firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  CollectionReference,
  DocumentData,
  query,
  onSnapshot
} from 'firebase/firestore';


export type TipoDoc = 'receitas' | 'despesas' | 'cartoes';

export interface BaseDoc {
  id?: string;
}

export const getCollectionRef = (userId: string, tipo: TipoDoc): CollectionReference<DocumentData> => {
  return collection(db, 'financas', 'usuarios', userId, tipo);
};

export const getDocsByTipo = async <T extends BaseDoc>(userId: string, tipo: TipoDoc): Promise<T[]> => {
  const snapshot = await getDocs(getCollectionRef(userId, tipo));
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return { id: docSnap.id, ...data } as T;
  });
};

export const getDocsByTipoRealtime = <T extends BaseDoc>(
  userId: string,
  tipo: TipoDoc,
  callback: (data: T[]) => void
): (() => void) => {
  const collectionRef = getCollectionRef(userId, tipo);
  const q = query(collectionRef);

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const dataList: T[] = [];
    snapshot.forEach((docSnap) => {
      dataList.push({ id: docSnap.id, ...docSnap.data() as T });
    });
    callback(dataList);
  }, (error) => {
    console.error("Erro ao buscar dados em tempo real:", error);
  });

  return unsubscribe;
};

export const addDocByTipo = async <T extends BaseDoc>(
  userId: string,
  tipo: TipoDoc,
  data: Omit<T, 'id'>
): Promise<T> => {
  const docRef = await addDoc(getCollectionRef(userId, tipo), data);
  return { id: docRef.id, ...data } as T;
};

export const updateDocByTipo = async <T extends BaseDoc>(
  userId: string,
  tipo: TipoDoc,
  id: string,
  data: Partial<Omit<T, 'id'>>
): Promise<void> => {
  const ref = doc(db, 'financas', 'usuarios', userId, tipo, id);
  await updateDoc(ref, data);
};

export const deleteDocByTipo = async (userId: string, tipo: TipoDoc, id: string): Promise<void> => {
  const ref = doc(db, 'financas', 'usuarios', userId, tipo, id);
  await deleteDoc(ref);
};