<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { IonButton, IonContent, IonInput, IonPage, IonSpinner, IonText } from '@ionic/vue'
import { firebaseConfigured } from '../firebase'
import { resetPassword, signIn, signUp } from '../services/auth'

const router = useRouter()
const email = ref('')
const password = ref('')
const name = ref('')
const registering = ref(false)
const busy = ref(false)
const error = ref('')
const notice = ref('')

async function submit() {
  error.value = ''
  notice.value = ''
  busy.value = true
  try {
    if (registering.value) await signUp(email.value.trim(), password.value, name.value.trim())
    else await signIn(email.value.trim(), password.value)
    await router.replace('/welcome')
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Não foi possível autenticar.'
  } finally {
    busy.value = false
  }
}

async function recoverPassword() {
  error.value = ''
  notice.value = ''
  if (!email.value.trim()) {
    error.value = 'Informe seu e-mail para receber o link de recuperação.'
    return
  }
  try {
    await resetPassword(email.value.trim())
    notice.value = 'Se o endereço estiver cadastrado, você receberá um e-mail de recuperação.'
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Não foi possível enviar o e-mail.'
  }
}
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true" class="auth-content">
      <main class="auth-layout">
        <section class="intro-panel">
          <div class="brand-mark">N</div>
          <p class="eyebrow">APLICAÇÃO DEMONSTRATIVA</p>
          <h1>Seu espaço,<br />do seu jeito.</h1>
          <p class="intro-copy">Um exemplo prático de app móvel com Ionic, Vue, Capacitor e Firebase.</p>
          <div class="tech-pills"><span>Ionic Vue</span><span>Capacitor</span><span>Firebase</span></div>
        </section>
        <section class="form-panel">
          <div class="form-heading">
            <p class="eyebrow">BEM-VINDO(A)</p>
            <h2>{{ registering ? 'Crie sua conta' : 'Acesse sua conta' }}</h2>
            <p>{{ registering ? 'Preencha seus dados para começar.' : 'Entre para continuar para seu perfil.' }}</p>
          </div>
          <form @submit.prevent="submit">
            <label v-if="registering" class="field-label" for="name">Nome</label>
            <ion-input v-if="registering" id="name" v-model="name" class="form-input" fill="outline" placeholder="Como podemos chamar você?" autocomplete="name" required />
            <label class="field-label" for="email">E-mail</label>
            <ion-input id="email" v-model="email" class="form-input" type="email" fill="outline" placeholder="voce@exemplo.com" autocomplete="email" required />
            <label class="field-label" for="password">Senha</label>
            <ion-input id="password" v-model="password" class="form-input" type="password" fill="outline" placeholder="Mínimo de 6 caracteres" autocomplete="current-password" :minlength="6" required />
            <button v-if="!registering" class="text-link forgot-link" type="button" @click="recoverPassword">Esqueci minha senha</button>
            <ion-text v-if="error" color="danger"><p class="feedback" role="alert">{{ error }}</p></ion-text>
            <ion-text v-if="notice" color="success"><p class="feedback" role="status">{{ notice }}</p></ion-text>
            <ion-button expand="block" class="primary-button" type="submit" :disabled="busy || !firebaseConfigured">
              <ion-spinner v-if="busy" name="crescent" />
              <span v-else>{{ registering ? 'Criar conta' : 'Entrar' }}</span>
            </ion-button>
          </form>
          <p v-if="!firebaseConfigured" class="setup-note">Configure as credenciais do projeto no arquivo <strong>.env</strong> para habilitar o Firebase.</p>
          <p class="switch-mode">{{ registering ? 'Já tem uma conta?' : 'Ainda não tem uma conta?' }}
            <button class="text-link" type="button" @click="registering = !registering; error = ''; notice = ''">{{ registering ? 'Entrar' : 'Criar conta' }}</button>
          </p>
          <p class="security-note"><span class="lock-icon">◈</span> Autenticação segura pelo Firebase</p>
        </section>
      </main>
    </ion-content>
  </ion-page>
</template>
