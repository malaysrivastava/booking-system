import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://35.86.246.16:7001/api'; // Base URL for proxy

  constructor(private http: HttpClient) {}

  getData(path:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${path}`); // Adjust endpoint as needed
  }
  postData(path:string,data:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${path}`, data); // Adjust endpoint as needed
  }
}
