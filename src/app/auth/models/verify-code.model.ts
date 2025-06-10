export interface VerifyCodeRequest {
  email: string;
  password: string;
}

export interface VerifyCodeResponse {
  data: DataResponse;
  statusCode: number;
}

export interface DataResponse {
  message: string;
  result: string;
  success:boolean
}
