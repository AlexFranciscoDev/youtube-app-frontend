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

export const Routing = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route element={<ProtectedRoute />}>
                    <Route index element={<Home />} />
                    <Route path='/upload' element={<Upload />} />
                    <Route path="/profile/:id" element={<Profile/>}></Route>
                    <Route path="/video-preview" element={<VideoDetail/>}></Route>
                </Route>
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='*' element={<NotFound />} />
            </Route>
        </Routes>
    )
}
