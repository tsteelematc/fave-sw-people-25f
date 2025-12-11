import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { SwPeopleService } from '../sw-people.service';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';

type FaveDisplay = {
  name: string;
  checked: boolean;
  heightInCentimeters: number;
  invalidHeight: boolean;
};

@Component({
  selector: 'app-tsteele-faves',
  imports: [FormsModule],
  templateUrl: './tsteele-faves.html',
  styleUrl: './tsteele-faves.css',
})
export class TsteeleFaves implements OnInit {

  //
  // DI - dependency injection...
  //
  private readonly peopleSvc = inject(SwPeopleService);

  //
  // Signals...
  //
  protected people: WritableSignal<FaveDisplay[]> = signal([]);

  protected faveCount = computed(
    () => this.people().filter(x => x.checked).length
  );

  protected avgFaveHeight = computed(
    () => {

      // Get selected faves
      const faves = this.people().filter(
        person => person.checked && !person.invalidHeight
      );

      // Sum their height
      const sumOfFavesHeightInCentimeters = faves.reduce(
        (acc, favePerson) => acc + favePerson.heightInCentimeters,
        0,
      );

      // Return their avg height
      return this.faveCount() > 0
        ? faves.length > 0
          ? `Avg Height ${(sumOfFavesHeightInCentimeters / faves.length).toFixed(2)} cm  ${this.faveCount() != faves.length ? '** some faves are missing height info' : ''}`
          : '** All Selected Faves Missing Height Info'
        : "No Faves Selected"
      ;

    }
  );
  
  //
  // Other methods/funcs
  //
  async ngOnInit() {
    const people = await firstValueFrom(
      this.peopleSvc.getPeopleFromSwapiApi()
    );

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

  protected who = "";

  protected readonly postToMsTeams = async () => {
    try {
      const commaDelimitedFaves = this.people()
        .filter(
          x => x.checked
        )
        .map(
          x => x.name
        )
        .join(', ')
      ;

      await this.peopleSvc.postFavesAndFunFactToMsTeams(
        {
          name: this.who,
          faves: commaDelimitedFaves,
          "fun-fact": this.avgFaveHeight(),
        }
      );

    }
    catch (err) {
      console.warn(err);
    }
  };

  protected promisesAsThenables() {
    const page1 = this.peopleSvc.getPeoplePageOne()
      .then(
        data => {
          console.log(data);

          const page2 = this.peopleSvc.getPeoplePageTwo()
            .then(
              data => console.log(data)
            )
            .catch(
              err => console.warn("inside", err)
            )
        }
      )
      .catch(
        err => console.warn("outside", err)
      )
    ;
  }

  protected async promisesWithAsyncAwait() {

    try {

      const page1 = await this.peopleSvc.getPeoplePageOne();
      console.log(page1); // ? ? ?

      const page2 = await this.peopleSvc.getPeoplePageTwo();
      console.log(page2); // ? ? ?
    }

    catch (err) {
      console.warn(
        "catch block"
        , err
      );
    }
  }

  protected async promisesFun() {

    // const await = 0;

    try {

      const page1 = this.peopleSvc.getPeoplePageOne();
      // console.log(page1); // ? ? ?

      const page2 = this.peopleSvc.getPeoplePageTwo();
      // console.log(page2); // ? ? ?

      const data = await Promise.all(
      // const data = await Promise.race(
      // const data = await Promise.any(
        [
          page1 
          , page2
        ]
      );
      console.log(
        data[0].name
      ); // ? ? ? 

    }

    catch (err) {
      console.warn(
        "catch block"
        , err
      );
    }
  }
}
