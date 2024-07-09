import { Component } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product, Products } from '../../../Types';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(private productService: ProductsService) {}

  products: Product[] = [];

  fetchProducts(q: string) {
    this.productService
      .searchProducts('https://dummyjson.com/products/search', { q })
      .subscribe((products: Products) => {
        console.log(products);
      });
  }

  ngOnInit() {
    this.fetchProducts('phone');
  }
}
