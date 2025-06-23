import React from "react";
import { Agent } from "@/lib/data";
import { useTenant } from "@/contexts/TenantContext";

interface AgentFooterProps {
  agent?: Agent;
}

const AgentFooter: React.FC<AgentFooterProps> = ({ agent }) => {
  const { currentAgency } = useTenant();
  
  if (!agent || !agent.name) return null;  // Determine which logo URL to use
  const logoURL = currentAgency?.logoURL || '';
  // Use agency name if available
  const agencyName = currentAgency?.name || agent.agency?.name || agent.name;
  // Use agency description if available
  const agencyDescription = currentAgency?.description || "מציאת הנכס המושלם עבורך בליווי אישי ומקצועי";
  // Determine contact information
  const contactEmail = currentAgency?.email || agent.email;
  const contactPhone = currentAgency?.telephone || agent.phone;
  // Determine primary color for potential styling
  const primaryColor = currentAgency?.primaryColor || ""; // Agency's primary color if available

  // Check if we should use custom agency color for the footer
  const footerStyle = primaryColor ? 
    { backgroundColor: primaryColor } : 
    { backgroundColor: "var(--estate-blue)" }; // Default color from your theme
  
  return (
    <footer className="text-white py-8 mt-auto" style={footerStyle}>
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
