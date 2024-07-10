import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../services/products.service';
import { Product } from '../../../../Types';

import { MatIconModule } from '@angular/material/icon'; // For displaying star icons
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Loading spinner
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  constructor(
    private productsService: ProductsService,
    private cdr: ChangeDetectorRef, // Listening for changes inside component when data for product details is fetched
    @Inject(MAT_DIALOG_DATA) public data: { id: number } // Allows injection of data.id from parent component
  ) {}

  product: Product | null = null;

  images: string = '';
  current: number = 0;

  oldPrice: string = '';

  // Fetching single product function
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

  // Function for shifting main image by clicking on left arrow
  prevSlide() {
    this.current =
      this.current === 0 ? this.images.length - 1 : this.current - 1;
  }

  // Function for shifting main image by clicking on right arrow
  nextSlide() {
    this.current =
      this.current === this.images.length - 1 ? 0 : this.current + 1;
  }

  // Function for shifting main image by clicking on small image
  switchImage(index: number) {
    this.current = index;
  }

  // Function for creating old price from discount percentage and price
  calculateOldPrice() {
    if (this.product?.discountPercentage) {
      this.oldPrice = (
        (this.product.price / (100 - this.product.discountPercentage)) *
        100
      ).toFixed(2);
    }
  }

  // Function for rating display trough stars
  getRatingArray() {
    if (this.product) {
      const fullStars = Math.floor(this.product.rating);
      const hasHalfStar = this.product.rating % 1 !== 0;

      // Pushing 1 represents full star
      let ratingArray = Array(fullStars).fill(1);

      // Pushing 0.5 represents a half-empty star
      if (hasHalfStar) {
        ratingArray.push(0.5);
      }
      // Checking for empty stars, pushing 0 value for them
      const remainingStars = 5 - ratingArray.length;
      for (let i = 0; i < remainingStars; i++) {
        ratingArray.push(0);
      }
      return ratingArray;
    }
    return [];
  }
}
