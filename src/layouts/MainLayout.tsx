import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from './Footer';
import { Outlet } from "react-router-dom";



export const MainLayout = () => {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer/>
        </>
    )
}