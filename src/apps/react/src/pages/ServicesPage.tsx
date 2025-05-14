
import React from "react";
import Navbar from "@/components/Navbar";
import { useProperties } from "@/hooks/useProperties";
import { Home, Building, Briefcase, Search, Key, LineChart, Phone } from "lucide-react";

const ServicesPage = () => {
  const { currentAgent } = useProperties();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-estate-cream/30">
      <Navbar />
      
      <main className="container px-4 py-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-estate-teal/10 rounded-full mb-4">
            <Briefcase className="h-6 w-6 text-estate-blue" />
          </div>
          <h1 className="text-4xl font-bold text-estate-dark-gray mb-2">
            השירותים שלנו
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            מגוון שירותי תיווך ונדל"ן לצרכים שלך
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-soft overflow-hidden transition-transform duration-300 hover:scale-105">
            <div className="h-3 bg-estate-blue"></div>
            <div className="p-6">
              <div className="bg-estate-teal/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Home className="h-8 w-8 text-estate-blue" />
              </div>
              <h3 className="text-xl font-bold text-estate-dark-gray mb-2">מכירת נכסים</h3>
              <p className="text-gray-600 mb-4">
                ליווי מקצועי בתהליך מכירת הנכס שלך, כולל הערכת שווי, צילום מקצועי, שיווק ממוקד וניהול משא ומתן
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-estate-blue rounded-full inline-block mr-2"></span>
                  הערכת שווי מקצועית
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-estate-blue rounded-full inline-block mr-2"></span>
                  צילום וסטיילינג לנכס
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-estate-blue rounded-full inline-block mr-2"></span>
                  שיווק ופרסום
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-estate-blue rounded-full inline-block mr-2"></span>
                  ניהול משא ומתן
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-soft overflow-hidden transition-transform duration-300 hover:scale-105">
            <div className="h-3 bg-estate-teal"></div>
            <div className="p-6">
              <div className="bg-estate-teal/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-estate-blue" />
              </div>
              <h3 className="text-xl font-bold text-estate-dark-gray mb-2">רכישת נכסים</h3>
              <p className="text-gray-600 mb-4">
                איתור הנכס המושלם עבורך בהתאם לדרישות והתקציב שלך, בדיקת הנכס וליווי עד לחתימת החוזה
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-estate-teal rounded-full inline-block mr-2"></span>
                  התאמת נכסים לדרישות
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-estate-teal rounded-full inline-block mr-2"></span>
                  בדיקת נכסים מקיפה
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-estate-teal rounded-full inline-block mr-2"></span>
                  ליווי במשא ומתן
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-estate-teal rounded-full inline-block mr-2"></span>
                  סיוע בתהליכי משכנתא
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-soft overflow-hidden transition-transform duration-300 hover:scale-105">
            <div className="h-3 bg-estate-blue"></div>
            <div className="p-6">
              <div className="bg-estate-teal/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Building className="h-8 w-8 text-estate-blue" />
              </div>
              <h3 className="text-xl font-bold text-estate-dark-gray mb-2">השכרת נכסים</h3>
              <p className="text-gray-600 mb-4">
                ניהול מקצועי של תהליך השכרת הנכס שלך, מציאת שוכרים איכותיים וליווי משפטי
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-estate-blue rounded-full inline-block mr-2"></span>
                  שיווק הנכס לשוכרים
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-estate-blue rounded-full inline-block mr-2"></span>
                  סינון שוכרים פוטנציאליים
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-estate-blue rounded-full inline-block mr-2"></span>
                  עריכת חוזה השכרה
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-estate-blue rounded-full inline-block mr-2"></span>
                  מסירת המפתח וניהול הפקדונות
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-soft overflow-hidden transition-transform duration-300 hover:scale-105">
            <div className="h-3 bg-estate-teal"></div>
            <div className="p-6">
              <div className="bg-estate-teal/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Key className="h-8 w-8 text-estate-blue" />
              </div>
              <h3 className="text-xl font-bold text-estate-dark-gray mb-2">ניהול נכסים</h3>
              <p className="text-gray-600 mb-4">
                ניהול נכסי השקעה עבור משקיעי נדל"ן, כולל תחזוקה שוטפת, גביית תשלומים וטיפול בבעיות
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-estate-teal rounded-full inline-block mr-2"></span>
                  איתור שוכרים איכותיים
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-estate-teal rounded-full inline-block mr-2"></span>
                  גביית תשלומים
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-estate-teal rounded-full inline-block mr-2"></span>
                  טיפול בתקלות
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-estate-teal rounded-full inline-block mr-2"></span>
                  דיווחים חודשיים למשקיע
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-soft overflow-hidden transition-transform duration-300 hover:scale-105">
            <div className="h-3 bg-estate-blue"></div>
            <div className="p-6">
              <div className="bg-estate-teal/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <LineChart className="h-8 w-8 text-estate-blue" />
              </div>
              <h3 className="text-xl font-bold text-estate-dark-gray mb-2">ייעוץ השקעות</h3>
              <p className="text-gray-600 mb-4">
                ייעוץ מקצועי להשקעות נדל"ן, ניתוח שוק, איתור הזדמנויות וליווי בתהליך הרכישה
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-estate-blue rounded-full inline-block mr-2"></span>
                  ניתוח שוק והזדמנויות
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-estate-blue rounded-full inline-block mr-2"></span>
                  תכנון אסטרטגי להשקעה
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-estate-blue rounded-full inline-block mr-2"></span>
                  בדיקת תשואה
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-estate-blue rounded-full inline-block mr-2"></span>
                  ליווי בתהליך הרכישה
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-soft overflow-hidden transition-transform duration-300 hover:scale-105">
            <div className="h-3 bg-estate-teal"></div>
            <div className="p-6">
              <div className="bg-estate-teal/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="h-8 w-8 text-estate-blue" />
              </div>
              <h3 className="text-xl font-bold text-estate-dark-gray mb-2">ייצוג משפטי</h3>
              <p className="text-gray-600 mb-4">
                ליווי משפטי בעסקאות נדל"ן, כולל בדיקת מסמכים, ניסוח חוזים וייצוג בתהליכים מול הרשויות
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-estate-teal rounded-full inline-block mr-2"></span>
                  בדיקת מסמכים
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-estate-teal rounded-full inline-block mr-2"></span>
                  ניסוח וסקירת חוזים
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-estate-teal rounded-full inline-block mr-2"></span>
                  טיפול ברישום
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-estate-teal rounded-full inline-block mr-2"></span>
                  ייצוג מול הרשויות
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-estate-light-gray rounded-xl p-8 mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-estate-dark-gray">תהליך העבודה שלנו</h2>
            <p className="text-gray-600 mt-2">
              כך אנחנו מלווים אותך לאורך כל הדרך
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative p-6 bg-white rounded-lg shadow-sm text-center">
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-estate-blue rounded-full flex items-center justify-center text-white font-bold">1</div>
              <div className="bg-estate-teal/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-estate-blue" />
              </div>
              <h3 className="text-lg font-bold text-estate-dark-gray mb-2">פגישת ייעוץ</h3>
              <p className="text-gray-600">
                פגישה ראשונית להבנת הצרכים שלך
              </p>
            </div>
            
            <div className="relative p-6 bg-white rounded-lg shadow-sm text-center">
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-estate-blue rounded-full flex items-center justify-center text-white font-bold">2</div>
              <div className="bg-estate-teal/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-estate-blue" />
              </div>
              <h3 className="text-lg font-bold text-estate-dark-gray mb-2">איתור נכסים</h3>
              <p className="text-gray-600">
                מציאת הנכסים המתאימים ביותר
              </p>
            </div>
            
            <div className="relative p-6 bg-white rounded-lg shadow-sm text-center">
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-estate-blue rounded-full flex items-center justify-center text-white font-bold">3</div>
              <div className="bg-estate-teal/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Home className="h-6 w-6 text-estate-blue" />
              </div>
              <h3 className="text-lg font-bold text-estate-dark-gray mb-2">סיורים בנכסים</h3>
              <p className="text-gray-600">
                ביקור וסיור בנכסים הנבחרים
              </p>
            </div>
            
            <div className="relative p-6 bg-white rounded-lg shadow-sm text-center">
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-estate-blue rounded-full flex items-center justify-center text-white font-bold">4</div>
              <div className="bg-estate-teal/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Key className="h-6 w-6 text-estate-blue" />
              </div>
              <h3 className="text-lg font-bold text-estate-dark-gray mb-2">סגירת עסקה</h3>
              <p className="text-gray-600">
                ליווי וסיוע בכל שלבי העסקה
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-estate-blue text-white py-8 mt-12">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4">נדל״ן - {currentAgent.name}</h3>
              <p className="max-w-md text-white/80">
                מציאת הנכס המושלם עבורך בליווי אישי ומקצועי
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">צור קשר</h4>
              <p className="text-white/80">{currentAgent.email}</p>
              <p className="text-white/80">{currentAgent.phone}</p>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60 text-sm">
            © {new Date().getFullYear()} נדל״ן - {currentAgent.name}. כל הזכויות שמורות.
            <div className="mt-2">Powered by Lovable</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ServicesPage;
