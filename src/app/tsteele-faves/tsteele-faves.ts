import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { SwPeopleService } from '../sw-people.service';
import { AsyncPipe } from '@angular/common';
import { firstValueFrom, Observable } from 'rxjs';

type FaveDisplay = {
  name: string;
  checked: boolean;
  heightInCentimeters: number;
  invalidHeight: boolean;
};

@Component({
  selector: 'app-tsteele-faves',
  imports: [AsyncPipe],
  templateUrl: './tsteele-faves.html',
  styleUrl: './tsteele-faves.css',
})
export class TsteeleFaves implements OnInit {

  private readonly peopleSvc = inject(SwPeopleService);

  protected people: WritableSignal<FaveDisplay[]> = signal([]);

  protected faveCount = computed(
    () => this.people().filter(x => x.checked).length
  );

  protected avgFaveHeight = computed(
    () => {
      const faves = this.people().filter(x => x.checked && !x.invalidHeight);
      const sumHeight = faves.reduce(
        (acc, x) => acc + x.heightInCentimeters 
        , 0
      );

      // return sumHeight / faves.length;

      return faves.length > 0
        ? (sumHeight / faves.length).toFixed(2)
        : "0"
      ;
    }
  );

  async ngOnInit() {
    const people = await firstValueFrom(this.peopleSvc.getPeopleFromSwapiApi());

    this.people.set(
      people.map(
        x => ({
          name: x.name,
          checked: false,
          heightInCentimeters: Number.parseInt(x.height),
          invalidHeight: Number.isNaN(Number.parseInt(x.height))
        })
      )
    );
  }

  protected toggleChecked(personToToggle: FaveDisplay) {
    this.people.update(currentPeople =>
      currentPeople.map(
        x => x.name === personToToggle.name
          ? { ...x, checked: !x.checked }
          : x
      )
    );
  }

  //
  // Promise learning funcs below...
  //
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
