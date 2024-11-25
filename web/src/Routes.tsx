// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route} from '@redwoodjs/router'
import UploadPage from './pages/UploadPage/UploadPage'
import LoginPage from './pages/LoginPage/LoginPage'
import ScaffoldLayout from './layouts/ScaffoldLayout/ScaffoldLayout'

const Routes = () => {
  return (
    <Router>
      <Route path="/register" page={RegisterPage} name="register" />
      <Route path="/" page={LoginPage} name="home" />
      <Route path="/upload" page={UploadPage} name="upload" />
      <Route path="/resume-upload" page={ResumeUploadPage} name="resumeUpload" />
      <Route path="/dashboard" page={DashboardPage} name="dashboard" />
      <Route path="/sign-up" page={SignUpPage} name="signUp" />
      <Set wrap={ScaffoldLayout} title="Posts" titleTo="posts" buttonLabel="New Post" buttonTo="newPost">
        <Route path="/posts/new" page={PostNewPostPage} name="newPost" />
        <Route path="/posts/{id:Int}/edit" page={PostEditPostPage} name="editPost" />
        <Route path="/posts/{id:Int}" page={PostPostPage} name="post" />
        <Route path="/posts" page={PostPostsPage} name="posts" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
