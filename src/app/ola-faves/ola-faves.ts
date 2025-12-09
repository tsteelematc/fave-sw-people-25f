import { Component, computed, inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';
// import { SwPeopelService } from '../sw-peopel.service';
import { SwPeopleService } from '../sw-people.service';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';

type FaveDisplay = {
  name: string;
  checked: boolean;
  heightInCentimeters: number;
  invalidHeight: boolean;
}

@Component({
  selector: 'app-ola-faves',
  imports: [FormsModule],
  templateUrl: './ola-faves.html',
  styleUrl: './ola-faves.css',
})
export class OlaFaves implements OnInit {
  // private readonly peopleSvc = inject(SwPeopelService);
  private peopleSvc = inject(SwPeopleService);

  protected people: WritableSignal<FaveDisplay[]> = signal([]); 

  protected faveCount = computed(
    () => this.people().filter( x => x.checked ).length
  );

  protected avgFaveHeight = computed(
    () => {
      const favesWithHeightInfo = this.people().filter(x => x.checked && !x.invalidHeight);
      const sumHeight = favesWithHeightInfo.reduce(
        (acc, x) => acc + x.heightInCentimeters 
        , 0
      );

      // return sumHeight / favesWithHeightInfo.length;

      return favesWithHeightInfo.length > 0
        ? `${(sumHeight / favesWithHeightInfo.length).toFixed(2)}cm 
            ${this.faveCount() != favesWithHeightInfo.length 
              ? " **some faves have missing height information" 
              : "No Faves Selected"}`
        : "N/A"
      ;
    }
  );
  
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

  protected readonly toggleChecked = (personToggle: FaveDisplay) => {
    this.people.update(
      previousPeople => previousPeople.map(
        person => ({
          ...person,
          checked: person.name === personToggle.name 
            ? !person.checked 
            : person.checked
        })
      )
    );
  };

  protected who ="";


  protected readonly postToMsTeams = async () => {
    try {
      const commaDelimitedFaves = this.people()
        .filter(
          x => x.checked
        )
        .map(
          x => x.name
        )
        .join(',')
        ;
        await this.peopleSvc.postFavesAndFunFactToMsTeams(
        {
          name: this.who,
          faves: commaDelimitedFaves,
          "fun-fact": this.avgFaveHeight(),
        }
      )
    }
    catch (err) {
      console.warn(err);
    }
  };


  protected promisesAsThenables(){
    console.log("Promise Return Begins here ")

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

  protected async promisesWithAsynAwait(){
    try {
      const page1 = await this.peopleSvc.getPeoplePageOne();
      console.log(page1);

      const page2 = await this.peopleSvc.getPeoplePageOne();
      console.log(page2);
    }
    catch (err) {
      console.warn(
        "catch blak:", 
        err );
    }
  }

  protected async promisesFun(){
      try {
      const page1 = this.peopleSvc.getPeoplePageOne();
      // console.log(page1);

      const page2 = this.peopleSvc.getPeoplePageOne();
      // console.log(page2);
      
      
      // const data = await Promise.race(
      // const data = await Promise.any(
      const data = await Promise.all(
        [
          page1
          , page2
        ]
      );
      console.log(
        data[0].name
      );
    }
    catch (err) {
      console.warn(
        "catch blak:", 
        err );
    }
  }
}
