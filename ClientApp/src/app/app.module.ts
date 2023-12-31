import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { HousesComponent } from './houses/Grid/houses.component';
import { DetailsComponent } from './houses/Details/details.component';
import { ConvertCurrency } from './shared/convertPipe';
import { HouseformComponent } from './houses/houseform.component';
import { LoginComponent } from './users/login/login.component';
import { ListingsComponent } from './houses/Listings/listings.component';
import { OrderTableComponent } from './Order/Table.component';
import { RegisterComponent } from './users/register/register.component';
import { OrderformComponent } from './Order/orderform/orderform.component';
import { ModalComponent } from './houses/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    HousesComponent,
    DetailsComponent,
    ConvertCurrency,
    HouseformComponent,
    ListingsComponent,
    LoginComponent,
    OrderTableComponent,
    RegisterComponent,
    OrderformComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'houses', component: HousesComponent },
      { path: 'houseform', component: HouseformComponent },
      { path: 'details/:id', component: DetailsComponent },
      { path: 'listings', component: ListingsComponent },
      { path: 'houseform/:mode/:id', component: HouseformComponent },
      { path: 'login', component: LoginComponent },
      { path: 'Table', component: OrderTableComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'orderform/:orderId', component: OrderformComponent },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
