import { Routes } from '@angular/router';
import {CsmithFaves} from './csmith-faves/csmith-faves';
import { AspriggsFavs } from './aspriggs-favs/aspriggs-favs';
import { BfunmakerFaves } from './bfunmaker-faves/bfunmaker-faves';

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
    path : "bfunmaker", 
        component : BfunmakerFaves 
    }
];