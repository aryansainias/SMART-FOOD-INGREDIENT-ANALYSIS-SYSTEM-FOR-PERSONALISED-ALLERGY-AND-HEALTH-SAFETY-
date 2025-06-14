import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/lib/UserProfileContext";

const Onboarding = () => {
  const [allergies, setAllergies] = useState("");
  const [restrictions, setRestrictions] = useState("");
  const [goals, setGoals] = useState("");
  const { setProfile } = useUserProfile();
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfile({ allergies, restrictions, goals });
    navigate("/scan");
  }

  return (
    <div className="max-w-md mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">Tell us about your health profile</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 font-medium">Allergies</label>
          <input
            type="text"
            className="w-full rounded border p-2"
            placeholder="e.g. peanuts, soy, gluten"
            value={allergies}
            onChange={e => setAllergies(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Dietary restrictions</label>
          <input
            type="text"
            className="w-full rounded border p-2"
            placeholder="e.g. vegetarian, vegan, keto"
            value={restrictions}
            onChange={e => setRestrictions(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Health goals/preferences</label>
          <input
            type="text"
            className="w-full rounded border p-2"
            placeholder="e.g. weight loss, muscle gain"
            value={goals}
            onChange={e => setGoals(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white rounded p-2 font-semibold"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default Onboarding;
