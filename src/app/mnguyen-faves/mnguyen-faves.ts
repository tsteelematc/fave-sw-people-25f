import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { SwPeopleService } from '../sw-people.service';
import { firstValueFrom, Observable } from 'rxjs';

type FaveDisplay = 
{
  name: string;
  checked: boolean;
  heightInCentimeters: number;
};

@Component({
  selector: 'app-mnguyen-faves',
  imports: [],
  templateUrl: './mnguyen-faves.html',
  styleUrl: './mnguyen-faves.css',
})
export class MnguyenFaves implements OnInit {
  private readonly peopleSvc = inject(SwPeopleService);

  protected people: WritableSignal<FaveDisplay[]> = signal([]);

async ngOnInit() 
{
  const people = await firstValueFrom(this.peopleSvc.getPeopleFromSwapiApi());
  this.people.set(people.map(x => ({
    name: x.name,
    checked: false,
    heightInCentimeters: Number(x.height),
  })));
}

  protected promisesAsThenables()
  {
    const page1 = this.peopleSvc.getPeoplePageOne().then(data => {console.log(data);
    const page2 = this.peopleSvc.getPeoplePageTwo().then(data => console.log(data)).catch(err => console.warn(err))
    }).catch( err => console.warn(err));
  }

  protected async promisesWithAsyncAwait()
  {
    try 
    {
      const page1 = await this.peopleSvc.getPeoplePageOne();
      console.log(page1);
      const page2 = await this.peopleSvc.getPeoplePageTwo();
      console.log(page2);
    }
    catch (err) 
    {
      console.warn(err);
    }
  }

  protected async promisesFun()
  {
    try 
    {
      const page1 = this.peopleSvc.getPeoplePageOne();
      console.log(page1);
      const page2 = this.peopleSvc.getPeoplePageTwo();
      console.log(page2);
      const data = await Promise.all([page1, page2]);
      //const data = await Promise.any([page1, page2]);
      console.log(data);
    }
    catch (err) 
    {
      console.warn(err);
    }
  }
}