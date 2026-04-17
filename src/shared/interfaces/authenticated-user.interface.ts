export interface AuthenticatedUser {
  id: number;
  nome: string;
  perfil: string;
  iat?: number;
  exp?: number;
}

