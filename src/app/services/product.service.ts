import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { Product } from '../models/products';

@Injectable({
  providedIn: 'root',
})
export class ProductService {


  constructor(private afs: AngularFirestore, private toastr: ToastrService) {
  }

  getProducts(): Observable<Product[]>{
    return this.afs.collection('products').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Product;
          const productId = a.payload.doc.id;
          return { productId, totalQuantity: data.quantity, ...data };
        });
      })
    );
  }

  checkIfDocumentExists(documentName: string): Promise<boolean> {
    return this.afs
      .collection<Product>('products')
      .ref.where('name', '==', documentName.toUpperCase())
      .get()
      .then((querySnapshot) => {
        return !querySnapshot.empty;
      });
  }

  addProduct(data: any) {
    this.afs
      .collection('products')
      .add(data)
      .then(() => {
        this.toastr.success('Proizvod uspesno dodat ..!');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  updateProduct(product: Product) {
    const productRef = this.afs.doc(`products/${product.productId}`)
    const productData = {
      name: product.name,
      quantity: product.quantity,
    };
    return productRef.update(productData).then(() => {
    });
  }

  editProduct(product: Product) {
    const productRef = this.afs.collection('products').doc(product.productId);
    productRef.update(product);
  }
  

  deleteProduct(id: any) {
    this.afs.doc(`products/${id}`).delete();
  }
}
