import { Component } from '@angular/core';

import { ProfilePage } from '../profile/profile';
import { SearchPage } from '../search/search';
import { ListPage } from '../list/list';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = SearchPage;
  tab2Root: any = ListPage;
  tab3Root: any = ProfilePage;

  constructor() {

  }
}
