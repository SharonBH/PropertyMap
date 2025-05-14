
import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Property, Agent } from "@/lib/data";

interface ContactFormProps {
  property?: Property;
  agent?: Agent;
}

const ContactForm: React.FC<ContactFormProps> = ({ property, agent }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "ההודעה נשלחה בהצלחה",
        description: "הסוכן יצור איתך קשר בהקדם.",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    }, 1000);
  };

  return (
    <div className="glass p-6 rounded-lg animate-fade-in">
      <h3 className="text-xl font-bold text-estate-blue mb-4">
        {property 
          ? `צור קשר לגבי: ${property.title}` 
          : "צור קשר עם הסוכן"}
      </h3>

      {agent && (
        <div className="flex items-center mb-4 p-3 bg-estate-light-gray rounded-lg">
          <img
            src={agent.image}
            alt={agent.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-white"
          />
          <div className="mr-3">
            <p className="font-bold text-estate-dark-gray">{agent.name}</p>
            <p className="text-sm text-gray-600">{agent.phone}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            שם מלא
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-estate-teal focus:border-transparent transition-all duration-200"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            אימייל
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-estate-teal focus:border-transparent transition-all duration-200"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            טלפון
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-estate-teal focus:border-transparent transition-all duration-200"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            הודעה
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-estate-teal focus:border-transparent transition-all duration-200"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-estate-blue hover:bg-estate-blue/90 text-white font-bold"
          disabled={isSubmitting}
        >
          {isSubmitting ? "שולח..." : "שלח פנייה"}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
