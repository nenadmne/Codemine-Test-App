import { Component } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product, Products } from '../../Types';
import { ProductItemComponent } from '../components/product-item/product-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductItemComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private productService: ProductsService) {}

  products: Product[] = [];

  // Fetching function, trough which i send url and query parameters to API
  fetchProducts(limit: number, skip: number) {
    this.productService
      .getProducts('https://dummyjson.com/products', {
        limit,
        skip,
      })
      .subscribe((products: Products) => {
        this.products = products.products;
        console.log(products.products);
      });
  }

  // Fetching function that works on first render of the page
  ngOnInit() {
    this.fetchProducts(5, 0);
  }
}
