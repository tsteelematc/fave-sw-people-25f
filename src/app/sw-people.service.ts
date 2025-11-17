import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { concat, EMPTY, expand, flatMap, map, mergeMap, reduce, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SwPeopleService {
  private http = inject(HttpClient);

  public getPeopleFromSwapiApi() {
    return this.http.get<any>("https://swapi.dev/api/people").pipe(
      expand(
        page => page.next 
          ? this.http.get<any>(page.next) 
          : EMPTY
      ),
      map(
        response => response.results
      ),
      tap(
        x => console.log(x)
      ),
      reduce(
        (acc: any[], currentPagePeople) => [
          ...acc
          , ...currentPagePeople
        ]
        , []
      ),
      map(
        combinedPeople => combinedPeople.sort(
          (a: any, b: any) => a.name.localeCompare(b.name)
        )
      ),
    );
  }
}