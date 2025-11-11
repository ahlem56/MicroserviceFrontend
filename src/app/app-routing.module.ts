import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// *************** Imports FrontOffice Components ***************

// Trip components
import { TripListFrontOfficeComponent } from './Components/FrontOffice/trip/trip-list/trip-list.component';
import { TripCreateFrontOfficeComponent } from './Components/FrontOffice/trip/trip-create/trip-create.component';
import { TripDetailFrontOfficeComponent } from './Components/FrontOffice/trip/trip-detail/trip-detail.component';

// Carpool components
import { CarpoolingOfferFrontOfficeComponent } from './Components/FrontOffice/carpool/carpooling-offer/carpooling-offer.component';
import { CarpoolingListFrontOfficeComponent } from './Components/FrontOffice/carpool/carpooling-list/carpooling-list.component';
import { CarpoolingCreateFrontOfficeComponent } from './Components/FrontOffice/carpool/carpooling-create/carpooling-create.component';
import { CarpoolingDetailFrontOfficeComponent } from './Components/FrontOffice/carpool/carpooling-detail/carpooling-detail.component';
import { CarpoolingJoinFrontOfficeComponent } from './Components/FrontOffice/carpool/carpooling-join/carpooling-join.component';

// Parcel components
import { ParcelListFrontOfficeComponent } from './Components/FrontOffice/parcel/parcel-list/parcel-list.component';
import { ParcelTrackFrontOfficeComponent } from './Components/FrontOffice/parcel/parcel-track/parcel-track.component';
import { ParcelCreateFrontOfficeComponent } from './Components/FrontOffice/parcel/parcel-create/parcel-create.component';
import { ParcelDetailFrontOfficeComponent } from './Components/FrontOffice/parcel/parcel-detail/parcel-detail.component';

// Vehicle components
import { VehicleDetailFrontOfficeComponent } from './Components/FrontOffice/vehicle/vehicle-detail/vehicle-detail.component';

// Event components
import { EventListFrontOfficeComponent } from './Components/FrontOffice/event/event-list/event-list.component';
import { EventDetailFrontOfficeComponent } from './Components/FrontOffice/event/event-detail/event-detail.component';

// Chat components
import { ChatFrontOfficeComponent } from './Components/FrontOffice/chat/chat/chat.component';
import { ChatListFrontOfficeComponent } from './Components/FrontOffice/chat/chat-list/chat-list.component';

// Chat Message components
import { ChatMessageCreationFrontOfficeComponent } from './Components/FrontOffice/chat-message/chat-message-creation/chat-message-creation.component';
import { ChatMessageEditFrontOfficeComponent } from './Components/FrontOffice/chat-message/chat-message-edit/chat-message-edit.component';

// Complaint components
import { ComplaintCreationFrontOfficeComponent } from './Components/FrontOffice/complaint/complaint-creation/complaint-creation.component';
import { ComplaintListFrontOfficeComponent } from './Components/FrontOffice/complaint/complaint-list/complaint-list.component';
import { ComplaintDetailsFrontOfficeComponent } from './Components/FrontOffice/complaint/complaint-details/complaint-details.component';

//Sign Up Component
import { SignupComponent } from './Components/FrontOffice/signup/signup.component';




// *************** Imports BackOffice Components ***************

//Event components
import { EventCreateBackOfficeComponent } from './Components/BackOffice/event/event-createBackOffice/event-createBackOffice.component';
import { EventListBackOfficeComponent } from './Components/BackOffice/event/event-listBackOffice/event-listBackOffice.component';
import { EventDetailBackOfficeComponent } from './Components/BackOffice/event/event-detailBackOffice/event-detailBackOffice.component';

// Carpool components
import { CarpoolingListBackOfficeComponent } from './Components/BackOffice/carpoolBackOffice/carpooling-listBackOffice/carpooling-listBackOffice.component';
import { CarpoolingDetailBackOfficeComponent } from './Components/BackOffice/carpoolBackOffice/carpooling-detailBackOffice/carpooling-detailBackOffice.component';

// Complaint components
import { ComplaintListBackOfficeComponent } from './Components/BackOffice/complaintBackOffice/complaint-listBackOffice/complaint-listBackOffice.component';
import { ComplaintDetailsBackOfficeComponent } from './Components/BackOffice/complaintBackOffice/complaint-detailsBackOffice/complaint-detailsBackOffice.component';

// dashboard components
import { DashboardComponent } from './Components/BackOffice/dashboard/dashboard.component';

