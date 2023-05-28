import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, mergeMap, Observable, of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>({});
  public currentUser = this.currentUserSubject.asObservable();


  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<any> {
    if (username === 'test' && password === 'test') {
      return this.generateToken().pipe(mergeMap((token) => {
        localStorage.setItem('currentUser', JSON.stringify({ username, token: token.access_token }));
        this.currentUserSubject.next({ username, token: token.access_token });
        return this.currentUser;
      }))
    }
    return new Observable<any>(subscriber => {
      subscriber.error({ error: { message: 'Username or password is incorrect' } });
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next({});
  }

  isAuthenticated(): boolean {
    const token = this.currentUserValue?.token;
    return !this.jwtHelper.isTokenExpired(token || '');
  }

  private generateToken(): Observable<{ access_token: string }> {
    // TODO: Generate a new token or get it from the server.
    return of({ access_token: TEST_TOKEN });
  }
}

