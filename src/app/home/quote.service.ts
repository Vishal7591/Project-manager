import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const routes = {
  quote: (c: RandomQuoteContext) => `/jokes/random?category=${c.category}`,
};

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  private _jsonURL = 'http://localhost:4200/assets/testData.json';
  private dataKey = 'dataKey';

  constructor(private httpClient: HttpClient) {
    const getData = this.getJSONFromLocalStorage();

    this.getJSONFromAPI().subscribe((data) => {
      localStorage.setItem(this.dataKey, JSON.stringify(data));
    });
  }

  public getJSONFromAPI(): Observable<any> {
    const dataFromAPIResponse = this.httpClient.get(this._jsonURL);
    return dataFromAPIResponse;
  }

  public getJSONFromLocalStorage() {
    const dataFromLocalStorage = JSON.parse(JSON.stringify(localStorage.getItem(this.dataKey)));
    return dataFromLocalStorage;
  }

  getRandomQuote(context: RandomQuoteContext): Observable<string> {
    return this.httpClient.get(routes.quote(context)).pipe(
      map((body: any) => body.value),
      catchError(() => of('Error, could not load joke :-('))
    );
  }
}
