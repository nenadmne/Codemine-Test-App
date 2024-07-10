import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ChangeDetectorRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../../../../Types';
import { ProductsService } from '../../../services/products.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  constructor(
    private productsService: ProductsService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}

  product: Product | null = null;

  images: string = '';
  current: number = 0;

  oldPrice: string = '';

  fetchSingleProduct(id: number) {
    this.productsService
      .getSingleProduct(`https://dummyjson.com/products/${id}`)
      .subscribe((product: Product) => {
        this.product = product;
        this.images = product.images;
        this.calculateOldPrice();
        this.cdr.markForCheck();
      });
  }

  ngOnInit() {
    this.fetchSingleProduct(this.data.id);
  }

  prevSlide() {
    this.current =
      this.current === 0 ? this.images.length - 1 : this.current - 1;
  }

  nextSlide() {
    this.current =
      this.current === this.images.length - 1 ? 0 : this.current + 1;
  }

  switchImage(index: number) {
    this.current = index;
  }

  calculateOldPrice() {
    if (this.product?.discountPercentage) {
      this.oldPrice = (
        (this.product.price / (100 - this.product.discountPercentage)) *
        100
      ).toFixed(2);
    }
  }

  getRatingArray() {
    if (this.product) {
      const fullStars = Math.floor(this.product.rating); // Get the integer part for full stars
      const hasHalfStar = this.product.rating % 1 !== 0; // Check if there's a half star

      // Create an array with the number of full stars
      let ratingArray = Array(fullStars).fill(1);

      // Add half star if present
      if (hasHalfStar) {
        ratingArray.push(0.5);
      }

      const remainingStars = 5 - ratingArray.length;
      for (let i = 0; i < remainingStars; i++) {
        ratingArray.push(0); // Pushing 0 represents an empty star
      }

      return ratingArray;
    }
    return [];
  }
}
