import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpDataService {

  private http: HttpClient;

  constructor(
    httpClient: HttpClient
  ) {
    this.http = httpClient;
  }

  public getJson(path: string): Observable<any> {
    return this.http.get(path);
  }
}
