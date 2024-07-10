import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartProduct } from '../../Types';

@Injectable({
  providedIn: 'root',
})
export class ProductCartStoreService {
  activeCartProducts: BehaviorSubject<CartProduct[]>;

  constructor() {
    const storedProducts = localStorage.getItem('cartProducts');
    if (storedProducts != null) {
      this.activeCartProducts = new BehaviorSubject<CartProduct[]>(
        JSON.parse(storedProducts)
      );
    } else {
      this.activeCartProducts = new BehaviorSubject<CartProduct[]>([]);
    }
  }

  getCartProducts(): Observable<CartProduct[]> {
    return this.activeCartProducts.asObservable();
  }

  updateCartProducts(newData: CartProduct[]) {
    this.activeCartProducts.next(newData);
    localStorage.setItem('cartProducts', JSON.stringify(newData));
  }
}
