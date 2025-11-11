import { Component,OnInit } from '@angular/core';
import { CarpoolService } from 'src/app/Core/carpool.service';
import { ActivatedRoute } from '@angular/router';  // Import ActivatedRoute to get route params
import { HttpHeaders } from '@angular/common/http';

@Component({
    selector: 'app-carpooling-detail-back-office',
    templateUrl: './carpooling-detailBackOffice.component.html',
    styleUrls: ['./carpooling-detailBackOffice.component.css'],
    standalone: false
})
export class CarpoolingDetailBackOfficeComponent implements OnInit {


    carpoolDetails: any = {};
    usersJoined: any[] = [];
    isLoading: boolean = true;
    errorMessage: string = '';


  
    constructor(private carpoolService: CarpoolService, private route: ActivatedRoute) {}
  
    ngOnInit(): void {
      const carpoolId = Number(this.route.snapshot.paramMap.get('id'));
      this.loadCarpoolDetails(carpoolId);
    }
  
    loadCarpoolDetails(carpoolId: number): void {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
   
      // Fetch carpool details
      this.carpoolService.getCarpoolById(carpoolId, headers).subscribe({
        next: (data) => {
          this.carpoolDetails = data;
          this.loadUsersJoined(carpoolId, headers);
        },
        error: (error) => {
          console.error("Erreur lors du chargement des détails du covoiturage :", error);
          this.errorMessage = "Une erreur est survenue lors du chargement des détails.";
          this.isLoading = false;
        }
      });
    }
  
    loadUsersJoined(carpoolId: number, headers: HttpHeaders): void {
      this.carpoolService.getUsersWhoJoinedCarpool(carpoolId, headers).subscribe({
        next: (data) => {
          this.usersJoined = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error("error loading users who joined carpool", error);
          this.errorMessage = "error loading users";
          this.isLoading = false;
        }
      });
    }
  }
