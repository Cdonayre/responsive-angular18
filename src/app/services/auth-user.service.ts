import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthUserService {

  constructor() { }
}

export interface AuthUser {
  token: string;
  username: string; // Or actual user name
  role: string; // e.g., 'admin', 'regular_user', 'establecimiento_owner'
  // Add any other relevant user data you get from login response
  id?: number; // Optional ID if available
}