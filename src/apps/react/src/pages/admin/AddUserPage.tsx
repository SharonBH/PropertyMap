import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';
import { registerUserEndpoint, RegisterUserCommand } from '@/api/homemapapi';
import { useToast } from '@/hooks/use-toast';

const AddUserPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterUserCommand>({
    firstName: '',
    lastName: '',
    email: '',
    userName: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'שם פרטי נדרש';
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'שם משפחה נדרש';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'אימייל נדרש';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'אנא הזן כתובת אימייל תקינה';
    }

    if (!formData.userName?.trim()) {
      newErrors.userName = 'שם משתמש נדרש';
    } else if (formData.userName.length < 3) {
      newErrors.userName = 'שם משתמש חייב להכיל לפחות 3 תווים';
    }

    if (!formData.password?.trim()) {
      newErrors.password = 'סיסמה נדרשת';
    } else if (formData.password.length < 6) {
      newErrors.password = 'סיסמה חייבת להכיל לפחות 6 תווים';
    }

    if (!formData.confirmPassword?.trim()) {
      newErrors.confirmPassword = 'אנא אמת את הסיסמה';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'הסיסמאות אינן תואמות';
    }

    if (formData.phoneNumber && !/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'אנא הזן מספר טלפון תקין';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof RegisterUserCommand, value: string) => {
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
    }

    try {
      setLoading(true);
      await registerUserEndpoint(formData);
        toast({
        title: 'הצלחה',
        description: 'המשתמש נוצר בהצלחה',
      });

      navigate('/admin/users');
    } catch (error) {
      toast({
        title: 'שגיאה',
        description: 'יצירת המשתמש נכשלה. אנא נסה שוב.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/users')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            חזור למשתמשים
          </Button>
          <div>
            <h2 className="text-lg font-medium text-gray-900">הוסף משתמש חדש</h2>
            <p className="text-gray-600">צור חשבון משתמש חדש</p>
          </div>
        </div>        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>פרטי משתמש</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    שם פרטי <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={errors.firstName ? 'border-red-500' : ''}
                    disabled={loading}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    שם משפחה <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={errors.lastName ? 'border-red-500' : ''}
                    disabled={loading}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    אימייל <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                    disabled={loading}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="userName">
                    שם משתמש <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="userName"
                    type="text"
                    value={formData.userName || ''}
                    onChange={(e) => handleInputChange('userName', e.target.value)}
                    className={errors.userName ? 'border-red-500' : ''}
                    disabled={loading}
                  />
                  {errors.userName && (
                    <p className="text-sm text-red-500">{errors.userName}</p>
                  )}
                </div>                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">מספר טלפון</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber || ''}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className={errors.phoneNumber ? 'border-red-500' : ''}
                    disabled={loading}
                    placeholder="050-123-4567"
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-500">{errors.phoneNumber}</p>
                  )}
                </div>
              </div>

              {/* Password Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">
                    סיסמה <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password || ''}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={errors.password ? 'border-red-500' : ''}
                    disabled={loading}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    אימות סיסמה <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword || ''}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                    disabled={loading}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/users')}
                  disabled={loading}
                >
                  ביטול
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      יוצר...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      צור משתמש
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

export default AddUserPage;
