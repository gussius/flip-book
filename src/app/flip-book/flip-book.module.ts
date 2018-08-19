import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlipBookComponent } from './flip-book.component';
import { NgTextflowModule } from 'ng-textflow';

@NgModule({
  imports: [
    CommonModule,
    NgTextflowModule.forRoot()
  ],
  declarations: [
    FlipBookComponent
  ],
  exports: [
    FlipBookComponent
  ]
})
export class FlipBookModule { }
