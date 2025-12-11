import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EMPTY, expand, firstValueFrom, map, reduce, tap } from 'rxjs';

export type MsTeamsPostDataShape = {
  name: string;
  faves: string;
  "fun-fact": string;
};

@Injectable({
  providedIn: 'root',
})
export class SwPeopleService {
  private http = inject(HttpClient);

  public postFavesAndFunFactToMsTeams(postData: MsTeamsPostDataShape) {
    const teamsWebhookUrl = 'https://default33f001466fcc49e9b5687896b3069d.44.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/49bcbafbcb5a4098906af3d90089e2e2/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=-bhnQEdvTmkARlVjn4Yt8OEZhmnwxTR6kaXl9TZWG7I';
    return firstValueFrom(this.http.post(teamsWebhookUrl, postData));
  }

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