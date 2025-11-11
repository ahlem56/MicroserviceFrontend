import { Component, OnInit } from '@angular/core';
import { CarpoolService } from 'src/app/Core/carpool.service';
import { UserService } from 'src/app/Core/user.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-carpool-create',
  templateUrl: './carpooling-create.component.html',
  styleUrls: ['./carpooling-create.component.css'],
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  standalone: true
})
export class CarpoolingCreateFrontOfficeComponent implements OnInit {
  carpool: any = {
    carpoolDeparture: '',
    carpoolDestination: '',
    carpoolDate: '',
    carpoolTime: '',
    carpoolCapacity: null,
    carpoolCondition: '',
    carpoolPrice: null,
    licensePlate: '',
  };
  simpleUserId: number | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  myCarpools: any[] = [];
  filteredCarpools: any[] = [];
  carpoolForm: FormGroup;
  showForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private carpoolService: CarpoolService,
    private userService: UserService,
    private router: Router
  ) {
    this.carpoolForm = this.fb.group({
      carpoolDeparture: ['', Validators.required],
      carpoolDestination: ['', Validators.required],
      carpoolDate: ['', [Validators.required, this.futureDateValidator()]],
      carpoolTime: ['', Validators.required],
      carpoolCapacity: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      carpoolCondition: [''],
      carpoolPrice: ['', [Validators.required, Validators.min(0)]],
      licensePlate: ['', Validators.required]
    });
  }

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.simpleUserId = currentUser.userId;
    console.log("SimpleUser ID: ", this.simpleUserId);
  }

  createCarpool() {
    if (!this.simpleUserId) {
      this.errorMessage = 'User ID is not available.';
      return;
    }

    if (this.carpoolForm.invalid) {
      this.errorMessage = 'Please fill out the form correctly.';
      return;
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.carpoolService.createCarpool(this.carpoolForm.value, this.simpleUserId, headers).subscribe(
      (createdCarpool) => {
        console.log('Carpool Created', createdCarpool);
        this.successMessage = 'Your carpool has been created successfully!';
        this.errorMessage = '';
        this.carpoolForm.reset();
      },
      (error) => {
        // Check if the error is due to the carpool limit
        if (error.error && error.error.message === 'You have reached the limit of 4 carpool offers. A subscription is required to create more offers.') {
          this.errorMessage = 'You can\'t create more carpool, you have to subscribe.';
        } else {
          this.errorMessage = 'Error creating carpool.';
        }
        console.error(error);
      }
    );
  }

  joinCarpool() {
    this.router.navigate(['/carpooling/']);
  }

  displayForm() {
    this.showForm = true;
  }

  showMyCarpools() {
    if (!this.simpleUserId) {
      this.errorMessage = 'User ID is not available.';
      return;
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.carpoolService.getCarpoolsJoinedByUser(this.simpleUserId, headers).subscribe(
      (carpools) => {
        this.filteredCarpools = this.filterFutureCarpools(carpools);
        console.log("My Future Carpools: ", this.filteredCarpools);
      },
      (error) => {
        this.errorMessage = 'Error fetching your carpools.';
        console.error(error);
      }
    );
  }

  filterFutureCarpools(carpools: any[]): any[] {
    const today = new Date();
    return carpools.filter(carpool => new Date(carpool.carpoolDate) >= today);
  }

  viewCarpoolDetails(carpoolId: number) {
    this.router.navigate([`/carpooling/join/${carpoolId}`]);
  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today ? null : { futureDate: { value: control.value } };
    };
  }
}