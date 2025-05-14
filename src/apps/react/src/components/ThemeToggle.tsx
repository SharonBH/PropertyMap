
import React from "react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Sun, 
  Moon, 
  Palette, 
  Leaf, 
  ChevronDown 
} from "lucide-react";

const ThemeToggle = () => {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const currentTheme = theme || resolvedTheme || "light";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          {currentTheme === "light" && <Sun className="h-[1.2rem] w-[1.2rem]" />}
          {currentTheme === "dark" && <Moon className="h-[1.2rem] w-[1.2rem]" />}
          {currentTheme === "blue" && <Palette className="h-[1.2rem] w-[1.2rem] text-estate-teal" />}
          {currentTheme === "green" && <Leaf className="h-[1.2rem] w-[1.2rem] text-green-500" />}
          <span className="mr-1">ערכת נושא</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-2">
          <Sun className="h-4 w-4" />
          <span>בהיר</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-2">
          <Moon className="h-4 w-4" />
          <span>כהה</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("blue")} className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-estate-teal" />
          <span>כחול</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("green")} className="flex items-center gap-2">
          <Leaf className="h-4 w-4 text-green-500" />
          <span>ירוק</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
