import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CNotFoundComponent } from 'src/components/c-404/c-notfound';
import { CMainDashboardComponent } from 'src/components/c-main-dashboard/c-main-dashboard.component';
import { CViewBoardComponent } from 'src/components/c-view-board/c-view-board.component';
const routes: Routes = [
  { path: 'boardview', component: CViewBoardComponent },
  { path: 'main', component: CMainDashboardComponent },
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: '**', component: CNotFoundComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
