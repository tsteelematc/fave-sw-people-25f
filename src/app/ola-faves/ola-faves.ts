import { Component, inject } from '@angular/core';
// import { SwPeopelService } from '../sw-peopel.service';
import { SwPeopleService } from '../sw-people.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-ola-faves',
  imports: [AsyncPipe],
  templateUrl: './ola-faves.html',
  styleUrl: './ola-faves.css',
})
export class OlaFaves {
  // private readonly peopleSvc = inject(SwPeopelService);
  private readonly peopleSvc = inject(SwPeopleService);

  protected readonly people$ = this.peopleSvc.getPeopleFromSwapiApi();

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
