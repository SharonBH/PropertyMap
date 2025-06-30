import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Building2, 
  Shield, 
  Settings,
  TrendingUp,
  Activity
} from 'lucide-react';
import { 
  getUsersListEndpoint,
  getRolesEndpoint,
  searchAgenciesEndpoint,
  getTenantsEndpoint
} from '@/api/homemapapi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    roles: 0,
    agencies: 0,
    tenants: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {        const [usersRes, rolesRes, agenciesRes, tenantsRes] = await Promise.allSettled([
          getUsersListEndpoint(),
          getRolesEndpoint(),
          searchAgenciesEndpoint({ pageNumber: 1, pageSize: 1 }, '1'),
          getTenantsEndpoint(),
        ]);

        setStats({
          users: usersRes.status === 'fulfilled' ? usersRes.value.length : 0,
          roles: rolesRes.status === 'fulfilled' ? rolesRes.value.length : 0,
          agencies: agenciesRes.status === 'fulfilled' ? agenciesRes.value.totalCount || 0 : 0,
          tenants: tenantsRes.status === 'fulfilled' ? tenantsRes.value.length || 0 : 0,
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);
  const statCards = [
    {
      title: 'סה״כ משתמשים',
      value: stats.users,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'תפקידים',
      value: stats.roles,
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'סוכנויות',
      value: stats.agencies,
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'דיירים',
      value: stats.tenants,
      icon: Settings,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">        {/* Welcome Section */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">ברוכים הבאים ללוח הבקרה</h2>
          <p className="text-gray-600">נהלו משתמשים, תפקידים, דיירים והגדרות מערכת מכאן.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-md ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.loading ? '...' : stat.value.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                פעילות אחרונה
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>מערכת הופעלה</span>
                  <span>היום</span>
                </div>
                <div className="flex justify-between">
                  <span>גישה ללוח הניהול</span>
                  <span>כעת</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                בריאות המערכת
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">בסיס נתונים</span>
                  <span className="text-sm font-medium text-green-600">מקוון</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">סטטוס API</span>
                  <span className="text-sm font-medium text-green-600">תקין</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">אימות משתמשים</span>
                  <span className="text-sm font-medium text-green-600">פעיל</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
