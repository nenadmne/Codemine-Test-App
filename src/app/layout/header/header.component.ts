import { Component, inject } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SharedService } from '../../services/shared.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CartComponent } from '../../components/modals/cart/cart.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, CartComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  searchControl = new FormControl();

  // Search product function on every keystroke with debounce delay. Returning all products on empty input with selected pagination length
  constructor(private sharedService: SharedService) {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        const params = this.sharedService.getCurrentPaginationParams();
        if (value) {
          this.sharedService.fetchProducts(value);
        } else {
          this.sharedService.fetchAllProducts(params.limit, 0, '');
        }
      });
  }

  onSearch(event: Event) {
    event.preventDefault();
  }

  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(CartComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
