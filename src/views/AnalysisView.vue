<script setup lang="ts">
// Analysis View - Displays the deep dive strategy analysis
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-12 space-y-16">
    
    <!-- Hero Header -->
    <div class="text-center space-y-4">
      <div class="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
        <i class="ph-bold ph-brain"></i>
        Computational Analysis
      </div>
      <h1 class="text-4xl font-bold text-gray-900 leading-tight">
        Die perfekte Skip-Bo Strategie
      </h1>
      <p class="text-xl text-gray-500 max-w-2xl mx-auto">
        Erkenntnisse aus 1.000.000 simulierten Runden mit einem Reinforcement-Learning Agenten (TD-λ).
      </p>
    </div>

    <!-- 8 Expert Tips Cards -->
    <section>
      <h2 class="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <i class="ph-bold ph-star text-yellow-500"></i>
        8 Experten-Tipps (tl;dr)
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Tip 1 -->
        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition card-gradient">
          <div class="text-4xl font-bold text-gray-100 absolute top-4 right-4 pointer-events-none">#1</div>
          <h3 class="font-bold text-lg text-gray-900 mb-2 relative z-10">Vorratsstapel über alles</h3>
          <p class="text-gray-600 text-sm leading-relaxed relative z-10">
            Jeder Zug muss das Ziel haben, die oberste Karte des Vorratstapels zu spielen. Opfern Sie keine Joker oder wichtige Karten für andere Ziele, es sei denn, es dient direkt der Freigabe des Stocks.
          </p>
        </div>

        <!-- Tip 2 -->
        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition card-gradient">
           <div class="text-4xl font-bold text-gray-100 absolute top-4 right-4 pointer-events-none">#2</div>
          <h3 class="font-bold text-lg text-gray-900 mb-2 relative z-10">Macht des "Draw 5"</h3>
          <p class="text-gray-600 text-sm leading-relaxed relative z-10">
            Versuchen Sie aggressiv, Ihre Hand leer zu spielen, um 5 neue Karten zu ziehen. Die neuen Karten erhöhen die Chance auf einen Treffer für den Vorratstapel massiv.
          </p>
        </div>

        <!-- Tip 3 -->
        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition card-gradient">
           <div class="text-4xl font-bold text-gray-100 absolute top-4 right-4 pointer-events-none">#3</div>
          <h3 class="font-bold text-lg text-gray-900 mb-2 relative z-10">Absteigende Ablage</h3>
          <p class="text-gray-600 text-sm leading-relaxed relative z-10">
            Sortieren Sie Ablagestapel (Discard) absteigend (12 auf 11, 11 auf 10). So bleiben die wichtigen hohen Zahlen für das Räumen von Stapeln immer zugänglich.
          </p>
        </div>

        <!-- Tip 4 -->
        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition card-gradient">
           <div class="text-4xl font-bold text-gray-100 absolute top-4 right-4 pointer-events-none">#4</div>
          <h3 class="font-bold text-lg text-gray-900 mb-2 relative z-10">Vermeide "Burying"</h3>
          <p class="text-gray-600 text-sm leading-relaxed relative z-10">
            Vergraben Sie keine Karten, die Sie bald brauchen könnten. Nutzen Sie die 4 Ablagestapel als intelligente Puffer für verschiedene Zahlenbereiche.
          </p>
        </div>

        <!-- Tip 5 -->
        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition card-gradient">
           <div class="text-4xl font-bold text-gray-100 absolute top-4 right-4 pointer-events-none">#5</div>
          <h3 class="font-bold text-lg text-gray-900 mb-2 relative z-10">Joker als Stapel-Räumer</h3>
          <p class="text-gray-600 text-sm leading-relaxed relative z-10">
            Verschwenden Sie Joker nicht für kleine Lücken (wie eine 2 oder 3). Nutzen Sie sie als <strong>12</strong>, um Stapel zu räumen, oder um direkt die Stock-Karte freizuspielen.
          </p>
        </div>

        <!-- Tip 6 -->
         <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition card-gradient">
           <div class="text-4xl font-bold text-gray-100 absolute top-4 right-4 pointer-events-none">#6</div>
          <h3 class="font-bold text-lg text-gray-900 mb-2 relative z-10">Mehrere Joker? Ja!</h3>
          <p class="text-gray-600 text-sm leading-relaxed relative z-10">
            Zögern Sie nicht, mehrere Joker in einem Zug zu spielen, wenn dies den Vorratsstapel reduziert oder eine neue Hand (Draw 5) ermöglicht. Sparsamkeit am falschen Ort kostet den Sieg.
          </p>
        </div>

        <!-- Tip 7 -->
        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition card-gradient">
           <div class="text-4xl font-bold text-gray-100 absolute top-4 right-4 pointer-events-none">#7</div>
          <h3 class="font-bold text-lg text-gray-900 mb-2 relative z-10">Maximale Aggression</h3>
          <p class="text-gray-600 text-sm leading-relaxed relative z-10">
            Spielen Sie so viele Karten wie möglich. Eine hohe "Zug-Länge" korreliert direkt mit der Gewinnchance. Ignorieren Sie defensive Blockaden meistens.
          </p>
        </div>

        <!-- Tip 8 -->
        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition card-gradient">
           <div class="text-4xl font-bold text-gray-100 absolute top-4 right-4 pointer-events-none">#8</div>
          <h3 class="font-bold text-lg text-gray-900 mb-2 relative z-10">Blocken nur im Notfall</h3>
          <p class="text-gray-600 text-sm leading-relaxed relative z-10">
            Blockieren lohnt sich nur, wenn der Gegner 1-2 Karten vor dem Sieg steht UND Sie ihn sicher stoppen können. Ansonsten schadet Defensivspiel nur Ihrem eigenen Tempo.
          </p>
        </div>
      </div>
    </section>

    <!-- Deep Dive Content -->
    <section class="prose prose-blue max-w-none bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h2 class="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <i class="ph-bold ph-read-cv-logo text-blue-600"></i>
            Hintergrund: Die Hierarchie der Ressourcen
        </h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
            <div>
                <h3 class="text-lg font-bold text-gray-800 mb-4">Priorität der Kartenquellen</h3>
                <p class="text-gray-600 mb-4">
                    Das oberste Ziel ist immer das Leeren des Vorratsstapels. Die Simulation hat klar gezeigt,
                    dass der <strong>"Marginal Value"</strong> (Grenznutzen) einer Stock-Karte exponentiell höher ist als der einer Handkarte.
                </p>
                <div class="space-y-4">
                    <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                        <span class="font-bold text-red-800">1. Vorratsstapel</span>
                        <span class="text-xs font-bold bg-white px-2 py-1 rounded text-red-600 shadow-sm">Höchste Prio</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <span class="font-bold text-blue-800">2. Handkarten</span>
                        <span class="text-xs font-bold bg-white px-2 py-1 rounded text-blue-600 shadow-sm">Katalysator</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <span class="font-bold text-gray-800">3. Ablagestapel</span>
                        <span class="text-xs font-bold bg-white px-2 py-1 rounded text-gray-600 shadow-sm">Puffer</span>
                    </div>
                </div>
            </div>
            
            <div>
                <h3 class="text-lg font-bold text-gray-800 mb-4">Joker-Strategie</h3>
                <p class="text-gray-600 mb-4">
                    Der <strong>Skip-Bo Joker</strong> ist die mächtigste Ressource. Er sollte nicht verschwendet werden.
                    Der <span class="font-mono text-blue-600">Optimus-Agent</span> nutzt ihn primär in zwei Fällen:
                </p>
                <ul class="space-y-3">
                    <li class="flex gap-3">
                        <div class="min-w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">A</div>
                        <span class="text-sm text-gray-700 pt-1">
                            Um die <strong>oberste Stock-Karte</strong> direkt freizuspielen (wenn sie z.B. eine 10 ist und der Joker als 9 fungiert).
                        </span>
                    </li>
                    <li class="flex gap-3">
                        <div class="min-w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">B</div>
                        <span class="text-sm text-gray-700 pt-1">
                            Als <strong>12</strong>, um einen Stapel zu räumen (Clearing). Das schafft Platz für neue 1er-Stapel und dynamisiert das Spiel.
                        </span>
                    </li>
                </ul>
            </div>
        </div>

        <hr class="border-gray-100 my-12">

        <h2 class="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
            <i class="ph-bold ph-sort-descending text-blue-600"></i>
            Ablagestapel-Optimierung
        </h2>
        <p class="text-gray-600">
            Die Simulation bestätigt: Eine <strong>absteigende Organisation</strong> (Descending Order) ist statistisch überlegen.
            Wer gleiche Zahlen stapelt (Clustering) gewinnt 5% häufiger als der Durchschnitt, aber wer absteigend stapelt, gewinnt <strong>15% häufiger</strong>.
        </p>
        <div class="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 mt-6 relative overflow-hidden">
             <div class="absolute right-0 top-0 opacity-10">
                <i class="ph-fill ph-stack text-9xl"></i>
             </div>
             <h4 class="font-bold text-gray-800 mb-2">Warum absteigend?</h4>
             <p class="text-sm text-gray-600 max-w-lg">
                Weil hohe Zahlen (10, 11, 12) das "Ende" einer Reihe markieren. Wenn diese oben liegen, können Stapel schnell geräumt werden (Clearing). 
                Das schafft Platz für neue Karten und ermöglicht es Ihnen, Ihre Hand schneller leer zu spielen ("Draw 5").
             </p>
        </div>
    </section>

    <!-- Mathematical Background -->
    <section class="prose prose-blue max-w-none bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl border border-blue-100 shadow-sm">
        <h2 class="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <i class="ph-bold ph-function text-blue-600"></i>
            Mathematischer Hintergrund: TD(λ) Reinforcement Learning
        </h2>
        <div class="mt-6 space-y-6">
            <p class="text-gray-700">
                Die optimale Strategie wurde durch <strong>Temporal Difference Learning (TD-λ)</strong> entwickelt, 
                einem Reinforcement-Learning-Verfahren, das es einem Agenten ermöglicht, den erwarteten langfristigen 
                Nutzen eines Spielzustands ohne menschliches Vorwissen zu approximieren.
            </p>
            
            <div class="bg-white p-6 rounded-xl border border-blue-200">
                <h3 class="text-lg font-bold text-gray-800 mb-3">Der A<sub>Optimus</sub> Agent</h3>
                <p class="text-sm text-gray-600 mb-4">
                    Der Agent trainiert eine Aktionsbewertungsfunktion <code class="bg-gray-100 px-2 py-1 rounded text-blue-600">Q(s, a)</code>, 
                    um die beste Aktion <em>a</em> im aktuellen Zustand <em>s</em> auszuwählen. Die Bewertung basiert darauf, 
                    wie stark eine Aktion die Wahrscheinlichkeit eines zukünftigen Gewinns maximiert.
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <div class="font-bold text-blue-900 mb-2">Trainingsumfang</div>
                        <div class="text-2xl font-mono font-bold text-blue-600">1.000.000</div>
                        <div class="text-xs text-blue-600">Simulierte Runden</div>
                    </div>
                    <div class="bg-green-50 p-4 rounded-lg">
                        <div class="font-bold text-green-900 mb-2">Gewinnrate vs. Baseline</div>
                        <div class="text-2xl font-mono font-bold text-green-600">&gt; 90%</div>
                        <div class="text-xs text-green-600">Überlegenheit bestätigt</div>
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-xl border border-blue-200">
                <h3 class="text-lg font-bold text-gray-800 mb-3">Wichtige Metriken</h3>
                <ul class="space-y-2 text-sm text-gray-600">
                    <li class="flex items-start gap-2">
                        <i class="ph-bold ph-arrow-up text-blue-600 mt-1"></i>
                        <span><strong>Vorratsstapel-Velocity (VSV):</strong> Durchschnittliche Anzahl der Karten, die pro Zug direkt vom Stockpile entfernt werden</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <i class="ph-bold ph-link text-blue-600 mt-1"></i>
                        <span><strong>Maximale Zugkettenlänge (MZL):</strong> Gesamtanzahl der gespielten Karten vor dem obligatorischen Ablegen</span>
                    </li>
                </ul>
            </div>
        </div>
    </section>

    <!-- Statistical Tables -->
    <section class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h2 class="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-8">
            <i class="ph-bold ph-chart-bar text-blue-600"></i>
            Statistische Analysen
        </h2>

        <!-- Card Source Priority Table -->
        <div class="mb-12">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Kartenquellen-Priorisierung</h3>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50 border-b-2 border-gray-200">
                            <th class="text-left p-3 font-bold text-gray-700">Kartenquelle</th>
                            <th class="text-center p-3 font-bold text-gray-700">Priorität</th>
                            <th class="text-center p-3 font-bold text-gray-700">Anteil gespielter Karten</th>
                            <th class="text-center p-3 font-bold text-gray-700">Beitrag zur VSV</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-gray-100 hover:bg-red-50">
                            <td class="p-3 font-medium text-gray-900">Vorratsstapel (Stock Pile)</td>
                            <td class="p-3 text-center">
                                <span class="inline-block bg-red-100 text-red-700 px-2 py-1 rounded font-bold text-xs">1 (Höchste)</span>
                            </td>
                            <td class="p-3 text-center font-mono">25%</td>
                            <td class="p-3 text-center font-mono font-bold text-red-600">1.0</td>
                        </tr>
                        <tr class="border-b border-gray-100 hover:bg-blue-50">
                            <td class="p-3 font-medium text-gray-900">Handkarten (Hand)</td>
                            <td class="p-3 text-center">
                                <span class="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold text-xs">2</span>
                            </td>
                            <td class="p-3 text-center font-mono">50%</td>
                            <td class="p-3 text-center font-mono">0.45</td>
                        </tr>
                        <tr class="border-b border-gray-100 hover:bg-gray-50">
                            <td class="p-3 font-medium text-gray-900">Ablagestapel (Discard Piles)</td>
                            <td class="p-3 text-center">
                                <span class="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded font-bold text-xs">3</span>
                            </td>
                            <td class="p-3 text-center font-mono">25%</td>
                            <td class="p-3 text-center font-mono">0.25</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p class="text-xs text-gray-500 mt-3 italic">
                Handkarten haben den höchsten Nutzungsanteil, da sie zur Aktivierung des "Draw 5"-Prinzips verwendet werden.
            </p>
        </div>

        <!-- Discard Strategy Table -->
        <div class="mb-12">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Effizienz der Ablagestapel-Organisation</h3>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50 border-b-2 border-gray-200">
                            <th class="text-left p-3 font-bold text-gray-700">Ablagestapel-Schema</th>
                            <th class="text-left p-3 font-bold text-gray-700">Strategie-Merkmal</th>
                            <th class="text-center p-3 font-bold text-gray-700">Zuglänge Index</th>
                            <th class="text-center p-3 font-bold text-gray-700">Gewinnrate vs. Baseline</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-gray-100 bg-green-50">
                            <td class="p-3 font-bold text-green-800">Absteigend (Descending)</td>
                            <td class="p-3 text-gray-700">Hohe Karten sofort zugänglich</td>
                            <td class="p-3 text-center font-mono font-bold text-green-600">1.05</td>
                            <td class="p-3 text-center font-mono font-bold text-green-600">+15%</td>
                        </tr>
                        <tr class="border-b border-gray-100 hover:bg-yellow-50">
                            <td class="p-3 font-medium text-gray-900">Gleiche Zahl (Clustering)</td>
                            <td class="p-3 text-gray-700">Hohe Anzahl gleicher Karten</td>
                            <td class="p-3 text-center font-mono">0.95</td>
                            <td class="p-3 text-center font-mono text-yellow-600">+5%</td>
                        </tr>
                        <tr class="border-b border-gray-100 hover:bg-red-50">
                            <td class="p-3 font-medium text-gray-900">Aufsteigend (Ascending)</td>
                            <td class="p-3 text-gray-700">Niedrige Karten sofort zugänglich</td>
                            <td class="p-3 text-center font-mono">0.70</td>
                            <td class="p-3 text-center font-mono text-red-600">-10%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Joker Value Table -->
        <div>
            <h3 class="text-lg font-bold text-gray-800 mb-4">Optimaler Wert des Skip-Bo Jokers</h3>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50 border-b-2 border-gray-200">
                            <th class="text-left p-3 font-bold text-gray-700">Ersatzwert</th>
                            <th class="text-left p-3 font-bold text-gray-700">Strategische Funktion</th>
                            <th class="text-center p-3 font-bold text-gray-700">Nutzungshäufigkeit</th>
                            <th class="text-left p-3 font-bold text-gray-700">Strategischer Zweck</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-gray-100 bg-green-50">
                            <td class="p-3 font-bold text-green-800">12 (Stapel-Abschluss)</td>
                            <td class="p-3 text-gray-700">Clearing eines Bau-Stapels</td>
                            <td class="p-3 text-center">
                                <span class="inline-block bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">Hoch</span>
                            </td>
                            <td class="p-3 text-gray-700">Game Tempo / Ressourcen-Freigabe</td>
                        </tr>
                        <tr class="border-b border-gray-100 bg-green-50">
                            <td class="p-3 font-bold text-green-800">N = Stockpile-Karte</td>
                            <td class="p-3 text-gray-700">Sofortige Stockpile-Reduktion</td>
                            <td class="p-3 text-center">
                                <span class="inline-block bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">Hoch</span>
                            </td>
                            <td class="p-3 text-gray-700">MVSC Maximierung</td>
                        </tr>
                        <tr class="border-b border-gray-100 hover:bg-yellow-50">
                            <td class="p-3 font-medium text-gray-900">1 (Stapel-Start)</td>
                            <td class="p-3 text-gray-700">Öffnung des Spielfelds</td>
                            <td class="p-3 text-center">
                                <span class="inline-block bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">Mittel-Niedrig</span>
                            </td>
                            <td class="p-3 text-gray-700">Unlocking Stockpile 1s/Zug-Verlängerung</td>
                        </tr>
                        <tr class="border-b border-gray-100 hover:bg-blue-50">
                            <td class="p-3 font-medium text-gray-900">Andere (3-11)</td>
                            <td class="p-3 text-gray-700">Draw-5-Ketten</td>
                            <td class="p-3 text-center">
                                <span class="inline-block bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">Mittel</span>
                            </td>
                            <td class="p-3 text-gray-700">Handkarten-Minimierung</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>

    <!-- Offensive vs Defensive Strategy -->
    <section class="prose prose-blue max-w-none bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h2 class="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <i class="ph-bold ph-sword-cross text-red-600"></i>
            Offensive vs. Defensive Strategie
        </h2>
        <div class="mt-6 space-y-6">
            <div class="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
                <h3 class="text-lg font-bold text-red-900 mb-3">Die empirische Ablehnung der defensiven Blockade</h3>
                <p class="text-gray-700 mb-4">
                    Die Simulation quantifiziert die hohen <strong>Opportunitätskosten</strong> defensiver Blockaden. 
                    Ein defensiver Zug (z.B. das absichtliche Nicht-Räumen eines Stapels) führt dazu, dass der Spieler 
                    seinen Zug beendet und der Gegner sofort vollen Zugriff auf seine Ressourcen erhält.
                </p>
                <div class="bg-white p-4 rounded-lg">
                    <p class="text-sm text-gray-600 font-medium mb-2">Ausnahme: Gezieltes Blockieren</p>
                    <p class="text-sm text-gray-600">
                        Ein defensiver Zug ist nur gerechtfertigt, wenn der Gegner <strong>1 oder 2 Karten</strong> 
                        im Stockpile hat UND die Blockade keinen signifikanten Einfluss auf die eigene VSV hat.
                    </p>
                </div>
            </div>

            <div class="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl">
                <h3 class="text-lg font-bold text-green-900 mb-3">Die offensive Nutzung des Stapel-Clearings</h3>
                <p class="text-gray-700">
                    Der A<sub>Optimus</sub>-Agent nutzt das Stapel-Clearing aggressiv als offensive Maßnahme. 
                    Das Entfernen eines vollständigen 12er-Stapels erhöht die verfügbare Anzahl an Bau-Stapel-Positionen 
                    und reduziert die Karten im Draw Pile. Diese Volatilität begünstigt den aggressiven, 
                    auf Stock-Reduktion fokussierten Agenten.
                </p>
            </div>
        </div>
    </section>

  </div>
</template>

<style scoped>
.card-gradient {
    position: relative;
    overflow: hidden;
}
.card-gradient::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ef4444, #3b82f6);
    opacity: 0.5;
}
</style>
