import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'folder/Inbox',
  //   pathMatch: 'full'
  // },
  // {
  //   path: 'folder/:id',
  //   loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  // },
  {
    path: '',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'tests',
    loadChildren: () => import('./tests/tests.module').then( m => m.TestsPageModule)
  },
  {
    path: 'questions',
    loadChildren: () => import('./questions/questions.module').then( m => m.QuestionsPageModule)
  },
  {
    path: 'my-profile',
    loadChildren: () => import('./my-profile/my-profile.module').then( m => m.MyProfilePageModule)
  },
  {
    path: 'create-test',
    loadChildren: () => import('./create-test/create-test.module').then( m => m.CreateTestPageModule)
  },
  {
    path: 'upload-questions',
    loadChildren: () => import('./upload-questions/upload-questions.module').then( m => m.UploadQuestionsPageModule)
  },
  {
    path: 'institution-details',
    loadChildren: () => import('./institution-details/institution-details.module').then( m => m.InstitutionDetailsPageModule)
  },
  {
    path: 'class-section',
    loadChildren: () => import('./class-section/class-section.module').then( m => m.ClassSectionPageModule)
  },
  {
    path: 'subject',
    loadChildren: () => import('./subject/subject.module').then( m => m.SubjectPageModule)
  },
  {
    path: 'add-class-section',
    loadChildren: () => import('./add-class-section/add-class-section.module').then( m => m.AddClassSectionPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
