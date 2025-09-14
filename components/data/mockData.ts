import { BusinessDeal, ChatUser, UserProfile } from './types';

// O ID do usuário que está "logado" no app. Mude para '3' para testar como admin.
export const CURRENT_USER_ID = '1'; 

// Array de todos os usuários para telas de Busca, Perfil e Explorar
export const mockUsers: UserProfile[] = [
  {
    id: "1", name: "Carlos Silva", email: "email@gmail.com", password: "123", company: "TechCorp Brasil", location: "São Paulo, SP", sector: "Tecnologia", avatar: 'https://i.pravatar.cc/150?u=1', bio: "CEO especializado em transformação digital com mais de 15 anos de experiência.", revenue: "R$ 5M - R$ 10M", age: 38, hasChildren: true, hobbies: "Ciclismo, Leitura, Vinho", experience: "15 anos", brands: "Microsoft, AWS, Oracle", role: 'admin', classe: 'infinity', experiencePoints: 1250, status: 'approved'
  },
  {
    id: "2", name: "Ana Costa", email: "ana@inovare.com", password: "123", company: "Inovare Consultoria", location: "Rio de Janeiro, RJ", sector: "Consultoria", avatar: 'https://i.pravatar.cc/150?u=2', bio: "Consultora estratégica com foco em growth e escalabilidade.", revenue: "R$ 1M - R$ 5M", age: 34, hasChildren: false, hobbies: "Viagens, Fotografia", experience: "10 anos", brands: "Salesforce, Hubspot", role: 'member', classe: 'membro', experiencePoints: 980, status: 'approved'
  },
  {
    id: "3", name: "Roberto Lima", email: "roberto@lima.com", password: "admin123", company: "Lima & Associados", location: "Belo Horizonte, MG", sector: "Advocacia", avatar: 'https://i.pravatar.cc/150?u=3', bio: "Advogado empresarial especialista em M&A e governança.", revenue: "R$ 10M - R$ 50M", age: 45, hasChildren: true, hobbies: "Golfe, Xadrez", experience: "20 anos", brands: "Grandes corporações nacionais", role: 'member', classe: 'sócio', experiencePoints: 1500, status: 'approved'
  },
  {
    id: "4", name: "Marina Santos", email: "marina@techcorp.com", password: "123", company: "Health Innovation", location: "Curitiba, PR", sector: "Medicina", avatar: 'https://i.pravatar.cc/150?u=4', bio: "Inovando na área da saúde com tecnologia de ponta.", revenue: "R$ 5M - R$ 10M", age: 39, hasChildren: true, hobbies: "Corrida, Yoga", experience: "12 anos", brands: "Hospitais de ponta", role: 'member', classe: 'membro', experiencePoints: 740, status: 'approved'
  },
  {
    id: "current-user", name: "Seu Perfil", email: "seuperfil@techcorp.com", password: "123", company: "Sua Empresa", location: "Sua Cidade", sector: "Seu Setor", avatar: 'https://i.pravatar.cc/150?u=me', bio: "Sua bio aqui...", revenue: "Seu faturamento", age: 30, hasChildren: false, hobbies: "Seus hobbies", experience: "Seus anos", brands: "Suas marcas", role: 'member', classe: 'infinity', experiencePoints: 740, status: 'approved'
  },
];

// Array para o Feed de Negócios Fechados
export const mockBusinessDeals: BusinessDeal[] = [
  {
    id: '1',
    partyOne: { id: '1', name: 'Carlos Silva', company: 'TechCorp Brasil', avatar: 'https://i.pravatar.cc/150?u=1' },
    partyTwo: { id: '3', name: 'Roberto Lima', company: 'Lima & Associados', avatar: 'https://i.pravatar.cc/150?u=3' },
    deal: {
      title: 'Contrato de Consultoria Jurídica Anual',
      description: 'TechCorp Brasil fecha parceria estratégica com Lima & Associados para consultoria em governança corporativa e M&A.',
      category: 'Serviços Jurídicos',
      value: 'R$ 450.000/ano',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932',
    },
    stats: { congrats: 76, shares: 18 },
    status: 'approved',
    createdAt: new Date('2025-09-12T10:00:00').getTime(),
  },
  {
    id: '2',
    partyOne: { id: '2', name: 'Ana Costa', company: 'Inovare Consultoria', avatar: 'https://i.pravatar.cc/150?u=2' },
    partyTwo: { id: '4', name: 'Marina Santos', company: 'Health Innovation', avatar: 'https://i.pravatar.cc/150?u=4' },
    deal: {
      title: 'Rodada de Investimento para Expansão',
      description: 'Health Innovation recebe aporte da Inovare Consultoria para desenvolver sua nova plataforma de telemedicina.',
      category: 'Investimento (Seed)',
      value: 'R$ 700.000',
    },
    stats: { congrats: 132, shares: 54 },
    status: 'approved',
    createdAt: new Date('2025-09-11T15:30:00').getTime(),
  },
  {
    id: '3',
    partyOne: { id: '2', name: 'Ana Costa', company: 'Inovare Consultoria', avatar: 'https://i.pravatar.cc/150?u=2' },
    partyTwo: { id: '1', name: 'Carlos Silva', company: 'TechCorp Brasil', avatar: 'https://i.pravatar.cc/150?u=1' },
    deal: {
      title: 'Parceria para Desenvolvimento de App',
      description: 'Inovare e TechCorp unem forças para criar uma nova plataforma de gestão de projetos.',
      category: 'Desenvolvimento de Software',
      value: 'N/A',
    },
    stats: { congrats: 0, shares: 0 },
    status: 'pending',
    createdAt: new Date('2025-09-13T11:00:00').getTime(),
  },
];
// Array para a tela de Chat
export const mockChats: ChatUser[] = [
  { id: "1", name: "Ana Costa", company: "Inovare Consultoria", lastMessage: "Ótima ideia! Vamos marcar...", timestamp: "14:30", unread: 2, online: true, avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: "2", name: "Roberto Lima", company: "Lima & Associados", lastMessage: "Obrigado pela conexão!", timestamp: "11:15", online: false, avatar: 'https://i.pravatar.cc/150?u=3' },
];

// Array de setores para os filtros da busca
export const sectors = [
  "Tecnologia", "Consultoria", "Advocacia", "Medicina", "Engenharia",
  "Marketing", "Finanças", "Educação", "Food", "Imobiliário"
];