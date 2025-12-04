import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { SwPeopleService } from '../sw-people.service';
import { firstValueFrom} from 'rxjs';

type FaveDisplay = {
  name: string;
  checked: boolean;
  heightInCentimeters: number;
  invalidHeight: boolean;
};

@Component({
  selector: 'app-akoroliova-fave-sw-people',
  imports: [],
  templateUrl: './akoroliova-fave-sw-people.html',
  styleUrl: './akoroliova-fave-sw-people.css',
})
export class AkoroliovaFaveSwPeople implements OnInit {
  private readonly peopleSvc = inject(SwPeopleService);
  //private readonly Promise = inject(SwPeopleService);




  protected people : WritableSignal<FaveDisplay[]> = signal([]);

  protected faveCount = computed(
    () => this.people().filter(x => x.checked).length
  );

protected averageFaveHeight = computed(() => {
  const faves = this.people().filter(
    person => person.checked && !person.invalidHeight
  );

  const sumOfFaveHeightsInCentimeters = faves.reduce(
    (acc, favePerson) => acc + favePerson.heightInCentimeters,
    0
  );

  return this.faveCount() > 0 
    ? faves.length > 0 
    ? `Average height ${(sumOfFaveHeightsInCentimeters / faves.length).toFixed(2)} cm  ${this.faveCount() != faves.length ? '** some faves are missing height info **' : ''}`
    : '**all selected faves missing height info**'
    : "No faves selected";
});

  async ngOnInit() {
    const people= await firstValueFrom (this.peopleSvc.getPeopleFromSwapiApi());
    this.people.set(
      people.map(
        x => ({
          name: x.name,
          checked: false,
          heightInCentimeters: Number(x.height),
          invalidHeight: Number.isNaN(Number(x.height)),
        })
      )
    );
  }

  protected readonly toggleChecked = (personToToggle: FaveDisplay) => this.people.update(
    previousPeople => previousPeople.map(
      person => ({
        ...person,
      checked: person.name === personToToggle.name
      ? !person.checked
      : person.checked 
    })
    )
  );

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

  protected async promisesWithAsyncAwait() {
    try {
      const page1 = await this.peopleSvc.getPeoplePageOne();

      console.log(page1);

      const page2 = await this.peopleSvc.getPeoplePageTwo();
      console.log(page2);
    }
    catch (err) {
      console.warn(err);
    }
  }

    protected async promisesFun() {
    try {
      const page1 = this.peopleSvc.getPeoplePageOne();

    //  console.log(page1);

      const page2 = this.peopleSvc.getPeoplePageTwo();
    //  console.log(page2);

      const data = await Promise.all(
        [
          page1, 
          page2
        ]
      );
      console.log(data[0].name);
    }
    catch (err) {
      console.warn(err);
    }
  }

}
