import { Routes } from '@angular/router';
import {CsmithFaves} from './csmith-faves/csmith-faves';
import { AspriggsFavs } from './aspriggs-favs/aspriggs-favs';
import { Yyang22Faves } from './yyang22-faves/yyang22-faves';
import { BfunmakerFaves } from './bfunmaker-faves/bfunmaker-faves';
import { AkoroliovaFaveSwPeople } from './akoroliova-fave-sw-people/akoroliova-fave-sw-people';

export const routes: Routes = [
  {
    path: 'csmith',
    component: CsmithFaves
  },
	{
    path: "aspriggs",
    component: AspriggsFavs
  },
  { 
    path: "yyang22"
    , component: Yyang22Faves    
  },
  {
    path : "bfunmaker", 
    component : BfunmakerFaves 
  },
  {
    path: "akoroliova", 
    component: AkoroliovaFaveSwPeople
  }
];
