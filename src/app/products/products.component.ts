import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../models/products';
import { ProductService } from '../services/product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditProductComponent } from '../edit-product/edit-product.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  updatedProducts: Product[] = [];
  newQuantities: { [key: string]: number } = {};
  filterValue: string = '';
  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private productService: ProductService,
    private afs: AngularFirestore,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) {}


  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts().subscribe((products) => {
      this.products = products.sort((a, b) => {
        if (a.addedDate > b.addedDate) {
          return -1;
        } else if (a.addedDate < b.addedDate) {
          return 1;
        } else {
          return 0;
        }
      });
    });
  }
  calculateTotalQuantity(product: Product) {
    if (product.newQuantity !== undefined) {
      product.totalQuantity = product.quantity + +product.newQuantity;
    } else {
      product.totalQuantity = product.quantity;
    }
  }

  getTotalQuantity(product: Product) {
    if(product.newQuantity !== undefined){
      return Number(product.totalQuantity);
    }else{
      return product.totalQuantity = 0;
    }
  }

  onUpdate() {
    this.updatedProducts = [];
    let promises: any[] = [];
    this.products.forEach((product) => {
      if (product.newQuantity !== undefined) {
        product.quantity = product.quantity + (+product.newQuantity || 0);
        let promise = this.productService.updateProduct(product);
        promises.push(promise);
        promise
          .then(() => {
            this.updatedProducts.push(product);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
    Promise.all(promises).then(() => {
      this.updatedProducts.forEach((product) => {
        this.toastr.success(`Kolicina za ${product.name} uspesno izmenjena..!`);
      });
      this.getProducts();
    });
  }

  onDelete(id: any) {
    this.productService.deleteProduct(id);
  }

  onEdit(product: Product){
    const modalRef = this.modalService.open(EditProductComponent);
    modalRef.componentInstance.product = product;
    this.getProducts();
  }

  applyFilter() {
    const filterValue = this.filterValue.toLowerCase();

    if (!filterValue) {
      this.getProducts();
    } else {
      this.products = this.products.filter((product) => {
        return product.name.toLowerCase().includes(filterValue);
      });
    }
  }

  currentSort: { field: string | null; direction: string | null } = {
    field: null,
    direction: null,
  };

  sortData(field: string | null) {
    if (
      this.currentSort.field === field &&
      this.currentSort.direction === 'asc'
    ) {
      this.currentSort.direction = 'desc';
      this.products.reverse();
    } else if (
      this.currentSort.field === field &&
      this.currentSort.direction === 'desc'
    ) {
      this.currentSort.direction = null;
      this.products.reverse();
    } else {
      this.currentSort.field = field;
      this.currentSort.direction = 'asc';
      if (field === 'name') {
        this.products.sort((a, b) => a.name.localeCompare(b.name));
      } else if (field === 'quantity') {
        this.products.sort((a, b) => a.quantity - b.quantity);
      }
    }
  }

  getSortDirectionIcon(field: string) {
    if (
      this.currentSort.field === field &&
      this.currentSort.direction === 'asc'
    ) {
      return '▲';
    } else if (
      this.currentSort.field === field &&
      this.currentSort.direction === 'desc'
    ) {
      return '▼';
    } else {
      return '';
    }
  }
  get pageNumbers() {
    const pageCount = Math.ceil(this.products.length / this.itemsPerPage);
    return new Array(pageCount).fill(0).map((val, index) => index+1);
  }
  
  get pageCount() {
    return Math.ceil(this.products.length / this.itemsPerPage);
  }

  onPreviousPage() {
    this.currentPage--;
  }
  
  onNextPage() {
    this.currentPage++;
  }

  onPageSelect(page: number) {
    this.currentPage = page;
    this.getProducts();
  }

  onPageChange(){
    this.getProducts();
  }
}
