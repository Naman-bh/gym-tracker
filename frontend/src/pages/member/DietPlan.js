import { motion } from "framer-motion";
import { Leaf, MoonStar, SunMedium, Utensils } from "lucide-react";
import DashboardShell from "../../components/DashboardShell";
import { useAuth } from "../../context/AuthContext";

export default function DietPlan() {
  const { user } = useAuth();

  const baseWeight = user?.weightKg || 70;
  const goal = "Maintain";

  const calories = Math.round(baseWeight * 30);
  const protein = Math.round(baseWeight * 2);
  const water = 3;

  const meals = [
    {
      label: "Breakfast",
      icon: SunMedium,
      items: ["Oats with berries", "Greek yogurt", "Black coffee / green tea"],
    },
    {
      label: "Lunch",
      icon: Utensils,
      items: ["Grilled chicken or tofu", "Brown rice / quinoa", "Mixed salad"],
    },
    {
      label: "Dinner",
      icon: MoonStar,
      items: ["Baked fish or paneer", "Steamed vegetables", "Small portion of carbs"],
    },
  ];

  return (
    <DashboardShell
      title="Diet Plan"
      subtitle="Align your meals with your training to support better recovery and performance."
    >
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-5 items-start">
        <div className="surface p-5 md:p-6 lift-card">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Leaf size={18} className="text-[#22c55e]" />
            Daily Targets
          </h3>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-secondary">Calories</p>
              <p className="text-2xl font-semibold mt-2">{calories}</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-secondary">Protein</p>
              <p className="text-2xl font-semibold mt-2">{protein}g</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-secondary">Water</p>
              <p className="text-2xl font-semibold mt-2">{water}L</p>
            </div>
          </div>
        </div>

        <div className="surface p-5 md:p-6 lift-card">
          <h3 className="font-semibold text-lg mb-3">Sample Day Plan</h3>
          <div className="space-y-4">
            {meals.map((meal, idx) => {
              const Icon = meal.icon;
              return (
                <motion.div
                  key={meal.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.03 }}
                  className="bg-white/[0.02] border border-white/5 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={16} className="text-[#22c55e]" />
                    <p className="text-sm font-medium">{meal.label}</p>
                  </div>
                  <ul className="text-sm text-secondary list-disc list-inside space-y-1">
                    {meal.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

