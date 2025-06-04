import { inject, Injectable, signal } from '@angular/core';
import { StorageEncryptService } from './storage-encrypt.service';

@Injectable({
  providedIn: 'root'
})
export class PersistedSignalService {

private readonly localStorageServiceEncrypt = inject(StorageEncryptService);

  create<T>(key: string, initialValue: T) {
    const storedValue = this.localStorageServiceEncrypt.get(key);
    const persistedSignal = signal<T>(
      storedValue ? JSON.parse(storedValue) : initialValue
    );

    return {
      set: (value: T) => {
        this.localStorageServiceEncrypt.set(key, JSON.stringify(value));
        persistedSignal.set(value);
      },
      get: () => persistedSignal,
      clear: () => {
        this.localStorageServiceEncrypt.removeData(key);
        localStorage.removeItem(key);
        persistedSignal.set(initialValue);
      }
    };
  }
}
