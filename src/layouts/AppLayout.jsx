import { Outlet } from 'react-router-dom'
import AppSidebar from '../components/layout/AppSidebar.jsx'
import AppNavbar from '../components/layout/AppNavbar.jsx'
import MobileBottomBar from '../components/layout/MobileBottomBar.jsx'
import DemoBanner from '../components/layout/DemoBanner.jsx'

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-fg">
      <DemoBanner />
      <div className="flex-1 flex">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AppNavbar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12 animate-fade-in">
            <Outlet />
          </main>
          <MobileBottomBar />
        </div>
      </div>
    </div>
  )
}
