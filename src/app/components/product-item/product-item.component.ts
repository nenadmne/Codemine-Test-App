import { Component, Input, inject } from '@angular/core';
import { Product } from '../../../Types';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductDetailsComponent } from '../modals/product-details/product-details.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, ProductDetailsComponent],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css',
})
export class ProductItemComponent {
  @Input() product!: Product;

  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(ProductDetailsComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
