import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: { returnUrl: '/' } } },
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService.login on login', () => {
    authServiceSpy.login.and.returnValue(of('')); // mock the AuthService method

    component.username = 'test';
    component.password = 'test';
    component.login();

    expect(authServiceSpy.login).toHaveBeenCalledWith('test', 'test');
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should set error message on invalid login', () => {
    authServiceSpy.login.and.returnValue(
      // Use throwError to mock an error
      throwError({ error: { message: 'Invalid username or password.' } })
    );

    component.username = 'test';
    component.password = 'test';
    component.login();

    expect(component.error).toBe('Invalid username or password.');
  });
});
