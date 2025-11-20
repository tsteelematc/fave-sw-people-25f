import { Component, inject } from '@angular/core';
// import { SwPeopelService } from '../sw-peopel.service';
import { SwPeopleService } from '../sw-people.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-ola-faves',
  imports: [AsyncPipe],
  templateUrl: './ola-faves.html',
  styleUrl: './ola-faves.css',
})
export class OlaFaves {
  // private readonly peopleSvc = inject(SwPeopelService);
  private readonly peopleSvc = inject(SwPeopleService);

  protected readonly people$ = this.peopleSvc.getPeopleFromSwapiApi();
}
