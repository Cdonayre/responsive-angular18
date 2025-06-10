export interface AuthUser{
    token: string;
    userType: 'admin_dashboard_user'|'regular_api_user';
    username?:string;
    id?: number;
    exp?: number;
    iat?: number;
}

export interface AuthUserTokenPayload {
  sub?: string; // Common for username/subject
  username?: string;
  email?: string;
  id?: number;
  userId?: number;
  exp?: number; // Expiration timestamp
  iat?: number; // Issued at timestamp
  // Add any other properties you expect from your JWT payload
}