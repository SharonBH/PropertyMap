
import React from "react";
import { Agent } from "@/lib/data";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { User, Phone, Mail, MapPin, Star } from "lucide-react";

interface AgentInfoProps {
  agent: Agent;
  neighborhoodCount: number;
  propertyCount: number;
}

const AgentInfo: React.FC<AgentInfoProps> = ({ 
  agent, 
  neighborhoodCount, 
  propertyCount 
}) => {
  return (
    <Card className="border-border shadow-soft">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Avatar className="w-24 h-24 border-4 border-muted">
            <AvatarImage src={agent.image} alt={agent.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {agent.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center md:text-right flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {agent.name}
            </h2>
            
            {agent.overallRating && (
              <div className="flex items-center justify-center md:justify-start gap-1">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star 
                      key={index}
                      className={`h-4 w-4 ${
                        index < Math.floor(agent.overallRating || 0) 
                          ? "text-yellow-400 fill-yellow-400" 
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-foreground font-bold">
                  {agent.overallRating.toFixed(1)}
                </span>
              </div>
            )}
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              <div className="flex items-center text-foreground">
                <MapPin className="h-5 w-5 ml-2 text-secondary" />
                <span>{neighborhoodCount} שכונות</span>
              </div>
              
              <div className="flex items-center text-foreground">
                <User className="h-5 w-5 ml-2 text-secondary" />
                <span>{propertyCount} נכסים</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 text-right">
            <div className="flex items-center justify-end">
              <Mail className="h-5 w-5 ml-2 text-secondary" />
              <a href={`mailto:${agent.email}`} className="text-foreground hover:text-primary">
                {agent.email}
              </a>
            </div>
            
            <div className="flex items-center justify-end">
              <Phone className="h-5 w-5 ml-2 text-secondary" />
              <a href={`tel:${agent.phone}`} className="text-foreground hover:text-primary">
                {agent.phone}
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentInfo;
