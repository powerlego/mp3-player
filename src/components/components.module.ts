import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainWindowComponent } from './main-window/main-window.component';
import { MediaControlsComponent } from './media-controls/media-controls.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopBarComponent } from './top-bar/top-bar.component';



@NgModule({
  declarations: [
    MainWindowComponent,
    MediaControlsComponent,
    SidebarComponent,
    TopBarComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MainWindowComponent,
    MediaControlsComponent,
    SidebarComponent,
  ]
})
export class ComponentsModule { }
