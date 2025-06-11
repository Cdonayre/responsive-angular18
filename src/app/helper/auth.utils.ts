import { HttpHeaders } from '@angular/common/http';

export const getUserHeaders = (token: string | null) => {
  return new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  });
};