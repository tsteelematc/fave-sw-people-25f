import { Component, inject } from '@angular/core';
import { SwPeopleService } from '../sw-people.service';

@Component({
  selector: 'app-akoroliova-fave-sw-people',
  imports: [],
  templateUrl: './akoroliova-fave-sw-people.html',
  styleUrl: './akoroliova-fave-sw-people.css',
})
export class AkoroliovaFaveSwPeople {
  private readonly peopleSvc = inject(SwPeopleService);

  protected promisesAsThenables() {

    const page1 = this.peopleSvc.getPeoplePageOne().then(
        data => {
        console.log(data);
        const page2 = this.peopleSvc.getPeoplePageTwo().then(
          data => console.log(data)
        )
        .catch(
          err => console.warn(err)
        )
      }
    )
    .catch(
      err => console.warn(err)
    );
  }
}
