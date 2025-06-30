import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, User } from 'lucide-react';
import { 
  getUserEndpoint, 
  updateUserEndpoint, 
  UpdateUserCommand, 
  UserDetail 
} from '@/api/homemapapi';
import { useToast } from '@/hooks/use-toast';

const EditUserPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserDetail | null>(null);
  const [formData, setFormData] = useState<UpdateUserCommand>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    deleteCurrentImage: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchUser = async () => {
    if (!userId) {
      toast({
        title: 'Error',
        description: 'User ID is required',
        variant: 'destructive',
      });
      navigate('/admin/users');
      return;
    }

    try {
      setLoading(true);
      const userData = await getUserEndpoint(userId);
      setUser(userData);
      setFormData({
        id: userData.id || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        deleteCurrentImage: false,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch user details',
        variant: 'destructive',
      });
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phoneNumber && !/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof UpdateUserCommand, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }    try {
      setSaving(true);
      await updateUserEndpoint(formData);
      
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });

      navigate('/admin/users');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading user details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <p className="text-gray-500">User not found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/users')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
          <div className="flex-1">
            <h2 className="text-lg font-medium text-gray-900">Edit User</h2>
            <p className="text-gray-600">Update user account information</p>
          </div>
        </div>

        {/* User Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>User Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Username</Label>
                <p className="text-sm font-mono bg-gray-50 px-2 py-1 rounded">
                  {user.userName}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Account Status</Label>
                <div className="mt-1">
                  <Badge variant={user.isActive ? 'default' : 'secondary'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Email Status</Label>
                <div className="mt-1">
                  <Badge variant={user.emailConfirmed ? 'default' : 'outline'}>
                    {user.emailConfirmed ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={errors.firstName ? 'border-red-500' : ''}
                    disabled={saving}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={errors.lastName ? 'border-red-500' : ''}
                    disabled={saving}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                    disabled={saving}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber || ''}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className={errors.phoneNumber ? 'border-red-500' : ''}
                    disabled={saving}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-500">{errors.phoneNumber}</p>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/users')}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default EditUserPage;
