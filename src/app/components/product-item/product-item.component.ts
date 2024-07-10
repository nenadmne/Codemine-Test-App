import { Component, Input, inject } from '@angular/core';
import { CartProduct, Product } from '../../../Types';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductDetailsComponent } from '../modals/product-details/product-details.component';
import { MatButtonModule } from '@angular/material/button';
import { ProductCartStoreService } from '../../services/product-cart-store.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    ProductDetailsComponent,
    CommonModule,
  ],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css',
})
export class ProductItemComponent {
  @Input() product!: Product;
  inStore: number = 0;

  constructor(private productCartStoreService: ProductCartStoreService) {}

  readonly dialog = inject(MatDialog);

  ngOnInit() {
    const productsInStore =
      this.productCartStoreService.activeCartProducts.value;
    const existingCartElement = productsInStore.filter(
      (el) => el.id === this.product.id
    );
    this.inStore =
      existingCartElement.length != 0 ? existingCartElement[0].amountInCart : 0;

    this.productCartStoreService.getCartProducts().subscribe((res) => {
      const currentCartProduct = res.find((el) => el.id === this.product.id);

      if (currentCartProduct) {
        this.inStore = currentCartProduct.amountInCart;
      } else {
        this.inStore = 0;
      }
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(ProductDetailsComponent, {
      data: { id: this.product.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  addItemToCart = (product: Product) => {
    const newCartProduct: CartProduct = {
      id: product.id,
      image: product.thumbnail,
      title: product.title,
      price: product.price,
      amountInCart: 1,
      amountInStock: product.stock,
    };

    const cartProducts = this.productCartStoreService.activeCartProducts.value;

    const existingCartProductIndex = cartProducts.findIndex(
      (el) => el.id === newCartProduct.id
    );

    if (existingCartProductIndex >= 0) {
      cartProducts[existingCartProductIndex] = {
        ...cartProducts[existingCartProductIndex],
        amountInCart: cartProducts[existingCartProductIndex].amountInCart + 1,
      };
      this.productCartStoreService.updateCartProducts([...cartProducts]);
    } else {
      this.productCartStoreService.updateCartProducts([
        ...cartProducts,
        newCartProduct,
      ]);
    }
  };

  removeItemFromCart = (productId: number) => {
    const cartProducts = this.productCartStoreService.activeCartProducts.value;
    this.productCartStoreService.updateCartProducts([
      ...cartProducts.filter((el) => el.id !== productId),
    ]);

    this.inStore = 0;
  };
}
