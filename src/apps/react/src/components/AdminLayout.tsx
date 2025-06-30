import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { 
  Users, 
  Building2, 
  Shield, 
  Settings, 
  LayoutDashboard,
  ChevronRight 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const menuItems = [
    {
      title: 'לוח בקרה',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: 'משתמשים',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'תפקידים',
      href: '/admin/roles',
      icon: Shield,
    },
    {
      title: 'דיירים',
      href: '/admin/tenants',
      icon: Building2,
    },
    {
      title: 'סוכנויות',
      href: '/admin/agencies',
      icon: Building2,
    },
    {
      title: 'רשימות מערכת',
      href: '/admin/lookups',
      icon: Settings,
    },
  ];

  const isActiveRoute = (href: string, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };
  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => 
      item.exact ? location.pathname === item.href : location.pathname.startsWith(item.href)
    );
    return currentItem?.title || 'ניהול';
  };
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];
    
    breadcrumbs.push({ title: 'ניהול', href: '/admin' });
    
    if (pathSegments.length > 1) {
      const currentItem = menuItems.find(item => 
        location.pathname.startsWith(item.href)
      );
      if (currentItem && currentItem.href !== '/admin') {
        breadcrumbs.push({ title: currentItem.title, href: currentItem.href });
      }
    }

    return breadcrumbs;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        {/* Sidebar */}        <div className="w-64 bg-white shadow-sm border-r min-h-screen">
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-900 mb-6">לוח ניהול</h1>
            
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href, item.exact);
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Breadcrumbs and Page Header */}
          <div className="bg-white border-b">
            <div className="px-6 py-4">
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                {getBreadcrumbs().map((breadcrumb, index) => (
                  <div key={breadcrumb.href} className="flex items-center">
                    {index > 0 && <ChevronRight className="w-4 h-4 mx-2" />}
                    <Link
                      to={breadcrumb.href}
                      className={`hover:text-gray-700 ${
                        index === getBreadcrumbs().length - 1 ? 'text-gray-900 font-medium' : ''
                      }`}
                    >
                      {breadcrumb.title}
                    </Link>
                  </div>
                ))}
              </nav>
              <h1 className="text-2xl font-bold text-gray-900">{getCurrentPageTitle()}</h1>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
