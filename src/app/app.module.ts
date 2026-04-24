import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookingManageComponent } from './components/admin/booking-manage/booking-manage.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { HotelManageComponent } from './components/admin/hotel-manage/hotel-manage.component';
import { PromotionManageComponent } from './components/admin/promotion-manage/promotion-manage.component';
import { RoomManageComponent } from './components/admin/room-manage/room-manage.component';
import { UserManageComponent } from './components/admin/user-manage/user-manage.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { BookingHistoryComponent } from './components/booking-history/booking-history.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { HotelDetailComponent } from './components/hotel-detail/hotel-detail.component';
import { HotelsComponent } from './components/hotels/hotels.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    BookingManageComponent,
    DashboardComponent,
    HotelManageComponent,
    PromotionManageComponent,
    RoomManageComponent,
    UserManageComponent,
    BookingFormComponent,
    BookingHistoryComponent,
    HomepageComponent,
    HotelDetailComponent,
    HotelsComponent,
    LoginComponent,
    ProfileComponent,
    RegisterComponent,
    UserDashboardComponent,
    NavbarComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
