import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { SwPeopleService } from '../sw-people.service';
import { AsyncPipe } from '@angular/common';
import { ConstantPool } from '@angular/compiler';
import { firstValueFrom, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

type FaveDisplay = {
  name: string;
  checked: boolean;
  heightInCentimeters: number;
  invalidHeight: boolean;
  hairColor: string;
};

@Component({
  selector: 'app-yyang22-faves',
  imports: [FormsModule],
  templateUrl: './yyang22-faves.html',
  styleUrl: './yyang22-faves.css',
})

export class Yyang22Faves implements OnInit {

  //
  // DI - dependency injection...
  //
  private readonly peopleSvc = inject(SwPeopleService);

  //
  //  Signals...
  //
  protected people: WritableSignal<FaveDisplay[]> = signal([]); // = this.peopleSvc.getPeopleFromSwapiApi();

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
      const sumOfFaveHeightInCentimeters = faves.reduce(
        (acc, favePerson) => acc + favePerson.heightInCentimeters,
        0, 

      );

      // Return their avg height
      return this.faveCount() > 0 
        ? faves.length > 0
          ? `Avg Height ${(sumOfFaveHeightInCentimeters / faves.length).toFixed(2)} cm ${this.faveCount() != faves.length ? '**some faves are missing height info': ''}`
          : '** All Selected Faves Missing Height Info'
        : "No Faves Selected"
        
      ;
    }
  );

  protected brownHairRatio = computed(
    () => {     

      // Get selected faves
      const faves = this.people().filter(
        person => person.checked
      );

      // Count person with brown hair
      const brownHaircount = faves.filter(
        person => person.hairColor === 'brown'
        )
        .reduce(
          count => count + 1, 0
        );

      // Count person with Not brown hair
      const notBrownHaircount = faves.filter(
        person => person.hairColor !== 'brown' 
        )
        .reduce(
          count => count + 1, 0
        );

      // Make a ratio of n/a
      const countNA = faves.filter(
        person => person.hairColor === 'n/a' 
        )
        .reduce(
          count => count + 1, 0
        );


      
      // Return the ratio of males and females
      return `Brown: ${brownHaircount} Not Brown: ${notBrownHaircount}` + 
              (countNA > 0 ? `  Hair Color is n/a : ${countNA}` : '')
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
          hairColor: x.hair_color,
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

  protected readonly postToMsTeams = async() => {
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
  }

  protected promiseAsThenables() {

    const page1 = this.peopleSvc.getPeoplePageOne() 
      .then(
        data => {
          console.log(data);

          const page2 = this.peopleSvc.getPeoplePageTwo()
          .then(
            data => console.log(data)
          )
          .catch(
            err => console.warn(err)
          )
        }
      )
      .catch(
        err => console.warn(err)
      )
    ;

  }

  protected async promiseWithAsyncAwait() {

    try {
      const page1 = await this.peopleSvc.getPeoplePageOne();
      console.log(page1); // ? ? ?

      const page2 = await this.peopleSvc.getPeoplePageTwo();
      console.log(page2); // ? ? ? 
    }
    catch (err) {
      console.warn("catch block", err);
    }
  }

  protected async promisesFun() {

    try {
      const page1 = this.peopleSvc.getPeoplePageOne();
      //console.log(page1); // ? ? ?

      const page2 = this.peopleSvc.getPeoplePageTwo();
      //console.log(page2); // ? ? ? 

      const data = await Promise.all(
      // const data = await Promise.any(
      //const data = await Promise.race(
        [
          page1
          , page2
        ]
      );
      console.log(data[0].name);
    }
    catch (err) {
      console.warn("catch block", err);
    }
  }

}
