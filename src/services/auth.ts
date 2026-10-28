import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { auth } from '../firebase'

export { onAuthStateChanged }
export type { User }

function requireAuth() {
  if (!auth) throw new Error('Configure as variáveis do Firebase no arquivo .env para continuar.')
  return auth
}

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(requireAuth(), email, password)
}

export async function signUp(email: string, password: string, displayName: string) {
  const credential = await createUserWithEmailAndPassword(requireAuth(), email, password)
  await updateProfile(credential.user, { displayName })
  return credential
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(requireAuth(), email)
}

export async function logout() {
  return signOut(requireAuth())
}
