import { Routes } from '@angular/router';
import {AuthComponent} from "./features/auth/pages/auth.component"
import { HomeComponent } from './features/home/home.component';
import { AboutComponent } from './features/about/about.component';
import { ContactComponent } from './features/contact/contact.component';
import { HrmsComponent } from './features/hrms/pages/hrms.component';
export const routes: Routes = [
    { path:"login", component:AuthComponent},
    {path:"", component: HomeComponent},
    {path:"contact", component:ContactComponent},
    {path:"about", component:AboutComponent},
    {path:"hrms", component:HrmsComponent}
];

