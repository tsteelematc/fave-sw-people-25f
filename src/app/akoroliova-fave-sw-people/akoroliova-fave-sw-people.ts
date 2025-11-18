import { Component, inject } from '@angular/core';
import { SwPeopleService } from '../sw-people.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-akoroliova-fave-sw-people',
  imports: [AsyncPipe],
  templateUrl: './akoroliova-fave-sw-people.html',
  styleUrl: './akoroliova-fave-sw-people.css',
})
export class AkoroliovaFaveSwPeople {
  private readonly peopleSvc = inject(SwPeopleService);

  protected readonly people$ = this.peopleSvc.getPeopleFromSwapiApi();
}
