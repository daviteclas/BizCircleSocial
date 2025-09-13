import { UserProfile, BusinessDeal, ChatUser } from './types';

// Array de todos os usuários para telas de Busca, Perfil e Explorar
export const mockUsers: UserProfile[] = [
  {
    id: "1", name: "Carlos Silva", company: "TechCorp Brasil", location: "São Paulo, SP", sector: "Tecnologia", avatar: 'https://i.pravatar.cc/150?u=1', bio: "CEO especializado em transformação digital com mais de 15 anos de experiência.", revenue: "R$ 5M - R$ 10M", age: 38, hasChildren: true, hobbies: "Ciclismo, Leitura, Vinho", experience: "15 anos", brands: "Microsoft, AWS, Oracle"
  },
  {
    id: "2", name: "Ana Costa", company: "Inovare Consultoria", location: "Rio de Janeiro, RJ", sector: "Consultoria", avatar: 'https://i.pravatar.cc/150?u=2', bio: "Consultora estratégica com foco em growth e escalabilidade.", revenue: "R$ 1M - R$ 5M", age: 34, hasChildren: false, hobbies: "Viagens, Fotografia", experience: "10 anos", brands: "Salesforce, Hubspot"
  },
  {
    id: "3", name: "Roberto Lima", company: "Lima & Associados", location: "Belo Horizonte, MG", sector: "Advocacia", avatar: 'https://i.pravatar.cc/150?u=3', bio: "Advogado empresarial especialista em M&A e governança.", revenue: "R$ 10M - R$ 50M", age: 45, hasChildren: true, hobbies: "Golfe, Xadrez", experience: "20 anos", brands: "Grandes corporações nacionais"
  },
  {
    id: "4", name: "Marina Santos", company: "Health Innovation", location: "Curitiba, PR", sector: "Medicina", avatar: 'https://i.pravatar.cc/150?u=4', bio: "Inovando na área da saúde com tecnologia de ponta.", revenue: "R$ 5M - R$ 10M", age: 39, hasChildren: true, hobbies: "Corrida, Yoga", experience: "12 anos", brands: "Hospitais de ponta"
  },
  {
    id: "current-user", name: "Seu Perfil", company: "Sua Empresa", location: "Sua Cidade", sector: "Seu Setor", avatar: 'https://i.pravatar.cc/150?u=me', bio: "Sua bio aqui...", revenue: "Seu faturamento", age: 30, hasChildren: false, hobbies: "Seus hobbies", experience: "Seus anos", brands: "Suas marcas"
  },
];

// Array para o Feed de Negócios Fechados
export const mockBusinessDeals: BusinessDeal[] = [
  {
    id: '1',
    partyOne: { name: 'Carlos Silva', company: 'TechCorp Brasil', avatar: 'https://i.pravatar.cc/150?u=1' },
    partyTwo: { name: 'Roberto Lima', company: 'Lima & Associados', avatar: 'https://i.pravatar.cc/150?u=3' },
    deal: {
      title: 'Contrato de Consultoria Jurídica Anual',
      description: 'TechCorp Brasil fecha parceria estratégica com Lima & Associados para consultoria em governança corporativa e M&A.',
      category: 'Serviços Jurídicos',
      value: 'R$ 450.000/ano',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932',
    },
    stats: { congrats: 76, shares: 18 },
  },
  {
    id: '2',
    partyOne: { name: 'Ana Costa', company: 'Inovare Consultoria', avatar: 'https://i.pravatar.cc/150?u=2' },
    partyTwo: { name: 'Marina Santos', company: 'Health Innovation', avatar: 'https://i.pravatar.cc/150?u=4' },
    deal: {
      title: 'Rodada de Investimento para Expansão',
      description: 'Health Innovation recebe aporte da Inovare Consultoria para desenvolver sua nova plataforma de telemedicina.',
      category: 'Investimento (Seed)',
      value: 'R$ 700.000',
    },
    stats: { congrats: 132, shares: 54 },
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