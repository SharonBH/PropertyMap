
import React from "react";
import { Agent } from "@/lib/data";

interface AgentFooterProps {
  agent: Agent;
}

const AgentFooter: React.FC<AgentFooterProps> = ({ agent }) => {
  return (
    <footer className="bg-estate-blue text-white py-8 mt-auto">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-4">נדל״ן - {agent.name}</h3>
            <p className="max-w-md text-white/80">
              מציאת הנכס המושלם עבורך בליווי אישי ומקצועי
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">צור קשר</h4>
            <p className="text-white/80">{agent.email}</p>
            <p className="text-white/80">{agent.phone}</p>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60 text-sm">
          © {new Date().getFullYear()} נדל״ן - {agent.name}. כל הזכויות שמורות.
          <div className="mt-2">
            Powered by <a href="https://sbh.co.il" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">SBH#DEV</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AgentFooter;
