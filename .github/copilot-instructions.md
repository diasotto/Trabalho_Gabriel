# Orientações do projeto Nimbus

- Stack: Vue 3 + TypeScript, Ionic Vue, Vue Router, Capacitor e Firebase modular.
- Mantenha chamadas Firebase em `src/services/` e configuração em `src/firebase.ts` via variáveis `VITE_FIREBASE_*`.
- Nunca adicione credenciais de administrador ou segredos ao cliente.
- Proteja autorização com regras Firestore/Storage, não apenas com guardas de rota.
- Após alterações, valide com `npm run build`.
