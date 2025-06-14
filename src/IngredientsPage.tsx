import React, { useState } from 'react';

// Sample ingredient database (placeholder, can connect to real API/database)
const INGREDIENTS_DB = [
  {
    name: "Sugar",
    description: "A sweet crystalline substance obtained from various plants, used as a sweetener in food.",
    health: "Excess sugar can contribute to obesity, diabetes, and tooth decay.",
  },
  {
    name: "Palm Oil",
    description: "Edible vegetable oil derived from the fruit of oil palms.",
    health: "High in saturated fats. Can raise cholesterol. Some environmental concerns, check for RSPO certification.",
  },
  {
    name: "Monosodium Glutamate (MSG)",
    description: "Flavor enhancer often added to savory foods.",
    health: "Generally recognized as safe in small amounts; some people may experience headaches or allergic reactions.",
  },
  {
    name: "Soy Lecithin",
    description: "A natural emulsifier derived from soybeans, used to stabilize foods like chocolate and dressings.",
    health: "Safe for most people; those with soy allergies should avoid.",
  },
  {
    name: "High-Fructose Corn Syrup",
    description: "A sweetener made from corn starch that has been processed to convert some of its glucose into fructose.",
    health: "May contribute to obesity and metabolic disorders when consumed in excess.",
  },
  {
    name: "Sodium Nitrite",
    description: "An additive used to preserve color and prevent bacterial growth in processed meats.",
    health: "Can form carcinogenic compounds when heated; limit intake.",
  },
  {
    name: "Aspartame",
    description: "An artificial non-saccharide sweetener used as a sugar substitute in food and beverages.",
    health: "Safe for most people in moderation; those with phenylketonuria (PKU) should avoid it.",
  },
  {
    name: "Guar Gum",
    description: "A fiber from the seed of the guar plant, used as a thickener in foods.",
    health: "Generally safe but can cause digestive upset in large quantities.",
  },
  {
    name: "Potassium Sorbate",
    description: "A preservative used to inhibit molds and yeasts in foods like cheese and baked goods.",
    health: "Considered safe; rarely causes allergic reactions.",
  },
  {
    name: "Carrageenan",
    description: "A thickening agent extracted from red seaweed, commonly used in dairy and meat products.",
    health: "Safe for most, but some people report digestive issues.",
  },
  {
    name: "Gelatin",
    description: "A protein obtained by boiling skin, tendons, ligaments, and bones with water. Used as a gelling agent.",
    health: "Not suitable for vegetarians/vegans; generally recognized as safe.",
  },
  {
    name: "Citric Acid",
    description: "A weak organic acid found in citrus fruits, used as a preservative and flavor enhancer.",
    health: "Generally recognized as safe; overconsumption may cause digestive upset in sensitive individuals.",
  },
  {
    name: "BHA (Butylated Hydroxyanisole)",
    description: "A synthetic antioxidant used to prevent fats from becoming rancid in processed foods.",
    health: "Potential carcinogen in high doses; regulated and generally considered safe at approved levels.",
  },
  {
    name: "Xanthan Gum",
    description: "A polysaccharide used as a food thickening and stabilizing agent.",
    health: "Safe for most, but may cause intestinal gas or bloating in large amounts.",
  },
  {
    name: "Casein",
    description: "A family of related phosphoproteins commonly found in mammalian milk, used as a food additive.",
    health: "Safe for most; avoid if lactose intolerant or allergic to milk.",
  },
  {
    name: "Maltodextrin",
    description: "A polysaccharide used as a food additive for thickening or as a filler.",
    health: "Generally recognized as safe, but can impact blood sugar levels.",
  },
  {
    name: "Artificial Sweeteners",
    description: "Chemicals used to replace sugar in food; may confuse the body's sugar response and alter gut bacteria over time.",
    health: "Diabetics (some types), kids, and pregnant women should use with caution.",
  },
  {
    name: "Preservatives",
    description: "Compounds used to increase shelf life; can cause allergies, breathing issues, or affect immunity in sensitive people.",
    health: "Kids, asthma patients, and people with skin problems should use cautiously.",
  },
  {
    name: "Food Colorings (E102, E110, etc.)",
    description: "Synthetic or natural dyes added for color. Some are linked to hyperactivity, allergies, and cancer risk in studies.",
    health: "Children and individuals with allergies should avoid certain food dyes.",
  },
  {
    name: "Artificial Flavorings",
    description: "Lab-made compounds to imitate or enhance flavor, sometimes causing hormonal disturbance or taste addiction.",
    health: "Kids and health-conscious individuals should reduce use.",
  },
  {
    name: "Stabilizers/Thickeners (E412, E407)",
    description: "Help maintain food texture; can upset digestion or cause bloating with regular, high use.",
    health: "IBS and gut-sensitive people should consume in moderation.",
  },
  {
    name: "Emulsifiers (E322, E475)",
    description: "Aid mixing of fats and water; with long-term excess can impact gut lining and absorption.",
    health: "Everyone should limit excess intake.",
  },
  {
    name: "Refined Flour / Maida",
    description: "Fine, white flour stripped of fiber and nutrition; causes quick sugar spikes.",
    health: "Diabetics, PCOS, and people with obesity should restrict use.",
  },
  {
    name: "Milk Solids / Casein / Whey",
    description: "Protein sources from milk; may provoke acne, gas, or bloating in lactose-intolerant or sensitive people.",
    health: "Lactose intolerance and acne-prone people should moderate use.",
  },
  {
    name: "Baking Soda (E500)",
    description: "Used for leavening; excess can cause gastric discomfort or acid/base imbalance.",
    health: "People with acidity, kidney, or electrolyte issues should moderate use.",
  },
  {
    name: "Synthetic Vinegar",
    description: "Strongly acidic flavoring; can irritate stomach or teeth enamel if overused.",
    health: "Avoid high use if you have ulcers or gastritis.",
  },
  {
    name: "Yeast Extract",
    description: "Savory flavor enhancer; may include natural MSG compounds.",
    health: "People sensitive to MSG or with migraines should be cautious.",
  },
  {
    name: "Acidity Regulators (Citric Acid)",
    description: "Maintain proper pH; may trigger reflux or ulcers in sensitive people.",
    health: "Gastritis and acid reflux patients should minimize use.",
  },
  {
    name: "Dextrose / Invert Sugar / Sorbitol",
    description: "Forms of sugar and sweeteners; quickly affect blood sugar and insulin levels.",
    health: "Diabetics and weight watchers beware of high amounts.",
  },
  {
    name: "Rice Bran Oil",
    description: "Healthy vegetable oil but high intake of any oil increases calories excessively.",
    health: "Generally safe, but keep fat intake moderate.",
  },
  {
    name: "Ajinomoto (MSG)",
    description: "Flavor enhancer (monosodium glutamate); can trigger headaches or weakness in some people.",
    health: "MSG-sensitive individuals and children should avoid large quantities.",
  },
  {
    name: "Black Salt",
    description: "Salty spice rich in minerals; too much adds to sodium overconsumption.",
    health: "People with high blood pressure should use with caution.",
  },
  {
    name: "Asafoetida (Hing)",
    description: "Used for flavor and digestion; helps some, may bloat sensitive stomachs.",
    health: "Use carefully if you suffer from gas or IBS.",
  },
  {
    name: "Tamarind Extract",
    description: "Sour pulp for tangy flavor; can worsen acid reflux or ulcers in excess.",
    health: "Acid reflux patients avoid excess.",
  },
  {
    name: "Curry Leaves Powder",
    description: "Natural, nutritious, and good for hair or digestion.",
    health: "Generally safe for all.",
  },
  {
    name: "Sorbic Acid (Preservative)",
    description: "Synthetic preservative sometimes causing mild irritation.",
    health: "Sensitive individuals may react; safe for most.",
  },
  {
    name: "Sodium Nitrite (E250)",
    description: "Preserves processed meats; long-term use linked to increased cancer risk.",
    health: "All people should limit intake of nitrite-cured meats.",
  },
  {
    name: "Tartaric Acid (E334)",
    description: "Adds sourness to foods and drinks; excess can upset digestion.",
    health: "People with IBS or acidity avoid excess.",
  },
  {
    name: "Lactic Acid (E270)",
    description: "Naturally occurring; too much can irritate sensitive stomachs.",
    health: "Those with ulcers or sensitive guts beware overuse.",
  },
  {
    name: "Cocoa Solids",
    description: "Used in chocolate; rich in antioxidants but high oxalates can cause kidney stones if overconsumed.",
    health: "Kidney stone-prone individuals should avoid excess.",
  },
  {
    name: "Barley Malt",
    description: "Natural sweetener containing gluten; can be hard to digest for some.",
    health: "Gluten-sensitive and celiac patients avoid.",
  },
  {
    name: "Chicory Root Extract",
    description: "High-fiber additive; good for digestion but may cause gas in sensitive people.",
    health: "IBS or gas-prone people should use in moderation.",
  },
  {
    name: "Cheese Powder / Butter Powder",
    description: "Salty, fatty powders used for flavoring; contain high salt and saturated fat.",
    health: "Obese people and heart patients should restrict intake.",
  },
  {
    name: "Paprika / Beetroot Extract",
    description: "Natural food colors rich in antioxidants.",
    health: "Safe for all; good color and nutrition source.",
  },
  {
    name: "Polyglycerol Esters (E475)",
    description: "Synthetic emulsifier used in processed foods; no nutrition but adds texture.",
    health: "Best limited by all, especially those avoiding processed foods.",
  },
  {
    name: "Sodium Metabisulphite (E223)",
    description: "Preservative possibly triggering asthma or breathing issues in sensitive people.",
    health: "Asthma patients and kids avoid where possible.",
  },
  {
    name: "Propylene Glycol (E1520)",
    description: "Moisturizer for food; can cause skin and gut irritation in high doses.",
    health: "Allergy-prone people use with care.",
  },
  {
    name: "Soy Lecithin",
    description: "Common emulsifier, allergenic for some and may mildly affect hormones.",
    health: "Avoid if allergic to soy or have hormonal imbalance.",
  },
  {
    name: "Ammonium Bicarbonate",
    description: "Baking ingredient; safe but excessive intake is harsh on digestion.",
    health: "Avoid high intake for best gut health.",
  },
  {
    name: "Tamarind Seed Polysaccharide",
    description: "Natural thickener that aids digestion and food texture.",
    health: "Safe for all as a natural additive.",
  },
  {
    name: "Spices (Chili, Turmeric, etc.)",
    description: "Add flavor and have anti-inflammatory properties; excess chili can cause ulcers or burning.",
    health: "Safe in moderation; restrict if you have sensitive stomach.",
  },
  {
    name: "Onion/Garlic/Tomato Powder",
    description: "Flavor-boosting powders that may cause gas or acidity in some individuals.",
    health: "GERD, acidity, or IBS patients should limit.",
  },
  {
    name: "Gram Flour (Besan)",
    description: "High-protein flour made from ground chickpeas; nutritious but heavy to digest for some.",
    health: "Safe for most, but those with gastric trouble might limit consumption.",
  },
];

