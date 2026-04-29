import { Routes, Route } from 'react-router-dom'
import { Home } from '../pages/Home.tsx';
import { Login } from '../pages/Login.tsx';
import { Register } from '../pages/Register.tsx';
import { NotFound } from '../pages/NotFound.tsx';
import { MainLayout } from "../layouts/MainLayout";
import ProtectedRoute from '../helpers/ProtectedRoute';

export const Routing = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route element={<ProtectedRoute />}>
                    <Route index element={<Home />} />
                </Route>
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='*' element={<NotFound />} />
            </Route>
        </Routes>
    )
}
