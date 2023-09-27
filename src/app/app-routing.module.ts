import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditProductComponent } from './add-edit-product/add-edit-product.component';
import { LoginComponent } from './login/login.component';
import { ProductsComponent } from './products/products.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {path: "", redirectTo: "login", pathMatch: "prefix"},
  {path: "products", component: ProductsComponent, canActivate: [AuthGuard]},
  {path: "products/add", component: AddEditProductComponent, canActivate: [AuthGuard]},
  {path: "login", component: LoginComponent},
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
