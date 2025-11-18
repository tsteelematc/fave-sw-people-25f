import { Routes } from '@angular/router';
import {CsmithFaves} from './csmith-faves/csmith-faves';
import { AspriggsFavs } from './aspriggs-favs/aspriggs-favs';
import { KimbergFaves } from './kimberg-faves/kimberg-faves';
import { Yyang22Faves } from './yyang22-faves/yyang22-faves';
import { BfunmakerFaves } from './bfunmaker-faves/bfunmaker-faves';
import { AkoroliovaFaveSwPeople } from './akoroliova-fave-sw-people/akoroliova-fave-sw-people';
import { MnguyenFaves } from './mnguyen-faves/mnguyen-faves';
import { TsteeleFaves } from './tsteele-faves/tsteele-faves';

export const routes: Routes = [
  {
    path: 'csmith',
    component: CsmithFaves
  }
	, {
    path: "aspriggs",
    component: AspriggsFavs
  },
  {
    path: 'kimberg',
    component: KimbergFaves
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
  },
  {
    path: "mnguyen", 
    component: MnguyenFaves
  },
  {
    path: "tsteele", 
    component: TsteeleFaves
  },
];
