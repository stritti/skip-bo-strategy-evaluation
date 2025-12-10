<script setup lang="ts">
// About View
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      
      <!-- Header with Gradient -->
      <div class="bg-gradient-to-r from-skipbo-red to-skipbo-red/80 px-8 py-10 text-white relative overflow-hidden">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 opacity-20">
          <i class="ph-bold ph-robot text-[150px]"></i>
        </div>
        <h1 class="text-3xl font-bold mb-2 relative z-10">Über dieses Projekt</h1>
        <p class="text-red-100 text-lg relative z-10">Die Entstehungsgeschichte des Skip-Bo Analyst</p>
      </div>

      <div class="p-8 space-y-8">
        <!-- Origin Story -->
        <section class="space-y-4">
          <div class="flex items-start gap-4">
            <div class="bg-blue-50 p-3 rounded-xl">
              <i class="ph-fill ph-chat-teardrop-text text-2xl text-skipbo-blue"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Der Ursprung (September 2025)</h3>
              <p class="text-gray-600 leading-relaxed">
                Alles begann mit einem Chat-Dialog im September 2025. In einer Diskussion über Skip-Bo Strategien
                entstand die Idee, diese nicht nur theoretisch zu erörtern, sondern empirisch zu prüfen.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="bg-green-50 p-3 rounded-xl">
              <i class="ph-fill ph-paint-brush-broad text-2xl text-skipbo-green"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Die Canvas-Idee (Dezember 2025)</h3>
              <p class="text-gray-600 leading-relaxed">
                Im Dezember schlug Gemini vor, mittels der Canvas-Funktion eine initiale Simulation zu erstellen.
                Das Ergebnis dieser ersten Generation ist im Projekt als 
                <a href="https://github.com/stritti/skip-bo-strategy-evaluation/blob/main/SkipBo_Real_Simulation_App.html" 
                   target="_blank" class="hover:opacity-80 transition-opacity">
                  <code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800 border border-gray-200">
                    SkipBo_Real_Simulation_App.html
                    <i class="ph-bold ph-arrow-square-out inline-block ml-1 text-xs text-gray-400"></i>
                  </code>
                </a>
                hinterlegt.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="bg-purple-50 p-3 rounded-xl">
              <i class="ph-fill ph-sparkle text-2xl text-purple-600"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Pure Vibe Coding</h3>
              <p class="text-gray-600 leading-relaxed">
                Auf Basis dieser Datei wurde schließlich diese moderne Web-App erzeugt – und zwar vollständig 
                <strong>mit Antigravity</strong>.
              </p>
              <div class="mt-4 bg-purple-50 border border-purple-100 rounded-lg p-4">
                <p class="text-purple-900 font-medium italic">
                  "Komplett vibe coded – ohne manuellen Eingriff."
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Disclaimer -->
        <div class="border-t border-gray-100 pt-8 mt-8">
          <div class="flex items-center gap-3 text-gray-400 justify-center">
            <i class="ph-bold ph-warning-circle text-xl"></i>
            <span class="font-medium">Keine Garantie für die Korrektheit der Analysen :)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
