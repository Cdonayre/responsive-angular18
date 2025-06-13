export interface Rol {
    nombre:      string;
    descripcion: string;
}
export interface RolObtener {
    status:  string;
    code:    number;
    message: string;
    data:    RolData[];
}

export interface RolData {
    id:          number;
    nombre:      string;
    descripcion: string;
}

export interface RolPermisos {
    status:  string;
    code:    number;
    message: string;
    data:    PermisosData[];
}

export interface PermisosData {
    rol_id:     number;
    permiso_id: number;
    nombre:     string;
}
