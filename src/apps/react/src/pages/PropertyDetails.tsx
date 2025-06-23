import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ContactForm from "@/components/ContactForm";
import { useProperties } from "@/hooks/useProperties";
import { formatPrice } from "@/lib/data";
import { PropertyResponse } from "@/api/homemapapi";
import { 
  ArrowRight, 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  Check 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/imageUrl";
import AgentFooter from "@/components/properties/AgentFooter";

const getMainImage = (images: { imageUrl?: string | null; isMain?: boolean }[] | null | undefined) => {
  if (!images || images.length === 0) return '/placeholder-image.jpg';
  const main = images.find(img => img.isMain);
  return resolveImageUrl(main?.imageUrl ?? images[0].imageUrl);
};

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { currentAgent, getPropertyById } = useProperties();
  const [property, setProperty] = useState<PropertyResponse | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const getPropertyByIdRef = React.useRef(getPropertyById);

  useEffect(() => {
    getPropertyByIdRef.current = getPropertyById;
  }, [getPropertyById]);

  useEffect(() => {
    let isMounted = true;
    if (id) {
      setIsLoading(true);
      (async () => {
        const foundProperty = getPropertyByIdRef.current ? await getPropertyByIdRef.current(id) : null;
        if (!isMounted) return;
        setProperty(foundProperty || null);
        if (foundProperty && foundProperty.images && foundProperty.images.length > 0) {
          setSelectedImage(getMainImage(foundProperty.images));
        } else {
          setSelectedImage('/placeholder-image.jpg');
        }
        setIsLoading(false);
      })();
    }
    return () => { isMounted = false; };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-estate-cream/30">
        <Navbar />
        <div className="container px-4 py-16 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-estate-blue border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-estate-blue font-medium">טוען פרטי נכס...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-estate-cream/30">
        <Navbar />
        <div className="container px-4 py-16">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-estate-blue mb-4">הנכס לא נמצא</h1>
            <p className="text-gray-600 mb-8">
              הנכס שחיפשת אינו קיים או שהוסר מהמערכת.
            </p>
            <Link
              to="/"
              className="inline-flex items-center text-white bg-estate-blue px-6 py-3 rounded-lg font-medium hover:bg-estate-blue/90 transition-colors"
            >
              <ArrowRight className="ml-2 h-5 w-5" />
              חזרה לדף הבית
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const agent = currentAgent; // Assuming currentAgent is the agent for the property

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-estate-cream/30">
      <Navbar />
      
      <main className="container px-4 py-8 animate-fade-in">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-estate-blue hover:text-estate-teal transition-colors mb-4"
          >
            <ArrowRight className="ml-2 h-5 w-5" />
            חזרה לדף הבית
          </Link>
          
          <h1 className="text-3xl font-bold text-estate-dark-gray mb-2">
            {property.name}
          </h1>
          
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="h-5 w-5 ml-2 text-estate-blue" />
            <span>{property.address}</span>
          </div>
          
          <div className="text-2xl font-bold text-estate-blue">
            {formatPrice(property.askingPrice || 0)}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="rounded-lg overflow-hidden shadow-soft mb-4">
                <img
                  src={selectedImage || '/placeholder-image.jpg'}
                  alt={property.name}
                  className="w-full h-80 object-cover"
                />
              </div>
              
              <div className="flex space-x-4 rtl:space-x-reverse overflow-auto pb-2">
                {property.images && property.images.length > 0 ? (
                  property.images.map((img, index) => {
                    const imgUrl = resolveImageUrl(img.imageUrl);
                    return (
                      <button
                        key={img.id || index}
                        type="button"
                        onClick={() => setSelectedImage(imgUrl)}
                        className={cn(
                          "relative min-w-[100px] h-20 rounded-md overflow-hidden transition-all duration-200",
                          selectedImage === imgUrl ? "ring-2 ring-estate-blue" : "opacity-70 hover:opacity-100"
                        )}
                      >
                        <img
                          src={imgUrl}
                          alt={`${property.name} - תמונה ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })
                ) : (
                  <div className="text-gray-400">אין תמונות להצגה</div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <Bed className="h-6 w-6 mx-auto mb-2 text-estate-blue" />
                <span className="block font-bold text-lg">{property.rooms}</span>
                <span className="text-sm text-gray-600">חדרים</span>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <Bath className="h-6 w-6 mx-auto mb-2 text-estate-blue" />
                <span className="block font-bold text-lg">{property.bathrooms}</span>
                <span className="text-sm text-gray-600">אמבטיות</span>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <Square className="h-6 w-6 mx-auto mb-2 text-estate-blue" />
                <span className="block font-bold text-lg">{property.size}</span>
                <span className="text-sm text-gray-600">מ"ר</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-soft mb-8 animate-fade-in">
              <h2 className="text-xl font-bold text-estate-dark-gray mb-4">תיאור הנכס</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {property.description}
              </p>
              
              <h3 className="text-lg font-bold text-estate-dark-gray mb-3">מאפיינים</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                {(property.featureList ? property.featureList.split(",") : []).map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 ml-2 text-estate-teal" />
                    <span>{feature.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-soft animate-fade-in">
              <h2 className="text-xl font-bold text-estate-dark-gray mb-4">פרטים נוספים</h2>
              <div className="flex items-center mb-3">
                <Calendar className="h-5 w-5 ml-2 text-estate-blue" />
                <span className="text-gray-700">
                  תאריך פרסום: {new Date(property.listedDate).toLocaleDateString("he-IL")}
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {agent && (
              <div className="bg-white p-6 rounded-lg shadow-soft animate-fade-in">
                <h2 className="text-xl font-bold text-estate-dark-gray mb-4">פרטי הסוכן</h2>
                <div className="flex items-center mb-4">
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white"
                  />
                  <div className="mr-4">
                    <h3 className="font-bold text-lg">{agent.name}</h3>
                    <p className="text-gray-600">סוכן נדל"ן</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 ml-2 text-estate-blue" />
                    <a href={`tel:${agent.phone}`} className="text-estate-blue hover:underline">
                      {agent.phone}
                    </a>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 ml-2 text-estate-blue" />
                    <a href={`mailto:${agent.email}`} className="text-estate-blue hover:underline">
                      {agent.email}
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            <ContactForm property={property} agent={agent} />
          </div>
        </div>      </main>
      <AgentFooter agent={currentAgent} />
    </div>
  );
};

export default PropertyDetails;
