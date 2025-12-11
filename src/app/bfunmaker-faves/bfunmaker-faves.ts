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



const brysonHeight = 177;

@Component({
  selector: 'app-bfunmaker-faves',
  imports: [FormsModule],
  templateUrl: './bfunmaker-faves.html',
  styleUrl: './bfunmaker-faves.css',
})
export class BfunmakerFaves implements OnInit {
  
  private readonly peopleSvc = inject(SwPeopleService);

  protected people: WritableSignal<FaveDisplay[]>  = signal([]);

  protected faveCount = computed(
    () => this.people().filter(x=> x.checked).length
  );

  
  protected sortHeight = computed(
    () => {

      // Get selected faves
      const faves = this.people().filter(
        person => person.checked && !person.invalidHeight
      );

      // Create Map Function to create new data set of height compared to bryson height
      const comparedHeights = 
        faves.map(
          x => (x.heightInCentimeters === brysonHeight
          ? "Same Height"
            : x.heightInCentimeters > brysonHeight
              ? "Taller"
                : "Shorter")
        )

      // Return Tick String of output 
      console.log(comparedHeights)
      return `Same Height: ${comparedHeights.filter(x => x === "Same Height").length} | Taller: ${comparedHeights.filter(x => x === "Taller").length} | Shorter ${comparedHeights.filter(x => x === "Shorter").length}`
    }
  );

  async ngOnInit() {
    const people = await firstValueFrom(this.peopleSvc.getPeopleFromSwapiApi());

    this.people.set(
      people.map(
        swapiPerson => ({
          name: swapiPerson.name,
          checked: false,
          heightInCentimeters: Number(swapiPerson.height),
          invalidHeight: Number.isNaN(Number(swapiPerson.height)),
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

  protected who = "";

  protected readonly postToMSTeams = async () => {
    try {
      const commaDelimtedFaves = this.people()
      .filter(
        x => x.checked
      )
      .map(
        x => x.name
      )
      .join(', ')

    await this.peopleSvc.postFavesAndFunFactToMsTeams(
      {
        name: this.who,
        faves: commaDelimtedFaves,
        "fun-fact": this.sortHeight()
      }
    );
    }

    catch (err) {
      console.warn(err);
    }
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
