export const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/jwt-auth';
export const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/jwt-auth';
export const PORT = process.env.PORT || 8080;
export const JWT_SECRET = process.env.JWT_SECRET || 'hello';
export const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
