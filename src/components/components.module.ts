import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainWindowComponent } from './main-window/main-window.component';
import { MediaControlsComponent } from './media-controls/media-controls.component';
import { SidebarComponent } from './sidebar/sidebar.component';



@NgModule({
  declarations: [
    MainWindowComponent,
    MediaControlsComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MainWindowComponent
  ]
})
export class ComponentsModule { }