// parcel components
import { ParcelListBackOfficeComponent } from './Components/BackOffice/parcelBackOffice/parcel-listBackOffice/parcel-listBackOffice.component';
import { ParcelDetailBackOfficeComponent } from './Components/BackOffice/parcelBackOffice/parcel-detailBackOffice/parcel-detailBackOffice.component';
import { ParcelTrackBackOfficeComponent } from './Components/BackOffice/parcelBackOffice/parcel-trackBackOffice/parcel-trackBackOffice.component';

//trip components
import { TripListBackOfficeComponent } from './Components/BackOffice/tripBackOffice/trip-listBackOffice/trip-listBackOffice.component';
import { TripDetailBackOfficeComponent } from './Components/BackOffice/tripBackOffice/trip-detailBackOffice/trip-detailBackOffice.component';

//vehicle components
import { VehicleListBackOfficeComponent } from './Components/BackOffice/vehicle/vehicle-list/vehicle-list.component';
import { VehicleCreateBackOfficeComponent } from './Components/BackOffice/vehicle/vehicle-create/vehicle-create.component';
import { VehicleEditBackOfficeComponent } from './Components/BackOffice/vehicle/vehicle-edit/vehicle-edit.component';
import { VehicleDetailBackOfficeComponent } from './Components/BackOffice/vehicle/vehicle-detail/vehicle-detail.component';

//************* Imports Driver Interface Components *************
// Chat components
import { ChatDriverInterfaceComponent } from './Components/DriverInterface/chat/chat/chat.component';
import { ChatListDriverInterfaceComponent } from './Components/DriverInterface/chat/chat-list/chat-list.component';

// Chat Message components
import { ChatMessageCreationDriverInterfaceComponent } from './Components/DriverInterface/chat-message/chat-message-creation/chat-message-creation.component';
import { ChatMessageEditDriverInterfaceComponent } from './Components/DriverInterface/chat-message/chat-message-edit/chat-message-edit.component';

// Trip components
import { TripListDriverInterfaceComponent } from './Components/DriverInterface/trip/trip-list/trip-list.component';
import { TripDetailDriverInterfaceComponent } from './Components/DriverInterface/trip/trip-detail/trip-detail.component';

// parcel components
import { ParcelListDriverInterfaceComponent } from './Components/DriverInterface/parcel/parcel-list/parcel-list.component';
import { ParcelDetailDriverInterfaceComponent } from './Components/DriverInterface/parcel/parcel-detail/parcel-detail.component';
import { ParcelTrackDriverInterfaceComponent } from './Components/DriverInterface/parcel/parcel-track/parcel-track.component';

// vehicle components
import { VehicleListDriverInterfaceComponent } from './Components/DriverInterface/vehicle/vehicle-list/vehicle-list.component';
import { VehicleDetailDriverInterfaceComponent } from './Components/DriverInterface/vehicle/vehicle-detail/vehicle-detail.component';




//************ Imports Shared Components ************
// not found component
import { NotFoundComponent } from './Shared/components/not-found/not-found.component';
import{AccessDeniedComponent} from './Shared/access-denied/access-denied.component';
// login component
import { LoginComponent } from './Shared/login/login.component';

//about component
import { AboutComponent } from './Shared/about/about.component';

// Import components
import { FullComponent } from './Shared/layouts/full/full.component'; // Template's FullComponent
import { LandingPageComponent } from './Shared/landing-page/landing-page.component';
import { AuthGuard } from './auth.guard';
import { ProfileComponent } from './Shared/profile/profile.component';
import { DriversBackOfficeComponent } from './Components/BackOffice/drivers/drivers.component';
import { ScheduleDriverInterfaceComponent } from './Components/DriverInterface/schedule/schedule.component';
import { ForgotPasswordComponent } from './Shared/forgot-password/forgot-password.component';
import { NotificationFrontOfficeComponent } from './Components/FrontOffice/notification/notification.component';
import { ResetPasswordComponent } from './Shared/reset-password/reset-password.component';
import {
  VehicleAssignComponent
} from "./Components/BackOffice/vehicle/vehicle-assign/vehicle-assign/vehicle-assign.component";
import { CreateDriverBackOfficeComponent } from './Components/BackOffice/drivers/create-driver/create-driver.component';
import { SettingsComponent } from './Shared/settings/settings.component';
import { EditProfileComponent } from './Shared/profile/edit-profile/edit-profile.component';
import { EditDriverComponent } from './Components/BackOffice/drivers/edit-driver/edit-driver.component';
import { DriverProfileComponent } from './Shared/profile/driver-profile/driver-profile.component';

