import { Component, OnInit } from '@angular/core';
import { Router, TitleStrategy } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../models/products';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css']
})
export class AddEditProductComponent implements OnInit {
  documentName: string = '';
  constructor(private productService: ProductService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
  }

  //checking if document already exists and adding new if it doesnt exist
  onSubmit(formData: any){
    this.productService.checkIfDocumentExists(this.documentName).then(documentExists => {
      if(documentExists) {
        this.toastr.warning('Proizvod sa istim imenom postoji ..!');
      }else{
        let productData: Product = {
          name: formData.value.name.toUpperCase(),
          quantity: formData.value.quantity,
          // purchasePrice: formData.value.purchasePrice,
          // sellingPrice: formData.value.sellingPrice,
          addedDate: new Date(),
        }
        this.productService.addProduct(productData)
        formData.form.reset();
        // this.router.navigate(['products']);
      }
    })

  }
}
