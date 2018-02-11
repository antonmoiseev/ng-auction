import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';

import { Product, ProductService } from '../../../shared/services';
import {
  LoadProductsByCategory,
  LoadProductsFailure,
  LoadProductsSuccess,
  ProductActionTypes,
  SearchProducts
} from '../actions';


@Injectable()
export class ProductEffects {
  @Effect()
  loadProducts$: Observable<Action> = this.actions$
    .pipe(
      ofType(ProductActionTypes.Load),
      switchMap(() => this.productService.getAll()),
      handleLoadedProducts()
    );

  @Effect()
  loadByCategory$: Observable<Action> = this.actions$
    .pipe(
      ofType<LoadProductsByCategory>(ProductActionTypes.LoadProductsByCategory),
      map(action => action.payload.category),
      switchMap(category => this.productService.getByCategory(category)),
      handleLoadedProducts()
    );

  @Effect()
  searchProducts: Observable<Action> = this.actions$
    .pipe(
      ofType(ProductActionTypes.Search),
      map((action: SearchProducts) => action.payload.params),
      switchMap(params => this.productService.search(params)),
      handleLoadedProducts()
    );

  constructor(
    private readonly actions$: Actions,
    private readonly productService: ProductService
  ) {
  }
}

const handleLoadedProducts = () =>
  (source: Observable<Product[]>) => source.pipe(
    map(products => new LoadProductsSuccess({ products })),
    catchError(error => of(new LoadProductsFailure({ error })))
  );
