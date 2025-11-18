import { Component, inject } from '@angular/core';
import { SwPeopleService } from '../sw-people-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-aspriggs-favs',
  imports: [AsyncPipe],
  templateUrl: './aspriggs-favs.html',
  styleUrl: './aspriggs-favs.css',
})
export class AspriggsFavs {
  private readonly peopleSvc = inject(SwPeopleService);

  protected readonly people$ = this.peopleSvc.getPeopleFromSwapiApi();
}
