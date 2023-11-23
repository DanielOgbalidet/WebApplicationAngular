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
import { OrderTableComponent } from './Order/Table.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    HousesComponent,
    DetailsComponent, 
    ConvertCurrency,
    HouseformComponent,
    LoginComponent
    HouseformComponent,
    OrderTableComponent,

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
      { path: 'houseform/:mode/:id', component: HouseformComponent },
      { path: 'login', component: LoginComponent },
      { path: 'Table', component: OrderTableComponent },
      { path: '**', redirectTo: '', pathMatch: 'full'},
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
