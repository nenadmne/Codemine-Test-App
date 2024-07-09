import { Component } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product, Products } from '../../Types';
import { ProductItemComponent } from '../components/product-item/product-item.component';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductItemComponent, CommonModule, MatPaginatorModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private productService: ProductsService) {}

  products: Product[] = [];
  length: number = 0;
  items: number = 5;

  // Fetching function, trough which i send url and query parameters to API
  fetchProducts(limit: number, skip: number) {
    console.log(limit, skip);
    this.productService
      .getProducts('https://dummyjson.com/products', {
        limit,
        skip,
      })
      .subscribe((products: Products) => {
        this.products = products.products;
        this.length = products.total;
      });
  }

  // Fetching function that works on first render of the page
  ngOnInit() {
    this.fetchProducts(this.items, 0);
  }

  // Function for handling pagination depending on the size of displayed items
  onPageChange(event: any) {
    const skipValue = event.pageIndex * event.pageSize;
    this.fetchProducts(event.pageSize, skipValue);
  }
}
