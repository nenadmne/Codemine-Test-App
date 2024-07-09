import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { PaginationParams } from '../../Types';
import { Observable } from 'rxjs';
import { Products } from '../../Types';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private apiService: ApiService) {}
  getProducts = (
    url: string,
    params: PaginationParams
  ): Observable<Products> => {
    return this.apiService.get(url, {
      params,
      responseType: 'json',
    });
  };
}