import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from '../firebase'

export interface UserProfile {
  name: string
  birthDate: string
  nickname: string
  photoURL: string
}

function requireServices() {
  if (!db || !storage) throw new Error('Configure as variáveis do Firebase no arquivo .env para continuar.')
  return { db, storage }
}

export async function fetchProfile(uid: string): Promise<Partial<UserProfile>> {
  const { db: firestore } = requireServices()
  const snapshot = await getDoc(doc(firestore, 'users', uid))
  return snapshot.exists() ? (snapshot.data() as Partial<UserProfile>) : {}
}

export async function saveProfile(uid: string, profile: UserProfile) {
  const { db: firestore } = requireServices()
  await setDoc(doc(firestore, 'users', uid), { ...profile, updatedAt: serverTimestamp() }, { merge: true })
}

export async function uploadProfilePhoto(uid: string, file: File) {
  const { storage: bucket } = requireServices()
  if (!file.type.startsWith('image/')) throw new Error('Selecione um arquivo de imagem.')
  if (file.size > 5 * 1024 * 1024) throw new Error('A imagem deve ter no máximo 5 MB.')
  const photoRef = ref(bucket, `profile-photos/${uid}/avatar`)
  await uploadBytes(photoRef, file, { contentType: file.type })
  return getDownloadURL(photoRef)
}
