import { Component } from '@angular/core';
import { ProductCartStoreService } from '../../../services/product-cart-store.service';
import { Observable, of } from 'rxjs';
import { CartProduct } from '../../../../Types';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CheckoutComponent } from '../checkout/checkout.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  cartProducts$: Observable<CartProduct[]> = of([]);

  totalQuantity: number = 0;
  totalAmount: number = 0;

  constructor(
    private productCartStoreService: ProductCartStoreService,
    private dialog: MatDialog
  ) {}

  calculateTotalQuantity(cartProducts: CartProduct[]): number {
    return cartProducts.reduce((acc, product) => acc + product.amountInCart, 0);
  }

  calculateTotalAmount(cartProducts: CartProduct[]): number {
    return cartProducts.reduce(
      (acc, product) => acc + product.amountInCart * product.price,
      0
    );
  }

  ngOnInit() {
    this.cartProducts$ = this.productCartStoreService.getCartProducts();
    this.cartProducts$.subscribe((products) => {
      this.totalQuantity = this.calculateTotalQuantity(products);
      this.totalAmount = this.calculateTotalAmount(products);
    });
  }

  increaseItem(cartProductId: number) {
    const cartProducts = this.productCartStoreService.activeCartProducts.value;

    const existingCartProductIndex = cartProducts.findIndex(
      (el) => el.id === cartProductId
    );

    cartProducts[existingCartProductIndex] = {
      ...cartProducts[existingCartProductIndex],
      amountInCart: cartProducts[existingCartProductIndex].amountInCart + 1,
    };
    this.productCartStoreService.updateCartProducts([...cartProducts]);
  }

  decreaseItem(cartProductId: number) {
    const cartProducts = this.productCartStoreService.activeCartProducts.value;

    const existingCartProductIndex = cartProducts.findIndex(
      (el) => el.id === cartProductId
    );

    if (cartProducts[existingCartProductIndex].amountInCart > 1) {
      cartProducts[existingCartProductIndex] = {
        ...cartProducts[existingCartProductIndex],
        amountInCart: cartProducts[existingCartProductIndex].amountInCart - 1,
      };
      this.productCartStoreService.updateCartProducts([...cartProducts]);
    } else {
      this.productCartStoreService.updateCartProducts([
        ...cartProducts.filter((el) => el.id !== cartProductId),
      ]);
    }
  }

  openCheckoutForm() {
    const dialogRef = this.dialog.open(CheckoutComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
