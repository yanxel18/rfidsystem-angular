import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CViewBoardComponent } from 'src/components/c-view-board/c-view-board.component';
const routes: Routes = [
  { path: '', redirectTo: 'boardview', pathMatch: 'full' },
  { path: 'boardview', component: CViewBoardComponent},
 

];
@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
