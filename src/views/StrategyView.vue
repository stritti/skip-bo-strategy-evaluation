<script setup lang="ts">
// Strategy View - Explains the implemented AI behaviors
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Strategie-Profile</h2>
      <p class="text-gray-500 text-lg">Wie "denken" die Computerspieler?</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <!-- Optimiert (Blue) -->
      <div class="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-skipbo-blue/30 transition-all duration-300 relative overflow-hidden">
        <div class="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
           <i class="ph-fill ph-brain text-[120px] text-skipbo-blue transform rotate-12"></i>
        </div>
        
        <div class="w-16 h-16 bg-skipbo-blue/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <i class="ph-fill ph-brain text-3xl text-skipbo-blue"></i>
        </div>
        
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Optimiert</h3>
        <span class="inline-block bg-skipbo-blue/10 text-skipbo-blue text-xs font-bold px-2 py-1 rounded mb-4">Der Logiker</span>
        
        <p class="text-gray-600 mb-6 leading-relaxed">
          Diese Strategie versucht, das perfekte Spiel zu spielen. Sie analysiert alle Möglichkeiten und wählt den Zug, der den eigenen Stapel am effizientesten abbaut.
        </p>
        
        <div class="space-y-4">
          <div>
            <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <i class="ph-bold ph-check text-green-500"></i> Stärken
            </h4>
            <ul class="text-sm text-gray-600 space-y-1 ml-6 list-disc">
              <li>Priorisiert immer den Spielerstapel</li>
              <li>Baut Hilfsstapel intelligent auf (1, 2, 3...)</li>
              <li>Hält Joker nicht unnötig zurück</li>
            </ul>
          </div>
           <div>
            <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <i class="ph-bold ph-x text-red-500"></i> Schwächen
            </h4>
            <ul class="text-sm text-gray-600 space-y-1 ml-6 list-disc">
              <li>Berechenbar für menschliche Gegner</li>
              <li>Kann in Endlosschleifen geraten</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Zufall (Green) -->
      <div class="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-skipbo-green/30 transition-all duration-300 relative overflow-hidden">
        <div class="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
           <i class="ph-fill ph-dice-five text-[120px] text-skipbo-green transform -rotate-12"></i>
        </div>
        
        <div class="w-16 h-16 bg-skipbo-green/10 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-180 transition-transform duration-500 ease-in-out">
          <i class="ph-fill ph-dice-five text-3xl text-skipbo-green"></i>
        </div>
        
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Zufall</h3>
        <span class="inline-block bg-skipbo-green/10 text-skipbo-green text-xs font-bold px-2 py-1 rounded mb-4">Der Chaot</span>
        
        <p class="text-gray-600 mb-6 leading-relaxed">
          Reines Glück! Diese KI prüft alle erlaubten Züge und wählt blind einen davon aus. Sie hat keinen Plan und keine Erinnerung.
        </p>
        
        <div class="space-y-4">
          <div>
            <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <i class="ph-bold ph-check text-green-500"></i> Stärken
            </h4>
            <ul class="text-sm text-gray-600 space-y-1 ml-6 list-disc">
              <li>Unberechenbar</li>
              <li>Findet manchmal unkonventionelle Lösungen</li>
            </ul>
          </div>
           <div>
            <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <i class="ph-bold ph-x text-red-500"></i> Schwächen
            </h4>
            <ul class="text-sm text-gray-600 space-y-1 ml-6 list-disc">
              <li>Übersieht oft offensichtliche Siege</li>
              <li>Verschwendet Joker sinnlos</li>
              <li>Baut sich selbst zu</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Spontan (Red) -->
      <div class="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-skipbo-red/30 transition-all duration-300 relative overflow-hidden">
        <div class="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
           <i class="ph-fill ph-lightning text-[120px] text-skipbo-red transform rotate-6"></i>
        </div>
        
        <div class="w-16 h-16 bg-skipbo-red/10 rounded-2xl flex items-center justify-center mb-6 group-hover:animate-bounce">
          <i class="ph-fill ph-lightning text-3xl text-skipbo-red"></i>
        </div>
        
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Spontan</h3>
        <span class="inline-block bg-skipbo-red/10 text-skipbo-red text-xs font-bold px-2 py-1 rounded mb-4">Der Impulsive</span>
        
        <p class="text-gray-600 mb-6 leading-relaxed">
          Diese Strategie ist gierig. Sie spielt die allererste Karte, die sie legen KANN, sofort aus. Ohne Nachdenken, ohne Zögern.
        </p>
        
        <div class="space-y-4">
          <div>
            <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <i class="ph-bold ph-check text-green-500"></i> Stärken
            </h4>
            <ul class="text-sm text-gray-600 space-y-1 ml-6 list-disc">
              <li>Extrem schnell</li>
              <li>Aggressiver Spielstil</li>
              <li>Leert die Hand schnell (viele Karten nachziehen)</li>
            </ul>
          </div>
           <div>
            <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <i class="ph-bold ph-x text-red-500"></i> Schwächen
            </h4>
            <ul class="text-sm text-gray-600 space-y-1 ml-6 list-disc">
              <li>Spielt Joker an schlechten Stellen</li>
              <li>Blockiert eigene Gewinnchancen zugunsten kurzfristiger Züge</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
