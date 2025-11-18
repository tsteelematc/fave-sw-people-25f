import { Component, inject } from '@angular/core';
import { SwPeopleService } from '../sw-people.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-kimberg-faves',
  imports: [AsyncPipe],
  templateUrl: './kimberg-faves.html',
  styleUrl: './kimberg-faves.css',
})
export class KimbergFaves {
  private readonly peopleSvc = inject(SwPeopleService);

  protected readonly people$ = this.peopleSvc.getPeopleFromSwapiApi();
}
