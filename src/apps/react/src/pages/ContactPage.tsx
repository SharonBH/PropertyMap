import React from "react";
import Navbar from "@/components/Navbar";
import { useProperties } from "@/hooks/useProperties";
import ContactForm from "@/components/ContactForm";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const ContactPage = () => {
  const { currentAgent } = useProperties();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-estate-cream/30">
      <Navbar />
      
      <main className="container px-4 py-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-estate-teal/10 rounded-full mb-4">
            <Phone className="h-6 w-6 text-estate-blue" />
          </div>
          <h1 className="text-4xl font-bold text-estate-dark-gray mb-2">
            צור קשר
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            אנחנו כאן לענות על כל שאלה
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-soft p-8">
            <h2 className="text-2xl font-bold text-estate-dark-gray mb-6">
              פרטי התקשרות
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-estate-teal/10 p-3 rounded-full ml-4">
                  <Phone className="h-6 w-6 text-estate-blue" />
                </div>
                <div>
                  <h3 className="font-bold text-estate-dark-gray mb-1">טלפון</h3>
                  <p className="text-gray-600">{currentAgent.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-estate-teal/10 p-3 rounded-full ml-4">
                  <Mail className="h-6 w-6 text-estate-blue" />
                </div>
                <div>
                  <h3 className="font-bold text-estate-dark-gray mb-1">דוא"ל</h3>
                  <p className="text-gray-600">{currentAgent.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-estate-teal/10 p-3 rounded-full ml-4">
                  <MapPin className="h-6 w-6 text-estate-blue" />
                </div>
                <div>
                  <h3 className="font-bold text-estate-dark-gray mb-1">כתובת המשרד</h3>
                  <p className="text-gray-600">רחוב איינשטיין 40, תל אביב</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-estate-teal/10 p-3 rounded-full ml-4">
                  <Clock className="h-6 w-6 text-estate-blue" />
                </div>
                <div>
                  <h3 className="font-bold text-estate-dark-gray mb-1">שעות פעילות</h3>
                  <p className="text-gray-600">ראשון - חמישי: 9:00 - 18:00</p>
                  <p className="text-gray-600">שישי: 9:00 - 13:00</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-bold text-estate-dark-gray mb-4">אזורי פעילות</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-estate-blue/10 text-estate-blue rounded-full text-sm">רמת אביב</span>
                <span className="px-3 py-1 bg-estate-blue/10 text-estate-blue rounded-full text-sm">נווה צדק</span>
                <span className="px-3 py-1 bg-estate-blue/10 text-estate-blue rounded-full text-sm">הצפון הישן</span>
                <span className="px-3 py-1 bg-estate-blue/10 text-estate-blue rounded-full text-sm">הצפון החדש</span>
                <span className="px-3 py-1 bg-estate-blue/10 text-estate-blue rounded-full text-sm">לב תל אביב</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-soft p-8">
            <h2 className="text-2xl font-bold text-estate-dark-gray mb-6">
              שלח הודעה
            </h2>
            
            <ContactForm agent={currentAgent} />
          </div>
        </div>
        
        <div className="bg-estate-light-gray rounded-xl p-8 mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-estate-dark-gray">שאלות נפוצות</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-estate-dark-gray mb-2">כמה עולים שירותי תיווך?</h3>
              <p className="text-gray-600">
                עמלת התיווך הסטנדרטית בישראל היא 2% + מע"מ מערך העסקה. אנו גובים את העמלה רק לאחר סגירת העסקה בהצלחה.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-estate-dark-gray mb-2">האם אתם עובדים בכל אזורי הארץ?</h3>
              <p className="text-gray-600">
                אנו מתמחים באזור תל אביב והסביבה, עם התמקדות מיוחדת בשכונות רמת אביב, נווה צדק והאזורים הצפוניים של העיר.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-estate-dark-gray mb-2">כמה זמן לוקח למכור דירה?</h3>
              <p className="text-gray-600">
                זמן המכירה משתנה בהתאם לאזור, למחיר ולמצב השוק. בממוצע, מכירת דירה אורכת בין חודש לשלושה חודשים, אך אנו שואפים לקצר זמן זה באמצעות שיווק אפקטיבי.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-estate-dark-gray mb-2">האם אתם מטפלים גם בנכסים מסחריים?</h3>
              <p className="text-gray-600">
                כן, אנו מספקים שירותי תיווך גם לנכסים מסחריים כגון משרדים, חנויות ומבני מסחר.
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

export default ContactPage;
