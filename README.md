BizCircleSocial - Comunidade de Negócios
🚀 Sobre o Projeto
BizCircleSocial é um aplicativo móvel de nicho, desenvolvido em React Native, que funciona como uma rede social exclusiva para empresários. O objetivo é criar um ambiente para networking, onde os membros possam postar negócios fechados, interagir com a comunidade e ser reconhecidos através de um sistema de gamificação.

O aplicativo foi construído com uma arquitetura robusta que inclui um banco de dados local, gerenciamento de estado global e um sistema de permissões baseado em papéis de usuário.

✨ Funcionalidades Principais
Sistema de Autenticação Completo:

Fluxo de Login e Cadastro.

Sessão de usuário persistente (o usuário continua logado após fechar o app).

Controle de Acesso por Papel (Roles):

Convidado: Visualização limitada do feed e do perfil. Não pode interagir.

Membro: Acesso completo às funcionalidades sociais após aprovação.

Admin: Acesso total, incluindo painéis de moderação.

Fluxo de Aprovação de Cadastros e Posts:

Novos cadastros e posts de negócios entram em uma fila de análise.

Um painel de administrador exclusivo para aprovar ou rejeitar conteúdo, garantindo a qualidade da comunidade.

Feed de Negócios Dinâmico:

Exibição de negócios fechados entre membros.

Filtros por categoria e busca por texto.

Sistema de Gamificação e Ranking:

Usuários ganham pontos de experiência (XP) ao fechar negócios.

Uma tela de Ranking exibe os membros mais ativos em um pódio estilizado.

Banco de Dados Local:

Utiliza SQLite (expo-sqlite) para armazenar todos os dados diretamente no dispositivo.

Inclui um sistema de "migração" que atualiza a estrutura do banco de dados sem perder dados.

🛠️ Tecnologias Utilizadas
Framework: React Native com Expo

Linguagem: TypeScript

Banco de Dados: SQLite (expo-sqlite)

Gerenciamento de Estado Global: React Context API

Navegação: Lógica de navegação customizada (baseada em estado)

Componentes Nativos: react-native (View, Text, FlatList, etc.)

Ícones: lucide-react-native

Seleção de Imagem: expo-image-picker

Armazenamento Local: @react-native-async-storage/async-storage

⚙️ Instalação e Execução
Para rodar este projeto localmente, você precisará de um ambiente de desenvolvimento React Native configurado, incluindo o Android Studio (para o emulador Android) ou Xcode (para o simulador iOS).

Clone o repositório:

git clone [https://github.com/seu-usuario/BizCircleSocial.git](https://github.com/seu-usuario/BizCircleSocial.git)
cd BizCircleSocial

Instale as dependências:

npm install

Crie e instale o Build de Desenvolvimento:
Como o projeto usa bibliotecas nativas (expo-sqlite), o aplicativo padrão Expo Go não funcionará. Você precisa criar uma versão personalizada do app.

# Crie o build para Android (ou --platform ios)
npx eas build --profile development --platform android

Após o processo terminar, baixe e instale o arquivo .apk no seu emulador ou dispositivo Android.

Inicie o servidor de desenvolvimento:
Use o comando --dev-client para conectar-se ao seu aplicativo personalizado.

npx expo start --dev-client

Abra o aplicativo:
No seu emulador ou celular, abra o aplicativo BizCircleSocial. Ele deve se conectar automaticamente ao servidor Metro que está rodando no seu terminal.

👨‍💻 Como Testar as Funcionalidades de Admin
Para testar as funcionalidades de administrador, como o painel de aprovação:

Abra o arquivo src/data/mockData.ts.

Altere a constante CURRENT_USER_ID para o ID de um usuário com role: 'admin'. Por exemplo:

export const CURRENT_USER_ID = '3'; // ID do Roberto Lima (Admin)

Salve o arquivo. O aplicativo irá recarregar com as permissões de administrador.
