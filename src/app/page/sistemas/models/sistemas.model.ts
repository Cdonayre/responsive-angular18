export interface SistemasStatus {
  status:  string;
  code:    number;
  message: string;
  data:    Sistemas[];
}

export interface Sistemas {
  id?:         number;
  nombre:      string;
  descripcion: string;
}

export interface Sistema {
  nombre:      string;
  descripcion: string;
}
