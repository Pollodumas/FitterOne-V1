export const DB_CONFIG = {
  NAME: 'cutifit-db',
  VERSION: 5,
  STORES: {
    USERS: 'users',
    CLIENTS: 'clients',
    TRAINERS: 'trainers',
    PLANS: 'plans'
  }
};

export const USER_TYPES = {
  CLIENT: 'client',
  TRAINER: 'trainer'
} as const;

export const DEMO_CREDENTIALS = {
  TRAINER: {
    EMAIL: 'trainer@demo.com',
    PASSWORD: 'demo123'
  },
  CLIENT: {
    EMAIL: 'client@demo.com',
    PASSWORD: 'demo123'
  }
} as const;