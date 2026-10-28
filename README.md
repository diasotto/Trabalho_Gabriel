# Nimbus — estudo prático Ionic, Vue, Capacitor e Firebase

Aplicação demonstrativa de perfil de usuário para estudo de desenvolvimento móvel híbrido. A interface funciona como aplicação web responsiva e pode ser empacotada para Android/iOS pelo Capacitor.

## Pesquisa prática: conceitos e arquitetura

- **Ionic Framework** fornece componentes de interface móveis (botões, campos, navegação e páginas) e estilos adaptáveis. Neste projeto, `@ionic/vue` oferece componentes Vue com aparência e interação familiar a apps móveis.
- **Vue 3** organiza a interface em componentes `.vue`; Composition API (`script setup`) cuida do estado e ações. O Vue Router separa login, boas-vindas e perfil e protege rotas autenticadas.
- **Capacitor** envolve a aplicação Web compilada (`dist`) em um contêiner nativo, conecta plugins/APIs do dispositivo e mantém projetos nativos Android e iOS. O acesso às APIs nativas pode ser adicionado via plugins Capacitor conforme a necessidade.
- **Firebase Authentication** identifica usuários por e-mail/senha, mantém a sessão e envia links de redefinição de senha.
- **Cloud Firestore** é o banco NoSQL de documentos; o perfil é armazenado em `users/{uid}`.
- **Firebase Storage** guarda o arquivo de imagem em `profile-photos/{uid}/avatar`; o perfil guarda somente a URL de download.

Fluxo e organização: a interface chama `src/services/auth.ts` e `src/services/profile.ts`; esses módulos usam o SDK modular do Firebase a partir de `src/firebase.ts`. O Router espera a primeira leitura do estado de autenticação antes de liberar páginas protegidas. O Firebase Web SDK se comunica com os serviços por HTTPS, enquanto as regras do Firebase aplicam autorização no servidor; esconder controles na interface não substitui regras.

## Funcionalidades implementadas

- Login com e-mail e senha, criação de conta para demonstração e recuperação de senha.
- Tela de boas-vindas autenticada com nome/foto disponíveis e navegação.
- Perfil com nome, data de nascimento, nickname e e-mail somente leitura.
- Seleção e pré-visualização de foto; upload limitado a imagens até 5 MB.
- Persistência do perfil no Firestore e foto no Storage.
- Proteção das telas privadas e logout.
- Layout responsivo para navegador e telas pequenas.

## Preparar Firebase

1. Crie um projeto no Firebase Console e registre um aplicativo **Web**. Os valores de configuração Web são identificadores públicos do cliente, não credenciais de administrador; restrinja a chave de API conforme a documentação do Firebase.
2. Habilite o provedor **E-mail/senha** em Authentication.
3. Crie o banco Cloud Firestore e o bucket do Firebase Storage.
4. Copie `.env.example` para `.env` e preencha as seis variáveis `VITE_FIREBASE_*` com a configuração do app Web. Reinicie o servidor Vite após alterar `.env`. Não coloque service-account JSON ou segredos administrativos em variáveis `VITE_`.
5. Publique `firestore.rules` nas regras do Firestore e `storage.rules` nas regras do Storage. Para produção, valide também os campos/tipos permitidos no Firestore, configure limites de abuso e teste as regras no Firebase Emulator Suite.

Sem configuração Firebase, a tela informa como configurar e não habilita ações autenticadas.

## Executar no navegador

Requisitos: Node.js LTS e npm.

- `npm install` — instalar dependências.
- `npm run dev` — iniciar o servidor de desenvolvimento.
- `npm run build` — verificar tipos e gerar `dist`.
- `npm run preview` — pré-visualizar a build.

## Executar no Android/iOS

1. Instale Android Studio e SDK Android para Android. Para iOS, é necessário macOS com Xcode.
2. Adicione a plataforma desejada usando Capacitor (por exemplo, `npx cap add android`; iOS usa `npx cap add ios` em macOS).
3. Execute `npm run cap:sync` após alterações da aplicação para compilar a Web e sincronizar plugins/arquivos nativos.
4. Abra a plataforma com `npm run cap:android` ou `npm run cap:ios` e execute pelo IDE nativo.

O projeto Android já foi adicionado na pasta `android/` e sincronizado pelo Capacitor. A primeira abertura no Android Studio precisa concluir a sincronização Gradle e pode solicitar SDKs. A autenticação usa redirecionamento/e-mail fora do app e não exige plugin nativo neste exemplo. Deep links/fluxos OAuth nativos precisam de configuração adicional.

## Regras de dados de exemplo

- Firestore: cada usuário só pode ler e gravar o documento cujo ID é seu UID autenticado.
- Storage: usuário autenticado só grava em sua própria pasta, apenas imagens com até 5 MB; a leitura está liberada a usuários autenticados para exibir as fotos dos perfis.
- A data de nascimento é um dado pessoal. Em produção, colete apenas se necessário, explique sua finalidade, defina retenção e avalie controles de privacidade. Não armazene informação sensível no perfil público.

## Ferramentas e decisões

- Vite: servidor e build rápida; TypeScript e `vue-tsc`: verificação estática.
- Ionic Vue Router: navegação integrada com páginas Ionic.
- Firebase JavaScript SDK modular: reduz imports desnecessários e organiza Auth, Firestore e Storage em serviços.
- Capacitor CLI: configuração de empacotamento; `capacitor.config.ts` aponta para a pasta `dist`.

Este projeto é educativo, não uma auditoria de segurança. Reveja regras, privacidade, acessibilidade e requisitos de lojas antes de publicar.

## Fontes oficiais para aprofundamento

- Ionic Framework: https://ionicframework.com/docs/vue/overview
- Vue 3: https://vuejs.org/guide/introduction.html
- Capacitor: https://capacitorjs.com/docs
- Firebase Authentication: https://firebase.google.com/docs/auth/web/password-auth
- Cloud Firestore: https://firebase.google.com/docs/firestore
- Firebase Storage: https://firebase.google.com/docs/storage
- Segurança no Firebase: https://firebase.google.com/docs/rules
