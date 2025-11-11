import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule,DatePipe } from '@angular/common';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './Core/auth.interceptor';
import { GoogleMapsModule } from '@angular/google-maps';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


// *************** FrontOffice Components ***************
import { TripListFrontOfficeComponent } from './Components/FrontOffice/trip/trip-list/trip-list.component';
import { TripCreateFrontOfficeComponent } from './Components/FrontOffice/trip/trip-create/trip-create.component';
import { TripDetailFrontOfficeComponent } from './Components/FrontOffice/trip/trip-detail/trip-detail.component';

import { CarpoolingListFrontOfficeComponent } from './Components/FrontOffice/carpool/carpooling-list/carpooling-list.component';
import { CarpoolingCreateFrontOfficeComponent } from './Components/FrontOffice/carpool/carpooling-create/carpooling-create.component';
import { CarpoolingDetailFrontOfficeComponent } from './Components/FrontOffice/carpool/carpooling-detail/carpooling-detail.component';
import { CarpoolingJoinFrontOfficeComponent } from './Components/FrontOffice/carpool/carpooling-join/carpooling-join.component';
import { CarpoolingOfferFrontOfficeComponent } from './Components/FrontOffice/carpool/carpooling-offer/carpooling-offer.component';

import { ParcelListFrontOfficeComponent } from './Components/FrontOffice/parcel/parcel-list/parcel-list.component';
import { ParcelTrackFrontOfficeComponent } from './Components/FrontOffice/parcel/parcel-track/parcel-track.component';
import { ParcelCreateFrontOfficeComponent } from './Components/FrontOffice/parcel/parcel-create/parcel-create.component';
import { ParcelDetailFrontOfficeComponent } from './Components/FrontOffice/parcel/parcel-detail/parcel-detail.component';

import { VehicleDetailFrontOfficeComponent } from './Components/FrontOffice/vehicle/vehicle-detail/vehicle-detail.component';

import { EventListFrontOfficeComponent } from './Components/FrontOffice/event/event-list/event-list.component';
import { EventDetailFrontOfficeComponent } from './Components/FrontOffice/event/event-detail/event-detail.component';
import { EventNotifyFrontOfficeComponent } from './Components/FrontOffice/event/event-notify/event-notify.component';

import { ChatFrontOfficeComponent } from './Components/FrontOffice/chat/chat/chat.component';
import { ChatListFrontOfficeComponent } from './Components/FrontOffice/chat/chat-list/chat-list.component';

import { ChatMessageCreationFrontOfficeComponent } from './Components/FrontOffice/chat-message/chat-message-creation/chat-message-creation.component';
import { ChatMessageEditFrontOfficeComponent } from './Components/FrontOffice/chat-message/chat-message-edit/chat-message-edit.component';

import { ComplaintCreationFrontOfficeComponent } from './Components/FrontOffice/complaint/complaint-creation/complaint-creation.component';
import { ComplaintListFrontOfficeComponent } from './Components/FrontOffice/complaint/complaint-list/complaint-list.component';
import { ComplaintDetailsFrontOfficeComponent } from './Components/FrontOffice/complaint/complaint-details/complaint-details.component';

import { SignupComponent } from './Components/FrontOffice/signup/signup.component';

// *************** BackOffice Components ***************
import { DashboardModule } from './Components/BackOffice/dashboard/dashboard.module';  // Import the module where DashboardComponent is declared

import { EventCreateBackOfficeComponent } from './Components/BackOffice/event/event-createBackOffice/event-createBackOffice.component';
import { EventListBackOfficeComponent } from './Components/BackOffice/event/event-listBackOffice/event-listBackOffice.component';
import { EventDetailBackOfficeComponent } from './Components/BackOffice/event/event-detailBackOffice/event-detailBackOffice.component';
import { EventNotifyBackOfficeComponent } from './Components/BackOffice/event/event-notify/event-notify.component';

