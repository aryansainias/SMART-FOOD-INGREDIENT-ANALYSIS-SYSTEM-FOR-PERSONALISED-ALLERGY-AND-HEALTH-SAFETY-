import type React from "react";
import { useRef, useState } from "react";
import Tesseract from "tesseract.js";
import { useUserProfile } from "@/lib/UserProfileContext";

// Demo ingredient info (should be replaced with actual data/API)
const DEMO_INGREDIENT_INFO: Record<string, string> = {
  "Sugar": "Sugar is a sweetener commonly used in food. High consumption can raise health risks like diabetes.",
  "Salt": "Salt is essential for health but too much can raise blood pressure.",
  "Palm Oil": "Palm oil is a vegetable oil. Its production may harm rainforests and overconsumption isn't heart-healthy.",
  "Maltodextrin": "Food additive derived from starch, used as a thickener. It can spike blood sugar.",
  "Monosodium Glutamate": "MSG is a flavor enhancer. Some people report mild sensitivity.",
  "Soy Lecithin": "Soy lecithin is an emulsifier made from soybeans, common in processed foods.",
  "Citric Acid": "Citric acid is a preservative and flavoring found naturally in citrus fruits.",
  "Lactic Acid": "Lactic acid is used for preservation and food flavoring.",
  "Corn Syrup": "A sweetener made from corn starch. High fructose versions may increase health risks.",
  "Sodium Benzoate": "A preservative used to prolong shelf life. Generally safe in small amounts.",
  "Potassium Sorbate": "Used as a preservative, considered safe by most standards.",
  "Whey Protein": "Protein from milk; avoid if lactose intolerant or allergic to dairy.",
  "Skimmed Milk Powder": "Dried milk; contains lactose and proteins from cow’s milk.",
  "Vegetable Oil": "Oils extracted from plants; check the source for allergies.",
  "Sunflower Oil": "A common, mild-flavored oil useful for frying and baking.",
  "Canola Oil": "Oil from rapeseed; low in saturated fat and widely used.",
  "Artificial Flavour": "Chemically synthesized flavors not found in nature.",
  "Natural Flavour": "Complex mixture from natural sources, but chemically processed.",
  "Gelatin": "Protein from animal collagen; not suitable for vegetarians/vegans.",
  "Egg White": "Egg component; high in protein, allergenic to some.",
  "Egg Yolk": "Part of the egg rich in fat, cholesterol, and vitamins.",
  "Gluten": "A protein in wheat and related grains. Avoid if celiac or gluten-sensitive.",
  "Wheat Flour": "Powder from wheat; a common allergen and contains gluten.",
  "Barley Malt": "Made from barley; can contain gluten.",
  "Casein": "Main protein in milk; avoid if dairy-allergic.",
  "Dextrose": "A simple sugar made from corn. Can increase blood sugar rapidly.",
  "Fructose": "Simple sugar found in fruit. High amounts may strain the liver.",
  "Xanthan Gum": "Thickener and stabilizer. Generally safe, but high doses can upset digestion.",
  "Guar Gum": "Thickener from guar beans; may cause gas if sensitive.",
  "Calcium Propionate": "Preservative often used in bread; safe, but can cause allergy in rare cases.",
  "Sodium Nitrite": "Used to preserve meats; associated with cancer risk if eaten in excess.",
  "Fully Hydrogenated Oil": "Oil processed to be solid at room temp; creates trans fats and raises heart disease risk.",
};

function parseIngredients(text: string): string[] {
  const ingredientsLine = text
    .split(/\n/)
    .find(line => /ingredient/i.test(line));
  if (!ingredientsLine) return [];
  // Get everything after "Ingredients:"
  const ing = ingredientsLine.split(/ingredient[s]?:/i)[1];
  if (!ing) return [];
  return ing
    .split(/[,;.]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function getStatusColor(ingredient: string, allergies: string, restrictions: string): "red" | "yellow" | "green" {
  if (!ingredient) return "green";
  const low = ingredient.toLowerCase();
  if (allergies && allergies.toLowerCase().split(/[,;]/).some(a => a.trim() && low.includes(a.trim()))) {
    return "red";
  }
  if (restrictions && restrictions.toLowerCase().split(/[,;]/).some(r => r.trim() && low.includes(r.trim()))) {
    return "yellow";
  }
  return "green";
}

const MainScanPage = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string>("");
  const [editableText, setEditableText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [analyzedText, setAnalyzedText] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { profile } = useUserProfile();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setOcrText("");
    setEditableText("");
    setAnalyzedText(null);
    setIngredients([]);
    setSelectedIngredient(null);
    setIsLoading(true);
    const res = await Tesseract.recognize(file, "eng", {});
    setOcrText(res.data.text);
    setEditableText(res.data.text);
    setIsLoading(false);
  }

  function handleAnalyze() {
    setAnalyzedText(editableText);
    const extracted = parseIngredients(editableText);
    setIngredients(extracted);
    setSelectedIngredient(null);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Scan or Upload Food Package</h2>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="mb-4"
        onChange={handleFileChange}
      />
      {imageUrl && (
        <img src={imageUrl} alt="Uploaded food package" className="max-h-56 mb-4 border rounded" />
      )}
      {isLoading && <p className="text-blue-500 font-semibold">Analyzing image...</p>}
      {ocrText && !isLoading && (
        <div className="mt-4 bg-slate-100 rounded p-4 w-full max-w-xl">
          <h3 className="font-semibold mb-2">Review and edit the text below:</h3>
          <textarea
            className="w-full h-40 border rounded p-2 mb-3 text-sm"
            value={editableText}
            onChange={e => setEditableText(e.target.value)}
          />
          <button
            onClick={handleAnalyze}
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded p-2 font-semibold mt-2"
          >
            Next: Analyze Ingredients
          </button>
        </div>
      )}
      {analyzedText && (
        <div className="mt-4 w-full max-w-xl bg-green-50 border rounded p-4">
          <h3 className="font-semibold mb-2">Extracted Ingredients:</h3>
          {ingredients.length > 0 ? (
            <ul className="space-y-2 mt-2">
              {ingredients.map((ingredient, i) => {
                const status = getStatusColor(
                  ingredient,
                  profile?.allergies || "",
                  profile?.restrictions || ""
                );
                return (
                  <li
                    key={i}
                    className={`px-2 py-1 rounded font-medium cursor-pointer transition-all duration-200 border border-transparent hover:shadow-md hover:border-green-400 ${
                      status === "red"
                        ? "bg-red-200 text-red-900"
                        : status === "yellow"
                        ? "bg-yellow-200 text-yellow-900"
                        : "bg-green-200 text-green-900"
                    }`}
                    onClick={() => setSelectedIngredient(ingredient)}
                    tabIndex={0}
                  >
                    {ingredient}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div>No ingredients found – try correcting the text and re-analyzing.</div>
          )}

          {selectedIngredient && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
              <div className="bg-white rounded shadow-lg max-w-sm w-full p-6 relative animate-fade-in">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-black"
                  onClick={() => setSelectedIngredient(null)}
                  aria-label="Close ingredient info"
                >
                  &times;
                </button>
                <h4 className="font-bold text-xl mb-2 text-green-800">{selectedIngredient}</h4>
                <p className="text-gray-700 text-sm">
                  {selectedIngredient && DEMO_INGREDIENT_INFO[selectedIngredient.trim()]
                    ? DEMO_INGREDIENT_INFO[selectedIngredient.trim()]
                    : `No info available for "${selectedIngredient}". Common food ingredient.`}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MainScanPage;
