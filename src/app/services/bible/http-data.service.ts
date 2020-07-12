import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { LogService } from 'src/app/logger/log.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpDataService extends LogWrapper implements OnDestroy {

  constructor(
    logService: LogService,
    private http: HttpClient
  ) {
    super(logService);
  }
  
  ngOnDestroy() { }

  public getJson(path: string): Observable<any> {
    return this.http.get(path);
  }
}
