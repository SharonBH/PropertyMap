import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { createTenantEndpoint, CreateTenantCommand } from '@/api/homemapapi';
import { useToast } from '@/hooks/use-toast';

const AddTenantPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTenantCommand>({
    name: '',
    connectionString: '',
    adminEmail: '',
    issuer: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'שם הדייר נדרש';
    }

    if (!formData.adminEmail?.trim()) {
      newErrors.adminEmail = 'אימייל מנהל נדרש';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
      newErrors.adminEmail = 'אנא הזן כתובת אימייל תקינה';
    }

    if (!formData.issuer?.trim()) {
      newErrors.issuer = 'מזהה המנפיק נדרש';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CreateTenantCommand, value: string) => {
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
      // Set the id to match the issuer value
      const submitData = {
        ...formData,
        id: formData.issuer
      };
      await createTenantEndpoint(submitData);
      toast({
        title: 'הצלחה',
        description: 'הדייר נוצר בהצלחה',
      });

      navigate('/admin/tenants');    } catch (error) {
      toast({
        title: 'שגיאה',
        description: 'יצירת הדייר נכשלה. אנא נסה שוב.',
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
            onClick={() => navigate('/admin/tenants')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            חזרה לדיירים
          </Button>
          <div>
            <h2 className="text-lg font-medium text-gray-900">הוסף דייר חדש</h2>
            <p className="text-gray-600">צור הגדרות דייר חדש</p>
          </div>
        </div>        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>מידע דייר</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tenant Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  שם דייר <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                  disabled={loading}
                  placeholder="הזן שם דייר"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>              {/* Admin Email */}
              <div className="space-y-2">
                <Label htmlFor="adminEmail">
                  אימייל מנהל <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={formData.adminEmail || ''}
                  onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                  className={errors.adminEmail ? 'border-red-500' : ''}
                  disabled={loading}
                  placeholder="admin@tenant.com"
                />
                {errors.adminEmail && (
                  <p className="text-sm text-red-500">{errors.adminEmail}</p>
                )}
              </div>              {/* Issuer */}
              <div className="space-y-2">
                <Label htmlFor="issuer">
                  מזהה מנפיק <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="issuer"
                  type="text"
                  value={formData.issuer || ''}
                  onChange={(e) => handleInputChange('issuer', e.target.value)}
                  className={errors.issuer ? 'border-red-500' : ''}
                  disabled={loading}
                  placeholder="הזן מזהה מנפיק"
                />
                {errors.issuer && (
                  <p className="text-sm text-red-500">{errors.issuer}</p>
                )}
              </div>              {/* Connection String */}
              <div className="space-y-2">
                <Label htmlFor="connectionString">
                  מחרוזת חיבור
                </Label>
                <Textarea
                  id="connectionString"
                  value={formData.connectionString || ''}
                  onChange={(e) => handleInputChange('connectionString', e.target.value)}
                  disabled={loading}
                  placeholder="Server=localhost;Database=tenant_db;Trusted_Connection=true;"
                  rows={3}
                />
                <p className="text-sm text-gray-500">
                  הזן את מחרוזת החיבור למסד הנתונים עבור דייר זה (אופציונלי)
                </p>
              </div>              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/tenants')}
                  disabled={loading}
                >
                  בטל
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
                      צור דייר
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

export default AddTenantPage;
