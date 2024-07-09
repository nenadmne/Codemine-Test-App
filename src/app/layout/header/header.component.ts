import { Component } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product, Products } from '../../../Types';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(private productService: ProductsService) {}

  products: Product[] = [];
  keyword: string = '';

  searchControl = new FormControl();

  fetchProducts(q: string) {
    this.productService
      .searchProducts('https://dummyjson.com/products/search', { q })
      .subscribe((products: Products) => {
        console.log(products.products);
        this.products = products.products;
      });
  }

  // Function for filtering products on every keystroke with debounce delay of 0.5 second
  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (value) {
          this.fetchProducts(value);
        }
      });
  }

  // Preventing default behaviour of form element
  onSearch(event: Event) {
    event.preventDefault();
  }
}
