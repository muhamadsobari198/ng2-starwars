/**
 * Created by irfan.maulana on 1/8/2017.
 */
import { Injectable }     from '@angular/core'
import { Http, Response} from '@angular/http'
import { Film }    from './Film'
import {Observable} from 'rxjs/Rx'

// Import RxJs required methods
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

import { UrlCollection } from '../Helpers/UrlCollection'
import { ObjectConverter } from '../Helpers/ObjectConverter'

@Injectable()
export class FilmService {
  // Resolve HTTP using the constructor
  constructor (
    private http: Http,
  ) {}

  // public variable to expose
  public PAGESIZE: number = 10
  public totalPage: number = 0
  public count: number = 0
  public currentPage: number = 1
  public isNextable: boolean = false
  public isPrevable: boolean = false

  getFilms() : Observable<Film[]> {

    let thisService = this
    let objectConverter = new ObjectConverter()

    function mapFilmResponse(response:Response): Film[]{
      thisService.currentPage = 1
      thisService.count = response.json().count
      thisService.isNextable = response.json().next !== null
      thisService.isPrevable = response.json().previous !== null

      if(thisService.count > thisService.PAGESIZE){
        thisService.totalPage = Math.ceil(thisService.count / thisService.PAGESIZE)
      }else{
        thisService.totalPage = 0
      }


      // The response of the API has a results
      // property with the actual results
      return response.json().results.map(objectConverter.convertResponseToFilm)
    }

    // ...using get request
    return this.http.get(UrlCollection.FILM)
      // ...and calling .json() on the response to return data
      .map(mapFilmResponse)
      //...errors if any
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'))

  }

}
