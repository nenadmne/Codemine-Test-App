import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { Product } from '../../Types';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ProductItemComponent } from '../components/product-item/product-item.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductItemComponent, CommonModule, MatPaginatorModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  length: number = 0;
  items: number = 5;

  constructor(private sharedService: SharedService) {}

  fetchProducts() {
    const { limit, skip } = this.sharedService.getCurrentPaginationParams();
    this.sharedService.updatePaginationParams(limit, skip);
    this.sharedService.fetchAllProducts(limit, skip);
  }

  ngOnInit() {
    this.sharedService.products$.subscribe((products: Product[]) => {
      this.products = products;
    });
    this.sharedService.totalItems$.subscribe((total: number) => {
      this.length = total;
    });

    // Fetch initial products based on current pagination and search parameters
    this.fetchProducts();
  }

  onPageChange(event: any) {
    const limit = event.pageSize;
    const skip = event.pageIndex * event.pageSize;
    this.sharedService.updatePaginationParams(limit, skip);
    this.fetchProducts();
  }
}
