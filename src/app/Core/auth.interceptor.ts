import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, concatMap, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private http: HttpClient) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Prefer a gateway token if present (e.g., Keycloak or exchanged token)
    const gatewayToken = localStorage.getItem('gatewayToken');
    const symfonyToken = localStorage.getItem('token');

    const isGatewayCall =
      // Absolute gateway URL (docker/prod)
      req.url.startsWith(`${environment.gatewayUrl}/`) ||
      // Relative gateway-routed paths
      req.url.includes('/reclamation/') ||
      req.url.includes('/event-service/') ||
      req.url.includes('/trip/') ||
      req.url.includes('/user-service/');

    const bearer = isGatewayCall ? (gatewayToken || symfonyToken) : symfonyToken;

    let authedReq = bearer
      ? req.clone({ setHeaders: { Authorization: `Bearer ${bearer}` } })
      : req;

    // In dev, let proxy handle CORS, don't try exchange logic
    if (!environment.production) {
      return next.handle(authedReq);
    }

    // In docker/prod, if call to gateway fails with 401, try exchange once then retry
    return next.handle(authedReq).pipe(
      catchError(err => {
        if (!isGatewayCall || err.status !== 401) {
          return throwError(() => err);
        }
        const currentGatewayToken = localStorage.getItem('gatewayToken');
        if (currentGatewayToken || !symfonyToken) {
          return throwError(() => err);
        }

        const candidates = environment.tokenExchangeUrlCandidates ?? [environment.tokenExchangeUrl];

        // Try GET then POST for each candidate; accept multiple response shapes
        const tryOne = (url: string) => {
          // GET
          return this.http.get(url, {
            headers: { Authorization: `Bearer ${symfonyToken}` },
            observe: 'response',
          }).pipe(
            catchError(() => of(null)),
            switchMap(res => {
              if (res && res.body) {
                const token = extractAccessToken(res.body) || extractAccessTokenFromHeaders(res.headers?.get('Authorization'));
                if (token) return of(token);
              }
              // POST fallback
              return this.http.post(url, {}, {
                headers: { Authorization: `Bearer ${symfonyToken}` },
                observe: 'response',
              }).pipe(
                catchError(() => of(null)),
                switchMap(res2 => {
                  if (res2 && res2.body) {
                    const token2 = extractAccessToken(res2.body) || extractAccessTokenFromHeaders(res2.headers?.get('Authorization'));
                    if (token2) return of(token2);
                  }
                  return of(null);
                })
              );
            })
          );
        };

        return from(candidates).pipe(
          concatMap(u => tryOne(u)),
          switchMap(found => {
            if (!found) return throwError(() => err);
            localStorage.setItem('gatewayToken', found);
            const retried = req.clone({ setHeaders: { Authorization: `Bearer ${found}` } });
            return next.handle(retried);
          })
        );
      })
    );
  }
}

// Helpers
function extractAccessToken(body: any): string | null {
  if (!body) return null;
  if (typeof body === 'string') {
    return normalizeToken(body);
  }
  const possible = body.access_token || body.token || body.accessToken;
  return possible ? normalizeToken(possible) : null;
}

function extractAccessTokenFromHeaders(authorizationHeader: string | null): string | null {
  if (!authorizationHeader) return null;
  if (authorizationHeader.startsWith('Bearer ')) {
    return authorizationHeader.slice(7);
  }
  return normalizeToken(authorizationHeader);
}

function normalizeToken(value: string): string | null {
  if (!value) return null;
  return value.startsWith('Bearer ') ? value.slice(7) : value;
}


