export interface ResponseModel<T> {
  data: DataResponseCore<T>;
  status: number;
}

export interface DataResponseCore<T> {
  message: string;
  result: ResponseModelCore<T>;
}

export interface ResponseModelCore<T> {
  data: T;
  total: number;
  last_page: number;
  current_page: number | null;
  per_page: number | null;
  prev_page_url: number | null;
  next_page_url: number | null;
}

export interface MetaResponseCore {
  total: number;
  last_page: number;
  current_page: number | null;
  per_page: number | null;
  prev_page_url: number | null;
  next_page_url: number | null;
}

export interface DisplayColumn {
  value: string;
  name: string;
  icon?:string;
  hidden?:boolean;
}

export interface DispleyOnlyColumn{
  value:string;
}

//RESPONSE PARA ACCEDER AL GET BY ID

export interface ResponseModelById<T> {
  data: DataResponseCoreById<T>;
  statusCode: number;
}

export interface DataResponseCoreById<T> {
  message: string;
  result: T;
}

//RESPONSE PARA ACCEDER A RESULT SIMPLE
export interface ResponseSimple {
  data: DataResponseSimple;
  status: number;
}

export interface DataResponseSimple {
  message: string;
  result: string;
}
