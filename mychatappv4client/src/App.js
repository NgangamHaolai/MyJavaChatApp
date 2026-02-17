import { BrowserRouter, Route, Routes } from 'react-router';
import LoginPage from "./Pages/LoginPage.js";
import Users from 'Pages/Users.js';
import RegisterPage from 'Pages/RegisterPage.js';
import AvatarPage from 'Pages/AvatarPage.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage/>}></Route>
        <Route path='/users' element={<Users/>}></Route>
        <Route path='/register' element={<RegisterPage/>}></Route>
        <Route path="/avatar" element={<AvatarPage/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;