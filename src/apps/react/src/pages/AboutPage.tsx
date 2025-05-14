
import React from "react";
import Navbar from "@/components/Navbar";
import { useProperties } from "@/hooks/useProperties";
import { Star, Award, Users, Building } from "lucide-react";

const AboutPage = () => {
  const { currentAgent } = useProperties();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-estate-cream/30">
      <Navbar />
      
      <main className="container px-4 py-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-estate-teal/10 rounded-full mb-4">
            <Users className="h-6 w-6 text-estate-blue" />
          </div>
          <h1 className="text-4xl font-bold text-estate-dark-gray mb-2">
            אודות
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            מי אנחנו ומה אנחנו עושים
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          <div className="w-full lg:w-1/2">
            <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden mb-6">
              <img 
                src={currentAgent.image} 
                alt={currentAgent.name} 
                className="object-cover w-full h-full"
              />
            </div>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center bg-estate-blue/10 rounded-full px-4 py-2 text-estate-blue">
                <Star className="h-4 w-4 mr-2" />
                <span>10+ שנות ניסיון</span>
              </div>
              <div className="flex items-center bg-estate-blue/10 rounded-full px-4 py-2 text-estate-blue">
                <Building className="h-4 w-4 mr-2" />
                <span>מומחית נדל"ן</span>
              </div>
              <div className="flex items-center bg-estate-blue/10 rounded-full px-4 py-2 text-estate-blue">
                <Award className="h-4 w-4 mr-2" />
                <span>סוכנת מצטיינת</span>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <h2 className="text-2xl font-bold text-estate-dark-gray mb-4">
              הסיפור שלנו
            </h2>
            
            <div className="prose prose-lg max-w-none">
              <p className="mb-4">
                שמי {currentAgent.name}, ואני סוכנת נדל"ן מובילה עם ניסיון של יותר מעשור בשוק הנדל"ן הישראלי. התחלתי את הקריירה שלי מתוך אהבה אמיתית לנדל"ן ולעזרה לאנשים למצוא את הבית המושלם עבורם.
              </p>
              
              <p className="mb-4">
                במהלך השנים, צברתי ידע רב בשוק הנדל"ן המקומי ופיתחתי מומחיות מיוחדת באזורים של רמת אביב ונווה צדק. אני מכירה כל רחוב, כל שכונה וכל מבנה באזורים אלה, ויכולה לספק לכם את המידע המדויק ביותר על ערכי הנכסים והתחזיות לעתיד.
              </p>
              
              <p className="mb-4">
                האני מאמין שלי הוא שרכישת או מכירת נכס צריכה להיות חוויה חיובית ונטולת לחץ. אני מחויבת לספק שירות אישי ומקצועי לכל לקוח, ולהבטיח שהאינטרסים שלכם תמיד בראש סדר העדיפויות.
              </p>
              
              <p className="mb-4">
                בין אם אתם מחפשים לקנות את הבית הראשון שלכם, להשקיע בנכס או למכור את הנכס הנוכחי שלכם, אני כאן כדי לעזור לכם להשיג את המטרות שלכם בצורה החלקה והמוצלחת ביותר.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-estate-light-gray rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-estate-dark-gray mb-6 text-center">הערכים שלנו</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-soft text-center">
              <div className="bg-estate-teal/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-estate-blue" />
              </div>
              <h3 className="text-lg font-bold text-estate-dark-gray mb-2">יושרה</h3>
              <p className="text-gray-600">
                אנו פועלים ביושרה מוחלטת ושקיפות מלאה בכל עסקה
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-soft text-center">
              <div className="bg-estate-teal/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-estate-blue" />
              </div>
              <h3 className="text-lg font-bold text-estate-dark-gray mb-2">שירות אישי</h3>
              <p className="text-gray-600">
                אנו מתאימים את השירות לצרכים הייחודיים של כל לקוח
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-soft text-center">
              <div className="bg-estate-teal/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-estate-blue" />
              </div>
              <h3 className="text-lg font-bold text-estate-dark-gray mb-2">מקצועיות</h3>
              <p className="text-gray-600">
                אנו מביאים ידע וניסיון מקצועי לכל עסקת נדל"ן
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

export default AboutPage;
