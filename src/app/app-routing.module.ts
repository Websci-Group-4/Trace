import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from "./homepage/homepage.component";
import { AboutComponent } from "./about/about.component";
import { ImageComponent } from "./image/image.component";
import { ProfileComponent } from "./profile/profile.component";
import { UploadComponent } from "./upload/upload.component";
import { SigninComponent } from './signin/signin.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
	 {path: 'home', component: HomepageComponent},
	 {path: 'about', component: AboutComponent},
	 {path: 'image', component: ImageComponent},
	 {path: 'profile', component: ProfileComponent},
	 {path: 'upload', component: UploadComponent},
	 {path: 'signin', component: SigninComponent},
	 {path: 'register', component: RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
