// Note: Ensure framer-motion is installed by running:
// npm install framer-motion
// or
// yarn add framer-motion
// This component assumes Tailwind CSS is configured in the project.

import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { motion } from "framer-motion";
import { useState } from "react";

const featureData = [
  {
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    title: "Allergen Detection",
    desc: "Instantly identify allergens with our advanced scanning technology.",
  },
  {
    img: "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1200&q=80",
    title: "Safe Substitutes",
    desc: "Find delicious, allergy-free alternatives for any risky ingredient.",
  },
  {
    img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80",
    title: "Nutrition Insights",
    desc: "Learn about ingredients and their impact on your health in real-time.",
  },
];

const HomePage = () => {
  const { user } = useAuth();
  const displayName = user?.displayName || user?.email?.split("@")[0] || "Explorer";
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-green-100 to-white text-gray-800"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <motion.div className="lg:w-1/2 text-center lg:text-left" variants={itemVariants}>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-green-900 leading-tight mb-6">
              Hello, <span className="text-green-600">{displayName}</span>!
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
              Your trusted companion for <span className="font-semibold text-green-600">smart food scanning</span>. Detect allergens, find safe alternatives, and eat with confidence.
            </p>
            <Link to="/scan">
              <motion.button
                className="bg-green-600 text-white font-semibold py-4 px-10 rounded-full shadow-lg hover:bg-green-700 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Scan Now
              </motion.button>
            </Link>
          </motion.div>
          <motion.div
            className="lg:w-1/2 relative"
            variants={itemVariants}
          >
            <img
              src="https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=1200&q=80"
              alt="Healthy meal"
              className="w-full h-80 object-cover rounded-2xl shadow-2xl"
            />
            <motion.div
              className="absolute -bottom-4 -right-4 bg-green-500 text-white p-4 rounded-xl shadow-lg"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="font-bold">100K+</span> Scans Completed
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Progress & Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-green-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-lg"
            variants={itemVariants}
            whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
          >
            <h2 className="text-2xl font-bold text-green-900 mb-6">Your Safety Score</h2>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl font-extrabold text-green-600">95%</span>
              <p className="text-gray-600">of your scans are allergen-free!</p>
            </div>
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "95%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </motion.div>
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-lg"
            variants={itemVariants}
            whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
          >
            <h2 className="text-2xl font-bold text-green-900 mb-6">Recent Scans</h2>
            <ul className="space-y-4">
              {[
                { name: "Oat Bar", status: "Safe", color: "text-green-600" },
                { name: "Peanut Snack", status: "Allergen", color: "text-red-600" },
                { name: "Almond Milk", status: "Safe", color: "text-green-600" },
              ].map((scan, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${scan.color.replace("text", "bg")}`} />
                  <span>{scan.name} - <span className={`font-semibold ${scan.color}`}>{scan.status}</span></span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <motion.div className="max-w-6xl mx-auto" variants={containerVariants}>
          <h2 className="text-4xl font-bold text-green-900 text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featureData.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
                variants={itemVariants}
                whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <motion.img
                  src={feature.img}
                  alt={feature.title}
                  className="w-full h-56 object-cover"
                  animate={{ scale: hoveredFeature === index ? 1.1 : 1 }}
                  transition={{ duration: 0.4 }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-green-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-green-600 text-white text-center">
        <motion.div className="max-w-3xl mx-auto" variants={itemVariants}>
          <h2 className="text-4xl font-bold mb-6">Ready to Eat Smarter?</h2>
          <p className="text-lg mb-8">Join thousands of users who trust our app to make safe food choices every day.</p>
          <Link to="/scan">
            <motion.button
              className="bg-white text-green-600 font-semibold py-4 px-10 rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default HomePage;