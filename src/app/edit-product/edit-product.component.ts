import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Product } from '../models/products';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent {

  @Input() product!: Product;

  constructor(public activeModal: NgbActiveModal, private productService: ProductService) { }

  //dialog open, save and close
  save() {
    this.productService.editProduct(this.product);
    this.activeModal.close(this.product);
  }
}
