import React from 'react';
import { Routes, Route } from 'react-router-dom'
import { Home } from '../pages/Home.tsx';
import { Login } from '../pages/Login.tsx';
import { Register } from '../pages/Register.tsx';
import { NotFound } from '../pages/NotFound.tsx';
import { MainLayout } from "../layouts/MainLayout";

export const Routing = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='*' element={<NotFound />} />
            </Route>
        </Routes>
    )
}