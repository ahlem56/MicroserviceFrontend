import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarpoolService } from 'src/app/Core/carpool.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-carpooling-join',
  templateUrl: './carpooling-join.component.html',
  styleUrls: ['./carpooling-join.component.css'],
  standalone: false
})
export class CarpoolingJoinFrontOfficeComponent implements OnInit {
  carpoolId!: number;
  userId!: number;
  carpool: any = null;
  numberOfPlaces: number = 1;
  errorMessage: string = '';
  successMessage: string = '';
  hasJoined: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carpoolService: CarpoolService
  ) {}

  ngOnInit(): void {
    this.carpoolId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.carpoolId) {
      this.errorMessage = '❌ ID du covoiturage introuvable.';
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      this.errorMessage = '❌ Aucun utilisateur connecté trouvé.';
      this.router.navigate(['/login']);
      return;
    }

    const user = JSON.parse(storedUser);
    this.userId = user.userId;

    this.loadCarpoolDetails();
    this.checkIfUserJoined();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = '❌ Aucun token trouvé.';
      this.router.navigate(['/login']);
      throw new Error('No token found');
    }
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
  }

  private loadCarpoolDetails(): void {
    const headers = this.getHeaders();
    this.carpoolService.getCarpoolById(this.carpoolId, headers).subscribe({
      next: (carpool) => {
        this.carpool = carpool;
        console.log('🔍 Covoiturage chargé :', carpool);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des détails du covoiturage.';
        console.error('❌ Erreur :', error);
      }
    });
  }

  private checkIfUserJoined(): void {
    const headers = this.getHeaders();
    this.carpoolService.getCarpoolsJoinedByUser(this.userId, headers).subscribe({
      next: (joinedCarpools) => {
        this.hasJoined = joinedCarpools.some((carpool: any) => carpool.carpoolId === this.carpoolId);
        console.log('🔍 Utilisateur a rejoint :', this.hasJoined);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la vérification du statut de participation.';
        console.error('❌ Erreur :', error);
      }
    });
  }

  joinCarpool(): void {
    if (!this.carpool) {
      this.errorMessage = 'Détails du covoiturage non chargés.';
      return;
    }
    if (this.numberOfPlaces <= 0 || this.numberOfPlaces > this.carpool.carpoolCapacity) {
      this.errorMessage = `Veuillez sélectionner entre 1 et ${this.carpool.carpoolCapacity} places.`;
      return;
    }

    const headers = this.getHeaders();
    this.carpoolService.joinCarpool(this.carpoolId, this.userId, this.numberOfPlaces, headers).subscribe({
      next: (response) => {
        this.successMessage = '✅ Vous avez rejoint le covoiturage avec succès.';
        this.errorMessage = '';
        this.hasJoined = true;
        console.log('✅ Covoiturage rejoint :', response);
        setTimeout(() => {
          this.router.navigate(['/carpooling']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = error.error || 'Erreur lors de l\'inscription au covoiturage.';
        console.error('❌ Erreur :', error);
      }
    });
  }

  leaveCarpool(): void {
    const headers = this.getHeaders();
    this.carpoolService.leaveCarpool(this.carpoolId, this.userId, headers).subscribe({
      next: () => {
        this.successMessage = '✅ Vous avez quitté le covoiturage.';
        this.errorMessage = '';
        this.hasJoined = false;
        console.log('✅ Covoiturage quitté');
        setTimeout(() => {
          this.router.navigate(['/carpooling']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du départ du covoiturage.';
        console.error('❌ Erreur :', error);
      }
    });
  }
}
