import { Outlet } from 'react-router-dom'
import PublicNavbar from '../components/layout/PublicNavbar.jsx'
import PublicFooter from '../components/layout/PublicFooter.jsx'

export default function MarketingLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-fg selection:bg-primary/20">
      <PublicNavbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <PublicFooter />
    </div>
  )
}
