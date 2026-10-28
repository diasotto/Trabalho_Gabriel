<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { IonButton, IonContent, IonPage } from '@ionic/vue'
import { auth } from '../firebase'
import { logout } from '../services/auth'
import { fetchProfile } from '../services/profile'

const router = useRouter()
const displayName = ref(auth?.currentUser?.displayName || auth?.currentUser?.email?.split('@')[0] || 'Olá')
const photoURL = ref(auth?.currentUser?.photoURL || '')
onMounted(async () => {
  const user = auth?.currentUser
  if (!user) return
  try {
    const profile = await fetchProfile(user.uid)
    displayName.value = profile.name || user.displayName || user.email?.split('@')[0] || 'Olá'
    photoURL.value = profile.photoURL || user.photoURL || ''
  } catch { /* O perfil pode não ter sido criado ainda. */ }
})
async function exit() {
  await logout()
  await router.replace('/login')
}
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true" class="app-content">
      <header class="topbar"><a class="wordmark" href="/welcome"><span class="brand-mark small">N</span> nimbus</a><nav><button class="nav-link active" @click="router.push('/welcome')">Início</button><button class="nav-link" @click="router.push('/profile')">Meu perfil</button></nav><button class="logout-button" @click="exit">Sair <span>↗</span></button></header>
      <main class="welcome-main">
        <p class="eyebrow">SEU ESPAÇO DIGITAL</p>
        <div class="welcome-title"><h1>Que bom ter você<br />por aqui, <span>{{ displayName }}</span>.</h1><div class="avatar avatar-large"><img v-if="photoURL" :src="photoURL" alt="Foto de perfil" /><span v-else>{{ displayName.charAt(0).toUpperCase() }}</span></div></div>
        <p class="welcome-copy">Este é o seu ponto de partida. Complete seu perfil para deixar tudo com a sua cara.</p>
        <ion-button class="primary-button profile-cta" @click="router.push('/profile')">Personalizar meu perfil <span class="arrow">→</span></ion-button>
        <div class="feature-grid">
          <article class="feature-card"><div class="feature-icon violet">✳</div><p class="eyebrow">SUA IDENTIDADE</p><h2>Um perfil só seu</h2><p>Adicione seus dados e uma foto para personalizar sua experiência.</p><button @click="router.push('/profile')">Editar perfil <span>→</span></button></article>
          <article class="feature-card"><div class="feature-icon peach">⌁</div><p class="eyebrow">SEUS DADOS</p><h2>Tudo em um lugar</h2><p>Suas informações ficam salvas com segurança na nuvem.</p><div class="cloud-tag"><span></span> Sincronizado com Firebase</div></article>
          <article class="feature-card"><div class="feature-icon mint">◉</div><p class="eyebrow">NO SEU BOLSO</p><h2>Feito para você</h2><p>Uma experiência que acompanha você na web e no celular.</p><div class="cloud-tag"><span></span> Ionic + Capacitor</div></article>
        </div>
        <footer class="page-footer"><span>nimbus · projeto demonstrativo</span><span>Desenvolvido com cuidado <b>✳</b></span></footer>
      </main>
    </ion-content>
  </ion-page>
</template>
