import { cn } from "../../lib/utils";
import { HelpCircle, CheckSquare, FileText, BookOpen, GraduationCap } from 'lucide-react';

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "Explain",
      description: "Objašnjava složene koncepte jednostavnim jezikom",
      icon: <HelpCircle className="h-6 w-6" />,
    },
    {
      title: "Solve",
      description: "Rešava probleme i zadatke korak po korak",
      icon: <CheckSquare className="h-6 w-6" />,
    },
    {
      title: "Summary",
      description: "Pravi sažetke tekstova i materijala",
      icon: <FileText className="h-6 w-6" />,
    },
    {
      title: "Tests",
      description: "Generiše testove za vežbanje gradiva",
      icon: <BookOpen className="h-6 w-6" />,
    },
    {
      title: "Learning",
      description: "Interaktivno učenje sa AI tutorom",
      icon: <GraduationCap className="h-6 w-6" />,
    }
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-zinc-800/50",
        (index === 0) && "lg:border-l border-zinc-800/50",
        "lg:border-b border-zinc-800/50"
      )}
    >
      <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-zinc-900/50 to-transparent pointer-events-none" />
      <div className="mb-4 relative z-10 px-10 text-zinc-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-zinc-700 group-hover/feature:bg-white transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-white font-black">
          {title}
        </span>
      </div>
      <p className="text-sm text-zinc-300 max-w-xs relative z-10 px-10 leading-relaxed">
        {description}
      </p>
    </div>
  );
};