import { CarpoolingListBackOfficeComponent } from './Components/BackOffice/carpoolBackOffice/carpooling-listBackOffice/carpooling-listBackOffice.component';
import { CarpoolingDetailBackOfficeComponent } from './Components/BackOffice/carpoolBackOffice/carpooling-detailBackOffice/carpooling-detailBackOffice.component';

import { ComplaintListBackOfficeComponent } from './Components/BackOffice/complaintBackOffice/complaint-listBackOffice/complaint-listBackOffice.component';
import { ComplaintDetailsBackOfficeComponent } from './Components/BackOffice/complaintBackOffice/complaint-detailsBackOffice/complaint-detailsBackOffice.component';

import { ParcelListBackOfficeComponent } from './Components/BackOffice/parcelBackOffice/parcel-listBackOffice/parcel-listBackOffice.component';
import { ParcelDetailBackOfficeComponent } from './Components/BackOffice/parcelBackOffice/parcel-detailBackOffice/parcel-detailBackOffice.component';
import { ParcelTrackBackOfficeComponent } from './Components/BackOffice/parcelBackOffice/parcel-trackBackOffice/parcel-trackBackOffice.component';

import { TripListBackOfficeComponent } from './Components/BackOffice/tripBackOffice/trip-listBackOffice/trip-listBackOffice.component';
import { TripDetailBackOfficeComponent } from './Components/BackOffice/tripBackOffice/trip-detailBackOffice/trip-detailBackOffice.component';

import { VehicleListBackOfficeComponent } from './Components/BackOffice/vehicle/vehicle-list/vehicle-list.component';
import { VehicleCreateBackOfficeComponent } from './Components/BackOffice/vehicle/vehicle-create/vehicle-create.component';
import { VehicleEditBackOfficeComponent } from './Components/BackOffice/vehicle/vehicle-edit/vehicle-edit.component';
import { VehicleDetailBackOfficeComponent } from './Components/BackOffice/vehicle/vehicle-detail/vehicle-detail.component';

// *************** Driver Interface Components ***************
import { ChatDriverInterfaceComponent } from './Components/DriverInterface/chat/chat/chat.component';
import { ChatListDriverInterfaceComponent } from './Components/DriverInterface/chat/chat-list/chat-list.component';
import { ChatMessageCreationDriverInterfaceComponent } from './Components/DriverInterface/chat-message/chat-message-creation/chat-message-creation.component';
import { ChatMessageEditDriverInterfaceComponent } from './Components/DriverInterface/chat-message/chat-message-edit/chat-message-edit.component';
import { TripListDriverInterfaceComponent } from './Components/DriverInterface/trip/trip-list/trip-list.component';
import { TripDetailDriverInterfaceComponent } from './Components/DriverInterface/trip/trip-detail/trip-detail.component';
import { ParcelListDriverInterfaceComponent } from './Components/DriverInterface/parcel/parcel-list/parcel-list.component';
import { ParcelDetailDriverInterfaceComponent } from './Components/DriverInterface/parcel/parcel-detail/parcel-detail.component';
import { ParcelTrackDriverInterfaceComponent } from './Components/DriverInterface/parcel/parcel-track/parcel-track.component';
import { VehicleListDriverInterfaceComponent } from './Components/DriverInterface/vehicle/vehicle-list/vehicle-list.component';
import { VehicleDetailDriverInterfaceComponent } from './Components/DriverInterface/vehicle/vehicle-detail/vehicle-detail.component';

// *************** Shared Components ***************
import { NotFoundComponent } from './Shared/components/not-found/not-found.component';
import { FullComponent } from './Shared/layouts/full/full.component';
import { LoginComponent } from './Shared/login/login.component';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './Shared/profile/profile.component';
import { ForgotPasswordComponent } from './Shared/forgot-password/forgot-password.component';
import { NotificationFrontOfficeComponent } from './Components/FrontOffice/notification/notification.component';
import { AccessDeniedComponent } from './Shared/access-denied/access-denied.component';
import { ResetPasswordComponent } from './Shared/reset-password/reset-password.component';
import { ScheduleDriverInterfaceComponent } from './Components/DriverInterface/schedule/schedule.component';
import { CreateDriverBackOfficeComponent } from './Components/BackOffice/drivers/create-driver/create-driver.component';
import { EditProfileComponent } from './Shared/profile/edit-profile/edit-profile.component';
import { FooterComponent } from './Shared/footer/footer.component';
import { EditDriverComponent } from './Components/BackOffice/drivers/edit-driver/edit-driver.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ConfirmDeleteComponentComponent } from './Components/BackOffice/event/confirm-delete-component/confirm-delete-component.component';
import { ToastrModule } from 'ngx-toastr';
import { ToastNotificationComponent } from './Shared/toast-notification/toast-notification.component';

