import React, { useEffect, useRef } from "react";
import { Agent } from "@/lib/data";
import { useTenant } from "@/contexts/TenantContext";
import "./AgentFooter.css";

interface AgentFooterProps {
  agent?: Agent;
}

const AgentFooter: React.FC<AgentFooterProps> = ({ agent }) => {
  const { currentAgency } = useTenant();
    // Return a default footer if agent is not available
  if (!agent) {
    return (
      <footer className="text-white py-8 mt-auto bg-primary">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4">נדל״ן ישראלי</h3>
              <p className="max-w-md text-white/80">
                הפלטפורמה המובילה למציאת נכסים איכותיים בכל רחבי הארץ
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">צור קשר</h4>
              <p className="text-white/80">info@realestate.co.il</p>
              <p className="text-white/80">03-1234567</p>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60 text-sm">
            © {new Date().getFullYear()} נדל״ן ישראלי. כל הזכויות שמורות.
          </div>
        </div>
      </footer>
    );
  }
  
  // Determine which logo URL to use
  const logoURL = currentAgency?.logoURL || '';
  // Use agency name if available
  const agencyName = currentAgency?.name || agent.agency?.name || agent.name || "נדל״ן ישראלי";
  // Use agency description if available
  const agencyDescription = currentAgency?.description || "מציאת הנכס המושלם עבורך בליווי אישי ומקצועי";
  // Determine contact information
  const contactEmail = currentAgency?.email || agent.email || "info@realestate.co.il";
  const contactPhone = currentAgency?.telephone || agent.phone || "03-1234567";
  // Determine primary color for potential styling
  const primaryColor = currentAgency?.primaryColor || ""; // Agency's primary color if available
  // Get a reference to set custom property for agency color
  const footerRef = useRef<HTMLElement>(null);
  
  // Set custom property for agency color when it changes
  useEffect(() => {
    if (footerRef.current && primaryColor) {
      footerRef.current.style.setProperty('--agency-color', primaryColor);
    }
  }, [primaryColor]);
  
  return (
    <footer ref={footerRef} className="agent-footer">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            {logoURL ? (
              <div className="flex items-center mb-4">
                <img 
                  src={logoURL} 
                  alt={`${agencyName} logo`} 
                  className="h-12 mr-3 bg-white p-1 rounded" 
                />
                <h3 className="text-xl font-bold">{agencyName}</h3>
              </div>
            ) : (
              <h3 className="text-xl font-bold mb-4">{agencyName}</h3>
            )}
            <p className="max-w-md text-white/80">
              {agencyDescription}
            </p>
            {currentAgency?.address && (
              <p className="text-white/80 mt-2">
                <strong>כתובת:</strong> {currentAgency.address}
              </p>
            )}
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">צור קשר</h4>
            <p className="text-white/80">{contactEmail}</p>
            <p className="text-white/80">{contactPhone}</p>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60 text-sm">
          © {new Date().getFullYear()} {agencyName}. כל הזכויות שמורות.
          <div className="mt-2">
            Powered by <a href="https://sbh.co.il" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">SBH#DEV</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AgentFooter;
