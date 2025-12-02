import { Component, inject, OnInit } from '@angular/core';
import { SwPeopleService } from '../sw-people.service';
import { AsyncPipe } from '@angular/common';
import { ConstantPool } from '@angular/compiler';
import { Observable } from 'rxjs';

type FaveDisplay = {
  name: string;
  checked: boolean;
  heightInCentimeters: number;
};

@Component({
  selector: 'app-yyang22-faves',
  imports: [AsyncPipe],
  templateUrl: './yyang22-faves.html',
  styleUrl: './yyang22-faves.css',
})

export class Yyang22Faves implements OnInit {
  private readonly peopleSvc = inject(SwPeopleService);

  protected people$: Observable<any[]> | undefined; // = this.peopleSvc.getPeopleFromSwapiApi();


  ngOnInit(): void {
    this.people$ = this.peopleSvc.getPeopleFromSwapiApi();
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
