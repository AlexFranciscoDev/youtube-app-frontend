import { Routes, Route } from 'react-router-dom'
import { Home } from '../pages/Home.tsx';
import { Login } from '../pages/Login.tsx';
import { Register } from '../pages/Register.tsx';
import { NotFound } from '../pages/NotFound.tsx';
import { MainLayout } from "../layouts/MainLayout";
import { Upload } from '../pages/Upload.tsx';
import { Profile } from "../pages/Profile.tsx";
import { VideoDetail } from "../pages/VideoDetail.tsx";
import ProtectedRoute from '../helpers/ProtectedRoute';
import { Categories } from '../pages/Categories.tsx';
import { NewCategory } from '../pages/NewCategory.tsx';

export const Routing = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route element={<ProtectedRoute />}>
                    <Route index element={<Home />} />
                    <Route path='/upload' element={<Upload />} />
                    <Route path="/profile/:id" element={<Profile/>}></Route>
                    <Route path="/video/:id" element={<VideoDetail/>}></Route>
                    <Route path="/category/" element={<Categories/>}></Route>
                    <Route path="/category/new" element={<NewCategory/>}></Route>
                </Route>
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='*' element={<NotFound />} />
            </Route>
        </Routes>
    )
}
