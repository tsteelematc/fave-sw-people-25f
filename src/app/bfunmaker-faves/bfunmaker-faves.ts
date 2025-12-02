import { Component, inject } from '@angular/core';
import { SwPeopleService } from '../sw-people.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-bfunmaker-faves',
  imports: [AsyncPipe],
  templateUrl: './bfunmaker-faves.html',
  styleUrl: './bfunmaker-faves.css',
})
export class BfunmakerFaves {
  private readonly peopleSvc = inject(SwPeopleService);

  protected readonly people$ = this.peopleSvc.getPeopleFromSwapiApi();
}
