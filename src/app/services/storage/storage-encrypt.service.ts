import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StorageEncryptService {
	private readonly key = environment.keyEncrypt;
	protected storage = sessionStorage;


	public get(key: string): string | null  {
    const encryptedData = this.storage.getItem(key);
    if (!encryptedData) return null;
    return this.decrypt(encryptedData);
	}

	public set(key: string, value: string | null): void {
		if (value === null) {
      this.storage.removeItem(key);
      return;
    }
    const encryptedData = this.encrypt(value)
    this.storage.setItem(key, encryptedData);
	}

	public removeData(key: string) {
		this.storage.removeItem(key);
	}

	public clearData() {
		this.storage.clear();
	}

	private encrypt(txt: string): string {
		return CryptoJS.AES.encrypt(txt, this.key).toString();
	}

	private decrypt(txtToDecrypt: string) {
		return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
	}
}