import {VehicleTravelHistoryComponent} from "./Components/BackOffice/vehicle/vehicle-travel-history/vehicle-travel-history.component";

// Define routes
@NgModule({
  declarations: [
    AppComponent,
    
    TripListFrontOfficeComponent,
    TripDetailFrontOfficeComponent,
    CarpoolingListFrontOfficeComponent,
    CarpoolingJoinFrontOfficeComponent,
    ParcelListFrontOfficeComponent,
    ParcelTrackFrontOfficeComponent,
    ParcelCreateFrontOfficeComponent,
    ParcelDetailFrontOfficeComponent,
    VehicleDetailFrontOfficeComponent,
    EventDetailFrontOfficeComponent,
    EventNotifyFrontOfficeComponent,
    ChatFrontOfficeComponent,
    ChatListFrontOfficeComponent,
    ChatMessageCreationFrontOfficeComponent,
    ChatMessageEditFrontOfficeComponent,

   //EventDetailBackOfficeComponent,
    EventNotifyBackOfficeComponent,
   
    CarpoolingListBackOfficeComponent,
    CarpoolingDetailBackOfficeComponent,
    ParcelListBackOfficeComponent,
    ParcelDetailBackOfficeComponent,
    ParcelTrackBackOfficeComponent,
    TripListBackOfficeComponent,
    TripDetailBackOfficeComponent,
    VehicleListBackOfficeComponent,
    VehicleCreateBackOfficeComponent,
    VehicleEditBackOfficeComponent,
    VehicleDetailBackOfficeComponent,
    ChatDriverInterfaceComponent,
    ChatListDriverInterfaceComponent,
    ChatMessageCreationDriverInterfaceComponent,
    ChatMessageEditDriverInterfaceComponent,
    TripDetailDriverInterfaceComponent,
    ParcelListDriverInterfaceComponent,
    ParcelDetailDriverInterfaceComponent,
    ParcelTrackDriverInterfaceComponent,
    VehicleListDriverInterfaceComponent,
    VehicleDetailDriverInterfaceComponent,
    NotFoundComponent
    
  ],
  imports: [
    //EventListFrontOfficeComponent,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    
    MatPaginatorModule,
    MatTableModule,
    ConfirmDeleteComponentComponent,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    TripCreateFrontOfficeComponent,
    CarpoolingDetailFrontOfficeComponent,
    CarpoolingOfferFrontOfficeComponent,
    ComplaintDetailsFrontOfficeComponent,
    ComplaintListFrontOfficeComponent,

    DashboardModule,
    ToastrModule.forRoot({
      progressBar: true,
      closeButton: true,
      newestOnTop: true,
      tapToDismiss: true,
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    ToastNotificationComponent,
    TripListDriverInterfaceComponent,
    ResetPasswordComponent,
    EditDriverComponent,
    ComplaintListBackOfficeComponent,
    ComplaintDetailsBackOfficeComponent,
    CarpoolingCreateFrontOfficeComponent,
    ComplaintCreationFrontOfficeComponent,
    FooterComponent,
    EditProfileComponent,
    FormsModule,
    GoogleMapsModule,
    HttpClientModule,
    RouterModule,
    ScheduleDriverInterfaceComponent,
    ForgotPasswordComponent,
    ProfileComponent,
    AccessDeniedComponent,
    NotificationFrontOfficeComponent,
    FullComponent   // Import standalone component
  ],
  providers: [
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent],
  exports: [FooterComponent]
})
export class AppModule { }
