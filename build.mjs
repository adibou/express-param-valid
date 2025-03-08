import { build } from "esbuild";

const options = {
  entryPoints: ["src/index.ts"], // Fichier d'entrée
  bundle: true,                  // Créer un seul fichier
  sourcemap: true,                // Générer les fichiers .map
  minify: false,                   // Minifier (optionnel)
  splitting: false,                // Pas de splitting de modules
  platform: "node",
  target: ["esnext"]
};

const optionsCJS = { ...options, format: "cjs", outfile: "dist/index.cjs" };
const optionsESM = { ...options, format: "esm", outfile: "dist/index.js" };

await Promise.all([build(optionsESM), build(optionsCJS)]);

console.log("✅ Build terminé !");