const IngredientsPage = () => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<null | typeof INGREDIENTS_DB[0]>(null);

  const filtered = INGREDIENTS_DB.filter(i =>
    i.name.toLowerCase().includes(query.toLowerCase()) ||
    i.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center mt-16 text-center px-4">
      <h2 className="text-3xl font-semibold text-green-700 mb-4">Ingredient Database</h2>
      <input
        className="border px-3 py-2 rounded w-full max-w-md mb-5"
        type="text"
        placeholder="Search ingredients..."
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          setSelected(null);
        }}
      />
      {selected ? (
        <div className="bg-white rounded-md shadow-lg p-6 max-w-xl w-full text-left">
          <button className="mb-2 text-blue-600 underline text-sm" onClick={() => setSelected(null)}>&larr; Back to results</button>
          <h3 className="text-2xl font-bold mb-2">{selected.name}</h3>
          <p className="mb-2">{selected.description}</p>
          <div className="rounded bg-orange-100 p-3"><span className="font-semibold">Health Note:</span> {selected.health}</div>
        </div>
      ) : (
        <div className="w-full max-w-2xl">
          {filtered.length === 0 ? (
            <div className="text-gray-500">No results found.</div>
          ) : (
            <ul className="divide-y divide-gray-200 bg-white rounded-md shadow w-full">
              {filtered.map(i => (
                <li key={i.name} className="p-4 text-left hover:bg-green-50 cursor-pointer" onClick={() => setSelected(i)}>
                  <div className="font-semibold text-lg">{i.name}</div>
                  <div className="text-gray-600 text-sm truncate">{i.description}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default IngredientsPage;
