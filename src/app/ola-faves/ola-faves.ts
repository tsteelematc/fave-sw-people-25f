import { Component, inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';
// import { SwPeopelService } from '../sw-peopel.service';
import { SwPeopleService } from '../sw-people.service';
import { firstValueFrom } from 'rxjs';

type FaveDisplay = {
  name: string;
  checked: boolean;
  heightInCentimeters: number;
}

@Component({
  selector: 'app-ola-faves',
  imports: [],
  templateUrl: './ola-faves.html',
  styleUrl: './ola-faves.css',
})
export class OlaFaves implements OnInit {
  // private readonly peopleSvc = inject(SwPeopelService);
  private peopleSvc = inject(SwPeopleService);

  protected people: WritableSignal<FaveDisplay[]> = signal([]); 

  async ngOnInit() {
    const people = await firstValueFrom( 
    this.peopleSvc.getPeopleFromSwapiApi()
    );

    this.people.set(
      people.map(
        p => ({
          name: p.name,
          checked: false,
          heightInCentimeters: Number(p.height)
        } as FaveDisplay)
      )
    );
  }  

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
