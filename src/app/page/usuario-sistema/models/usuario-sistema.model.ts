import { NgOptimizedImage } from "@angular/common";

export interface UserSistemaGet {
  usuario_id: number;
  nombre_usuario: string;
  sistema_id: number;
  nombre_sistema: string;
  rol_id: number;
  nombre_rol: string;
}

export interface UserSistemaId {
  sistema_id: number;
  nombre_sistema: string;
  rol_id: number;
  nombre_rol: string;
}

export interface UserSistemaData {
  usuario_id: number;
  nombre_usuario: string;
  asignaciones: UserSistemaId[];
}

export interface UserSistemaPost
{
  usuario_id: number;
  sistema_id: number;
  rol_id: number;
}
