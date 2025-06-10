export interface LoginRequest {
  usuario?: string;
  email?: string;
  password?: string;
  clave?: string;
}

export interface LogiResponse {
  message: string;
  token: string;
}

export interface LoginResponse {
  data: DataResponse;
  statusCode: number;
}

export interface DataResponse {
  message: string;
  result: string;
  success:boolean
}