import {VehicleMapComponent} from "./Components/BackOffice/vehicle/vehicle-map/vehicle-map.component";
import {VehicleService} from "./Core/vehicle.service";
import {
  VehicleTravelHistoryComponent
} from "./Components/BackOffice/vehicle/vehicle-travel-history/vehicle-travel-history.component";
import { SimpleUsersComponent } from './Components/BackOffice/simple-users/simple-users.component';


// Define routes
const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      // FrontOffice Routes
      { path: '', redirectTo: '/landingPage', pathMatch: 'full' },
      {path : 'landingPage', component: LandingPageComponent},
      { path: 'login', component: LoginComponent },
      {path: 'access-denied', component: AccessDeniedComponent},
      { path: 'about', component: AboutComponent , canActivate: [AuthGuard], data: { roles: ['USER'] }},
      { path: 'signup', component: SignupComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'edit-profile', component: EditProfileComponent },
      {path: 'forgot-password', component: ForgotPasswordComponent},
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'trips', component: TripListFrontOfficeComponent, canActivate: [AuthGuard], data: { roles: ['USER'] } },
      { path: 'trips/create', component: TripCreateFrontOfficeComponent , canActivate: [AuthGuard], data: { roles: ['USER'] }},
      { path: 'trips/:id', component: TripDetailFrontOfficeComponent , canActivate: [AuthGuard], data: { roles: ['USER'] }},
      { path: 'carpooling', component: CarpoolingListFrontOfficeComponent , canActivate: [AuthGuard], data: { roles: ['USER'] }},
      { path: 'carpooling/create', component: CarpoolingCreateFrontOfficeComponent , canActivate: [AuthGuard], data: { roles: ['USER'] }},
      { path: 'carpooling/:id', component: CarpoolingDetailFrontOfficeComponent , canActivate: [AuthGuard], data: { roles: ['USER'] }},
      { path: 'carpooling/join/:id', component: CarpoolingJoinFrontOfficeComponent , canActivate: [AuthGuard], data: { roles: ['USER'] }},
      { path: 'offer', component: CarpoolingOfferFrontOfficeComponent , canActivate: [AuthGuard], data: { roles: ['USER'] }},
      { path: 'parcels', component: ParcelListFrontOfficeComponent , canActivate: [AuthGuard], data: { roles: ['USER'] }},
      { path: 'parcels/track', component: ParcelTrackFrontOfficeComponent , canActivate: [AuthGuard], data: { roles: ['USER'] }},
      { path: 'parcels/create', component: ParcelCreateFrontOfficeComponent , canActivate: [AuthGuard], data: { roles: ['USER'] }},
      { path: 'parcels/:id', component: ParcelDetailFrontOfficeComponent, canActivate: [AuthGuard], data: { roles: ['USER'] } },
      { path: 'vehicle/:id', component: VehicleDetailFrontOfficeComponent },
      { path: 'events', component: EventListFrontOfficeComponent, canActivate: [AuthGuard], data: { roles: ['USER'] } },
      { path: 'events/:id', component: EventDetailFrontOfficeComponent, canActivate: [AuthGuard], data: { roles: ['USER'] } },
      { path: 'chat', component: ChatFrontOfficeComponent , canActivate: [AuthGuard], data: { roles: ['USER'] }},
      { path: 'chat/list', component: ChatListFrontOfficeComponent, canActivate: [AuthGuard], data: { roles: ['USER'] } },
      { path: 'chat-message/create', component: ChatMessageCreationFrontOfficeComponent, canActivate: [AuthGuard], data: { roles: ['USER'] } },
      { path: 'chat-message/edit/:id', component: ChatMessageEditFrontOfficeComponent, canActivate: [AuthGuard], data: { roles: ['USER'] } },
      { path: 'complaints/create', component: ComplaintCreationFrontOfficeComponent, canActivate: [AuthGuard], data: { roles: ['USER'] } },
      { path: 'complaints/list', component: ComplaintListFrontOfficeComponent, canActivate: [AuthGuard], data: { roles: ['USER'] } },
      { path: 'complaints/:id', component: ComplaintDetailsFrontOfficeComponent , canActivate: [AuthGuard], data: { roles: ['USER'] }},
      {path:'notifications',component:NotificationFrontOfficeComponent, canActivate: [AuthGuard], data: { roles: ['USER','Driver'] }},
      { path: 'driver-profile/:id', component: DriverProfileComponent },

      // BackOffice Routes
      { path: 'back-office/dashboard', component: DashboardComponent , canActivate: [AuthGuard], data: { roles: ['Admin'] }},
      { path: 'back-office/events/create', component: EventCreateBackOfficeComponent , canActivate: [AuthGuard], data: { roles: ['Admin'] }},
      { path: 'back-office/events/list', component: EventListBackOfficeComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
      { path: 'back-office/events/:id', component: EventDetailBackOfficeComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
      { path: 'back-office/carpool/list', component: CarpoolingListBackOfficeComponent , canActivate: [AuthGuard], data: { roles: ['Admin'] }},
      { path: 'back-office/carpool/:id', component: CarpoolingDetailBackOfficeComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
      { path: 'back-office/complaints', component: ComplaintListBackOfficeComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
      { path: 'back-office/complaints/:id', component: ComplaintDetailsBackOfficeComponent , canActivate: [AuthGuard], data: { roles: ['Admin'] }},
      { path: 'back-office/parcels', component: ParcelListBackOfficeComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] }},
      { path: 'back-office/parcels/damage', component: ParcelDetailBackOfficeComponent , canActivate: [AuthGuard], data: { roles: ['Admin'] }},
      { path: 'back-office/parcels/track', component: ParcelTrackBackOfficeComponent },
      { path: 'back-office/trips', component: TripListBackOfficeComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
      { path: 'back-office/trips/:id', component: TripDetailBackOfficeComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] }},
      { path: 'back-office/vehicles', component: VehicleListBackOfficeComponent , canActivate: [AuthGuard], data: { roles: ['Admin'] }},
      { path: 'back-office/vehicles/create', component: VehicleCreateBackOfficeComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
      {path: 'back-office/vehicles/map/:id', component: VehicleMapComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] }},
      { path: 'back-office/vehicles/edit/:id', component: VehicleEditBackOfficeComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
      {path:'back-office/vehicles/assign/:id', component : VehicleAssignComponent, canActivate:[AuthGuard],data:{roles:['Admin']}},
      { path: 'back-office/vehicles/travel-history/:id', component: VehicleTravelHistoryComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] }},
      { path: 'back-office/vehicles/:id', component: VehicleDetailBackOfficeComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
      {path : 'back-office/drivers', component: DriversBackOfficeComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] }},
      {path: 'back-office/drivers/create', component: CreateDriverBackOfficeComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] }},
      { path: 'back-office/drivers/edit/:id', component: EditDriverComponent },  // Edit route for driver
      {path: 'back-office/simple-users', component: SimpleUsersComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] }},
      // Driver Interface Routes
      { path: 'driver-interface/chat', component: ChatDriverInterfaceComponent, canActivate: [AuthGuard], data: { roles: ['Driver'] } },
      { path: 'driver-interface/chat/list', component: ChatListDriverInterfaceComponent , canActivate: [AuthGuard], data: { roles: ['Driver'] }},
      { path: 'driver-interface/chat-message/create', component: ChatMessageCreationDriverInterfaceComponent, canActivate: [AuthGuard], data: { roles: ['Driver'] } },
      { path: 'driver-interface/chat-message/edit/:id', component: ChatMessageEditDriverInterfaceComponent, canActivate: [AuthGuard], data: { roles: ['Driver'] } },
      { path: 'driver-interface/trips', component: TripListDriverInterfaceComponent, canActivate: [AuthGuard], data: { roles: ['Driver'] } },
      { path: 'driver-interface/trips/:id', component: TripDetailDriverInterfaceComponent , canActivate: [AuthGuard], data: { roles: ['Driver'] }},
      { path: 'driver-interface/parcels', component: ParcelListDriverInterfaceComponent, canActivate: [AuthGuard], data: { roles: ['Driver'] } },
      { path: 'driver-interface/parcels/:id', component: ParcelDetailDriverInterfaceComponent, canActivate: [AuthGuard], data: { roles: ['Driver'] } },
      { path: 'driver-interface/parcels/track', component: ParcelTrackDriverInterfaceComponent, canActivate: [AuthGuard], data: { roles: ['Driver'] } },
      { path: 'driver-interface/vehicles', component: VehicleListDriverInterfaceComponent, canActivate: [AuthGuard], data: { roles: ['Driver'] } },
      { path: 'driver-interface/vehicles/:id', component: VehicleDetailDriverInterfaceComponent, canActivate: [AuthGuard], data: { roles: ['Driver'] } },
      {path:  'driver-interface/schedule',component : ScheduleDriverInterfaceComponent, canActivate: [AuthGuard], data: { roles: ['Driver'] }}

    ]
  },

  // Wildcard route for 404
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
