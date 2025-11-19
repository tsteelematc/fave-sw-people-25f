import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EMPTY, expand, firstValueFrom, map, reduce, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SwPeopleService {
  private http = inject(HttpClient);

  public getPeopleFromSwapiApi() {

    return this.http.get<any>('https://swapi.dev/api/people').pipe(
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
        (acc: any[], people) => [
          ...acc,
          ...people,
        ],
        [],
      ),
      map(
        people => people.sort(
          (a: any, b: any) => a.name.localeCompare(b.name)
        )
      ),
    );
    
  }

  public getPeoplePageOne() {

    // return Promise.reject("No soup for you : - )");

    const pageObvservable = this.http.get<any>('https://swapi.dev/api/people/?page=1').pipe(
      map(
        response => response.results
      ),
    );

    return firstValueFrom(pageObvservable);
  }

  public getPeoplePageTwo() {

    // return Promise.reject("No candy for you : - )");

    const pageObvservable = this.http.get<any>('https://swapi.dev/api/people/?page=2').pipe(
      map(
        response => response.results
      ),
    );

    return firstValueFrom(pageObvservable);
  }
}
