import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { SwPeopleService } from '../sw-people.service';
import { firstValueFrom } from 'rxjs';

type FaveDisplay = {
  name: string;
  checked: boolean;
  heightInCentimeters: number;
}

@Component({
  selector: 'app-bfunmaker-faves',
  imports: [],
  templateUrl: './bfunmaker-faves.html',
  styleUrl: './bfunmaker-faves.css',
})
export class BfunmakerFaves implements OnInit {
  
  private readonly peopleSvc = inject(SwPeopleService);

  protected people: WritableSignal<FaveDisplay[]>  = signal([]);

  protected faveCount = computed(
    () => this.people().filter(x=> x.checked).length
  );

  async ngOnInit() {
    const people = await firstValueFrom(this.peopleSvc.getPeopleFromSwapiApi());

    this.people.set(
      people.map(
        swapiPerson => ({
          name: swapiPerson.name,
          checked: false,
          heightInCentimeters: Number(swapiPerson.height)
        })
      )
    )
  }

  protected readonly toggleChecked = (personToggled: FaveDisplay)=> {
    this.people.update(
      prevPeople => prevPeople.map(
        person => ({
          ...person,
          checked: person.name === personToggled.name
          ? !person.checked
          : person.checked
        })
      )
    );
  }

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
        data
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
