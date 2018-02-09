import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { Product } from '../../shared/services';
import { getProductData, State } from '../store';
import { LoadCategories, LoadProducts, LoadProductsByCategory } from '../store/actions';
import { getCategoryData } from '../store/reducers';


@Component({
  selector: 'nga-categories',
  styleUrls: [ './categories.component.scss' ],
  templateUrl: './categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent implements OnDestroy {
  readonly categories$: Observable<string[]>;
  readonly products$: Observable<Product[]>;
  private readonly productsSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>
  ) {
    this.products$ = this.store.pipe(select(getProductData));
    this.categories$ = this.store.pipe(
      select(getCategoryData),
      map(categories => [ 'all', ...categories ])
    );

    this.productsSubscription = this.route.params.subscribe(
      ({ category }) => this.getCategory(category)
    );

    this.store.dispatch(new LoadCategories());
  }

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
  }

  private getCategory(category: string): void {
    return category.toLowerCase() === 'all'
      ? this.store.dispatch(new LoadProducts())
      : this.store.dispatch(new LoadProductsByCategory({ category: category.toLowerCase() }));
  }
}
