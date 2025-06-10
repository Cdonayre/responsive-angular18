export interface ChangePasswordRequest{
    currentPassword: string;
    newPassword: string;
}

export interface ResponseChangePassword{
  message:string,
  success:boolean,
  user:{
            id: number;
            dni:string;
            usuario: string;
            nombres: string;
            apep: string;
            apem: string;
            ris: string;
            eess: string;
            nivel: string;
            profesional: string;
            celular: string;
            email: string;
            fec_reg: string;
            log: string;
            email_verified_at: string;
            created_at: string;
            updated_at: string;
  }
}
