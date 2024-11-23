//import logo from './logo.svg';
import './App.css';
//import SearchBar from './components/searchbar'
//import Category from './category.json'
import Home from "./pages/home"
import SignIn from "./pages/signin"
import Login from './pages/login';
import FrontPg from "./pages/main";
import CategoryPg from "./pages/category_page"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
function App() {
  return (
    
   <BrowserRouter>
    <Routes>
    <Route path="/" element={<Home/>}></Route>
    <Route path='/login' element={<Login/>}></Route>
    <Route path="/signin" element={<SignIn/>}></Route>
    <Route path="/front_pg" element={<FrontPg/>}></Route>
    <Route path="/:categoryName" element={<CategoryPg/>}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;