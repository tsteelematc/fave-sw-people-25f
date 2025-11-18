import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SwPeopleService {
  private http = inject(HttpClient);

  public getPeopleFromSwapiApi() {

    return this.http.get<any>('https://swapi.dev/api/people').pipe(
      map(
        response => response.results
      ),
      tap(
        x => console.log(x)
      ),
      map(
        people => people.sort(
          (a: any, b: any) => a.name.localeCompare(b.name)
        )
      )
    );

  }
}
