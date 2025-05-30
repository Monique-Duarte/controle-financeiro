import { db } from './firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  CollectionReference,
  DocumentData
} from 'firebase/firestore';


export type TipoDoc = 'receitas' | 'despesas' | 'cartoes';

export interface BaseDoc {
  id?: string;
}

// Cria uma referência para a subcoleção "financas/global/{tipo}"
export const getCollectionRef = (tipo: TipoDoc): CollectionReference<DocumentData> => {
  return collection(db, 'financas', 'global', tipo);
};

// Busca todos os documentos da coleção e adiciona o id de cada um
export const getDocsByTipo = async <T extends BaseDoc>(tipo: TipoDoc): Promise<T[]> => {
  const snapshot = await getDocs(getCollectionRef(tipo));
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return { id: docSnap.id, ...data } as T;
  });
};

// Adiciona um novo documento à coleção e retorna com o id gerado
export const addDocByTipo = async <T extends BaseDoc>(
  tipo: TipoDoc,
  data: Omit<T, 'id'>
): Promise<T> => {
  const docRef = await addDoc(getCollectionRef(tipo), data);
  return { id: docRef.id, ...data } as T;
};

// Atualiza um documento existente, ignorando o campo "id" para não sobrescrever acidentalmente
export const updateDocByTipo = async <T extends BaseDoc>(
  tipo: TipoDoc,
  id: string,
  data: Partial<Omit<T, 'id'>>
): Promise<void> => {
  const ref = doc(db, 'financas', 'global', tipo, id);
  await updateDoc(ref, data);
};

// Remove um documento pelo id
export const deleteDocByTipo = async (tipo: TipoDoc, id: string): Promise<void> => {
  const ref = doc(db, 'financas', 'global', tipo, id);
  await deleteDoc(ref);
};
