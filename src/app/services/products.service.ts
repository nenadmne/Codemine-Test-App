import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { PaginationParams, SearchParams } from '../../Types';
import { Observable } from 'rxjs';
import { Products, Product} from '../../Types';

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

  searchProducts = (
    url: string,
    params: SearchParams
  ): Observable<Products> => {
    return this.apiService.get(url, {
      params,
      responseType: 'json',
    });
  };

  getSingleProduct = (url: string): Observable<Product> => {
    return this.apiService.get(url, {
      responseType: 'json',
    });
  };
}
