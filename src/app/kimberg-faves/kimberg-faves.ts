import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { SwPeopleService } from '../sw-people.service';
import { firstValueFrom } from 'rxjs';


type FaveDisplay = {
  name: string;
  checked: boolean;
  heightInCentimeters: number;
  invalidHeight: boolean;
  skinColor: string;
};

@Component({
  selector: 'app-kimberg-faves',
  imports: [],
  templateUrl: './kimberg-faves.html',
  styleUrl: './kimberg-faves.css',
})
export class KimbergFaves implements OnInit {

  //
  // DI - dependency injection...
  //
  private peopleSvc = inject(SwPeopleService);

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
        : "No faves selected"
      ;

    }
  );

  protected faveSkinColorCounts = computed(
  () => {
      const faves = this.people().filter(x => x.checked);
      if (faves.length === 0) return "No faves selected";
      
      const counts = faves.reduce((acc, p) => {

      const colors = p.skinColor.split(",").map(x => x.trim());

      colors.forEach(color => {
        acc[color] = (acc[color] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const sortedEntries = Object.entries(counts)
      .sort((a, b) => b[1] - a[1]);

    const entries = sortedEntries
      .map(([color, count]) => `${color}: ${count}`)
      .join(", ");
      
    return `Skin Colors Among Faves Selected: ${sortedEntries.length} (${entries})`;
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
          skinColor: x.skin_color
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
