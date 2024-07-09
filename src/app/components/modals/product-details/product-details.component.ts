import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ChangeDetectorRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { Product } from '../../../../Types';
import { ProductsService } from '../../../services/products.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, CommonModule],
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

  fetchSingleProduct(id: number) {
    this.productsService
      .getSingleProduct(`https://dummyjson.com/products/${id}`)
      .subscribe((product: Product) => {
        this.product = product;
        this.cdr.markForCheck();
      });
  }

  ngOnInit() {
    this.fetchSingleProduct(this.data.id);
  }
}
