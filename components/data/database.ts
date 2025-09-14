import * as SQLite from 'expo-sqlite';
import { mockBusinessDeals, mockUsers } from './mockData'; // Usado para popular o BD uma vez
import { BusinessDeal, PostStatus } from './types';

// Função para abrir o banco de dados. Se 'membersBook.db' não existir, ele será criado.
async function openDb() {
  return SQLite.openDatabaseAsync('membersBook.db');
}

// Função para configurar o banco de dados (criar tabelas e popular)
export const setupDatabase = async () => {
  const db = await openDb();
  
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT,
      company TEXT,
      location TEXT,
      sector TEXT,
      avatar TEXT,
      bio TEXT,
      revenue TEXT,
      age INTEGER,
      hasChildren INTEGER,
      hobbies TEXT,
      experience TEXT,
      brands TEXT,
      role TEXT
    );
    CREATE TABLE IF NOT EXISTS deals (
      id TEXT PRIMARY KEY NOT NULL,
      partyOne TEXT,
      partyTwo TEXT,
      title TEXT,
      description TEXT,
      category TEXT,
      value TEXT,
      image TEXT,
      congrats INTEGER,
      shares INTEGER,
      status TEXT,
      createdAt INTEGER
    );
  `);
  
  // Verifica se a tabela de usuários está vazia antes de popular
  const usersCount = await db.getFirstAsync<{ 'COUNT(*)': number }>('SELECT COUNT(*) FROM users');
  if (usersCount && usersCount['COUNT(*)'] === 0) {
    console.log("Populando banco de dados com usuários mockados...");
    await db.withTransactionAsync(async () => {
      for (const user of mockUsers) {
        await db.runAsync(
          'INSERT INTO users (id, name, company, location, sector, avatar, bio, revenue, age, hasChildren, hobbies, experience, brands, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          user.id, user.name, user.company, user.location, user.sector, user.avatar, user.bio, user.revenue, user.age, user.hasChildren ? 1 : 0, user.hobbies, user.experience, user.brands, user.role
        );
      }
    });
  }

  // Verifica se a tabela de negócios está vazia
  const dealsCount = await db.getFirstAsync<{ 'COUNT(*)': number }>('SELECT COUNT(*) FROM deals');
  if (dealsCount && dealsCount['COUNT(*)'] === 0) {
    console.log("Populando banco de dados com negócios mockados...");
    await db.withTransactionAsync(async () => {
      for (const deal of mockBusinessDeals) {
        await db.runAsync(
          'INSERT INTO deals (id, partyOne, partyTwo, title, description, category, value, image, congrats, shares, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          deal.id, JSON.stringify(deal.partyOne), JSON.stringify(deal.partyTwo), deal.deal.title, deal.deal.description, deal.deal.category, deal.deal.value, deal.deal.image || null, deal.stats.congrats, deal.stats.shares, deal.status, deal.createdAt
        );
      }
    });
  }
};

// --- Funções para interagir com o banco de dados ---

export const getDeals = async (): Promise<BusinessDeal[]> => {
  const db = await openDb();
  const allRows = await db.getAllAsync('SELECT * FROM deals ORDER BY createdAt DESC');
  return allRows.map((row: any) => ({
    id: row.id,
    partyOne: JSON.parse(row.partyOne),
    partyTwo: JSON.parse(row.partyTwo),
    deal: {
      title: row.title,
      description: row.description,
      category: row.category,
      value: row.value,
      image: row.image,
    },
    stats: { congrats: row.congrats, shares: row.shares },
    status: row.status as PostStatus,
    createdAt: row.createdAt,
  }));
};

export const updateDealStatus = async (postId: string, status: 'approved' | 'rejected') => {
  const db = await openDb();
  if (status === 'approved') {
    await db.runAsync('UPDATE deals SET status = ? WHERE id = ?', status, postId);
  } else if (status === 'rejected') {
    await db.runAsync('DELETE FROM deals WHERE id = ?', postId);
  }
};

export const insertDeal = async (deal: Omit<BusinessDeal, 'id' | 'createdAt'>) => {
  const db = await openDb();
  const id = `deal_${Date.now()}`;
  const createdAt = Date.now();
  await db.runAsync(
    'INSERT INTO deals (id, partyOne, partyTwo, title, description, category, value, image, congrats, shares, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    id, JSON.stringify(deal.partyOne), JSON.stringify(deal.partyTwo), deal.deal.title, deal.deal.description, deal.deal.category, deal.deal.value, deal.deal.image || null, deal.stats.congrats, deal.stats.shares, deal.status, createdAt
  );
};