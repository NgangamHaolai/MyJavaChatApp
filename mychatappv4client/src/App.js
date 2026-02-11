import { BrowserRouter, Route, Routes } from 'react-router';
import LoginPage from "./Pages/LoginPage.js";
import Users from 'Pages/Users.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage/>}></Route>
        <Route path='/users' element={<Users/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;