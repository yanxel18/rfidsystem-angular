import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CNotFoundComponent } from 'src/components/c-404/c-notfound';
import { CViewBoardComponent } from 'src/components/c-view-board/c-view-board.component';
import { CAttendanceBoardComponent } from 'src/components/c-attendance-board/c-attendance-board.component';
import { CKetsuboardComponent } from 'src/components/c-ketsuboard/c-ketsuboard.component';
const routes: Routes = [
  { path: 'boardview', component: CViewBoardComponent },
  { path: 'main', component: CAttendanceBoardComponent },
  { path: 'absent', component: CKetsuboardComponent },
  { path: '', redirectTo: 'boardview', pathMatch: 'full' },
  { path: '**', component: CNotFoundComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
