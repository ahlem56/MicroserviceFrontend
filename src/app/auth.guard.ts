import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole')?.toUpperCase();
    const requiredRoles = route.data['roles'] as string[];
  
    console.log('Token:', !!token);
    console.log('User Role:', userRole);
    console.log('Required Roles:', requiredRoles);
  
    if (!token) {
      console.log('No token, redirecting to /login');
      this.router.navigate(['/login'], { queryParams: route.queryParams });
      return false;
    }
  
    if (requiredRoles && userRole && !requiredRoles.some(role => role.toUpperCase() === userRole)) {
      console.log('Access denied. User role:', userRole, 'Required roles:', requiredRoles);
      this.router.navigate(['/access-denied']);
      return false;
    }
  
    return true;
  }
}
