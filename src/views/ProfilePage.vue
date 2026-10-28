<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { IonButton, IonContent, IonInput, IonPage, IonSpinner, IonText } from '@ionic/vue'
import { auth } from '../firebase'
import { fetchProfile, saveProfile, uploadProfilePhoto } from '../services/profile'

const router = useRouter()
const user = auth?.currentUser
const name = ref('')
const birthDate = ref('')
const nickname = ref('')
const photoURL = ref(user?.photoURL || '')
const selectedFile = ref<File | null>(null)
const busy = ref(false)
const error = ref('')
const success = ref('')

onMounted(async () => {
  if (!user) return
  try {
    const profile = await fetchProfile(user.uid)
    name.value = profile.name || user.displayName || ''
    birthDate.value = profile.birthDate || ''
    nickname.value = profile.nickname || ''
    photoURL.value = profile.photoURL || user.photoURL || ''
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Não foi possível carregar o perfil.'
  }
})

function choosePhoto(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    selectedFile.value = file
    photoURL.value = URL.createObjectURL(file)
  }
}

async function save() {
  if (!user) return
  busy.value = true
  error.value = ''
  success.value = ''
  try {
    if (selectedFile.value) photoURL.value = await uploadProfilePhoto(user.uid, selectedFile.value)
    await saveProfile(user.uid, { name: name.value.trim(), birthDate: birthDate.value, nickname: nickname.value.trim(), photoURL: photoURL.value })
    success.value = 'Perfil salvo com sucesso.'
    selectedFile.value = null
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Não foi possível salvar o perfil.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true" class="app-content">
      <header class="topbar"><a class="wordmark" href="/welcome"><span class="brand-mark small">N</span> nimbus</a><nav><button class="nav-link" @click="router.push('/welcome')">Início</button><button class="nav-link active" @click="router.push('/profile')">Meu perfil</button></nav><span class="account-chip">{{ user?.email }}</span></header>
      <main class="profile-main">
        <button class="back-link" @click="router.push('/welcome')">← <span>Voltar ao início</span></button>
        <p class="eyebrow">SUA CONTA</p><h1>Seu perfil</h1><p class="profile-intro">Essas informações ajudam a deixar sua experiência mais pessoal.</p>
        <section class="profile-card">
          <div class="photo-row"><div class="avatar profile-avatar"><img v-if="photoURL" :src="photoURL" alt="Prévia da foto de perfil" /><span v-else>{{ name.charAt(0).toUpperCase() || 'N' }}</span></div><div class="photo-description"><strong>Sua foto</strong><p>JPG, PNG ou WEBP · até 5 MB</p><label class="upload-button" for="photo">Escolher foto</label><input id="photo" class="visually-hidden" type="file" accept="image/*" @change="choosePhoto" /></div></div>
          <div class="form-divider"></div>
          <form @submit.prevent="save">
            <div class="field-grid"><div class="field-wrap"><label class="field-label" for="profile-name">Nome completo</label><ion-input id="profile-name" v-model="name" class="form-input" fill="outline" placeholder="Seu nome" autocomplete="name" required /></div><div class="field-wrap"><label class="field-label" for="nickname">Como quer ser chamado(a)?</label><ion-input id="nickname" v-model="nickname" class="form-input" fill="outline" placeholder="Seu nickname" autocomplete="nickname" required /></div><div class="field-wrap"><label class="field-label" for="birth-date">Data de nascimento</label><ion-input id="birth-date" v-model="birthDate" class="form-input" fill="outline" type="date" required /></div><div class="field-wrap"><label class="field-label">E-mail da conta</label><ion-input class="form-input readonly-input" fill="outline" :value="user?.email || ''" readonly /></div></div>
            <ion-text v-if="error" color="danger"><p class="feedback" role="alert">{{ error }}</p></ion-text><ion-text v-if="success" color="success"><p class="feedback" role="status">{{ success }}</p></ion-text>
            <div class="form-actions"><ion-button fill="clear" class="cancel-button" @click="router.push('/welcome')">Cancelar</ion-button><ion-button type="submit" class="primary-button save-button" :disabled="busy"><ion-spinner v-if="busy" name="crescent" /><span v-else>Salvar alterações <span class="arrow">→</span></span></ion-button></div>
          </form>
        </section>
        <p class="privacy-note"><span>◈</span> Seus dados são privados e armazenados com segurança.</p>
      </main>
    </ion-content>
  </ion-page>
</template>
