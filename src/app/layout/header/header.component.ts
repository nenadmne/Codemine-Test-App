import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  searchControl = new FormControl();

  constructor(private sharedService: SharedService) {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        const params = this.sharedService.getCurrentPaginationParams();
        if (value) {
          this.sharedService.fetchProducts(value);
        } else {
          this.sharedService.fetchAllProducts(params.limit, 0, ''); // Fetch all products with saved limit
        }
      });
  }

  onSearch(event: Event) {
    event.preventDefault();
  }
}
