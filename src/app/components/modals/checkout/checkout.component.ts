import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CartProduct } from '../../../../Types';
import { Observable, of } from 'rxjs';
import { ProductCartStoreService } from '../../../services/product-cart-store.service';
import { ProductsService } from '../../../services/products.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  cartProducts$: Observable<CartProduct[]> = of([]);
  form: FormGroup;
  totalAmount: number = 0;

  readonly API_ORDER = 'https://dummyjson.com/http/200';

  constructor(
    private fb: FormBuilder,
    private productCartStoreService: ProductCartStoreService,
    private dialogRef: MatDialogRef<CheckoutComponent>,
    private snackBar: MatSnackBar,
    private productsService: ProductsService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]*$/)]],
    });
  }

  ngOnInit(): void {
    this.cartProducts$ = this.productCartStoreService.getCartProducts();
    this.cartProducts$.subscribe((products) => {
      this.totalAmount = this.calculateTotalAmount(products);
    });
  }

  get name() {
    return this.form.get('name');
  }

  get address() {
    return this.form.get('address');
  }

  get email() {
    return this.form.get('email');
  }

  get phone() {
    return this.form.get('phone');
  }

  onSubmit() {
    if (this.form.valid) {
      this.productsService
        .postOrder(this.API_ORDER, this.form.value)
        .subscribe({
          next: () => {
            this.snackBar.open('Order placed successfully!', 'Close', {
              duration: 100000, // Duration in milliseconds
              panelClass:"custom-snackbar-success",
            });
          },
          error: (err) => {
            console.error('Order placement failed', err);
            this.snackBar.open(
              'Failed to place order. Please try again.',
              'Close',
              {
                duration: 3000, // Duration in milliseconds
                panelClass: ['custom-snackbar-error'],
              }
            );
          },
        });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  calculateTotalAmount(cartProducts: CartProduct[]): number {
    return cartProducts.reduce(
      (acc, product) => acc + product.amountInCart * product.price,
      0
    );
  }
}
