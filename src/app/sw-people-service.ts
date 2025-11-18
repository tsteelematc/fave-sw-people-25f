import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SwPeopleService {
  private http = inject(HttpClient);

  public getPeopleFromSwapiApi() {
    return this.http.get<any>('https://swapi.dev/api/people').pipe(
      map(response => response.results),
      map(people => people.sort(
        (a: any, b: any) => a.name.localeCompare(b.name)
      ))
    );
  }
}