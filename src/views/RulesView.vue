<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="text-center mb-10">
      <h2 class="text-2xl font-bold text-gray-900">Offizielle Skip-Bo Spielregeln</h2>
      <p class="text-gray-500">Diese Regeln bilden die Grundlage für die statistische Analyse.</p>
    </div>

    <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-8 space-y-8">
      <section>
        <h3 class="text-xl font-bold text-red-600 mb-3 flex items-center gap-2">
          <i class="ph-bold ph-target text-2xl"></i> 1. Spielziel
        </h3>
        <p class="text-gray-700">Der Spieler, der als Erster alle Karten seines <strong>Spielerstapels
            (Stockpile)</strong> in aufsteigender Reihenfolge von 1 bis 12 auf die Baukartenstapel ablegt,
          gewinnt die Runde.</p>
        <p class="text-sm italic mt-2 text-gray-500">Die Simulation basiert auf einem Spiel zu zweit mit
          30 Karten im Spielerstapel.</p>
      </section>

      <hr class="border-gray-200">

      <section>
        <h3 class="text-xl font-bold text-red-600 mb-3 flex items-center gap-2">
          <i class="ph-bold ph-deck-of-cards text-2xl"></i> 2. Kartentypen & Setup
        </h3>
        <div class="space-y-4">
          <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <p class="font-semibold text-gray-800 mb-2">Karten-Zusammensetzung (162 Karten)</p>
            <ul class="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li><strong>144 Zahlenkarten:</strong> 1er bis 12er (jeweils 12 Stück).</li>
              <li><strong>18 Skip-Bo-Karten:</strong> Joker, die jede beliebige Zahl ersetzen können.</li>
            </ul>
          </div>

          <p class="font-semibold text-gray-800">Spielvorbereitung:</p>
          <ul class="list-disc list-inside text-gray-700 space-y-1 ml-4">
            <li>Jeder Spieler erhält seinen verdeckten <strong>Spielerstapel</strong> (30 Karten).</li>
            <li>Die oberste Karte des Spielerstapels wird aufgedeckt.</li>
            <li>Der Rest bildet den <strong>Ziehstapel</strong>.</li>
            <li>Es gibt Platz für bis zu <strong>vier Baukartenstapel</strong> in der Mitte.</li>
          </ul>
        </div>
      </section>

      <hr class="border-gray-200">

      <section>
        <h3 class="text-xl font-bold text-red-600 mb-3 flex items-center gap-2">
          <i class="ph-bold ph-sign-post text-2xl"></i> 3. Spielablauf
        </h3>

        <p class="text-gray-700 mb-4">Ein Zug läuft typischerweise wie folgt ab:</p>
        <ol class="list-decimal list-inside text-gray-700 space-y-3 ml-4">
          <li>
            <strong>Karten ziehen:</strong> Zu Beginn seines Zuges zieht der Spieler so viele Karten, dass er
            <strong>fünf Handkarten</strong> hat (sofern der Ziehstapel dies zulässt).
          </li>
          <li>
            <strong>Karten spielen:</strong> Der Spieler versucht, so viele Karten wie möglich zu spielen. Er
            kann Karten nutzen aus:
            <ul class="list-disc list-inside text-gray-600 space-y-1 mt-1 ml-4">
              <li>der Hand (alle 5 Karten sind verfügbar).</li>
              <li>dem <strong>obersten Spielerstapel</strong> (oberste Karte).</li>
              <li>den <strong>eigenen Ablagestapeln</strong> (nur die oberste Karte).</li>
            </ul>
          </li>
          <li>
            <strong>Baukartenstapel:</strong> Karten werden in aufsteigender Reihenfolge (1, 2, 3... bis 12) auf
            die vier Baukartenstapel in der Mitte gespielt. Eine 12 schließt den Stapel ab, dieser
            wird entfernt und ein neuer Stapel kann begonnen werden.
          </li>
          <li>
            <strong>Zug beenden:</strong> Der Zug endet, indem der Spieler <strong>eine</strong> Karte aus seiner Hand auf
            <strong>einen seiner maximal vier Ablagestapel</strong> legt.
          </li>
          <li>
            <strong>Sonderfall:</strong> Wird der Spielerstapel eines Spielers komplett abgebaut, zieht dieser
            <strong>sofort 5 neue Handkarten</strong> und darf weiterspielen (sofern er die Voraussetzungen
            erfüllt).
          </li>
        </ol>
      </section>

      <hr class="border-gray-200">

      <section>
        <h3 class="text-xl font-bold text-red-600 mb-3 flex items-center gap-2">
          <i class="ph-bold ph-diamond text-2xl"></i> 4. Skip-Bo-Karten (Joker)
        </h3>
        <p class="text-gray-700">Die Skip-Bo-Karte kann jede beliebige Zahl von 1 bis 12 ersetzen. Sie
          sind strategisch extrem wichtig, da sie Lücken füllen und den Abbau des Spielerstapels
          erleichtern können.</p>
        <div class="bg-red-50 p-4 rounded-lg border border-red-200 mt-4">
          <p class="font-bold text-red-800">Strategisches Kernelement der KI-Analyse:</p>
          <p class="text-sm text-red-700">Die KI (Spieler 1) nutzt Skip-Bo-Karten <strong>nur</strong>, wenn damit
            garantiert die oberste Karte des Spielerstapels gespielt werden kann oder ein Stapel
            beendet wird. Die Zufallsstrategie (Spieler 2) nutzt sie sofort bei der erstbesten
            Gelegenheit.</p>
        </div>
      </section>

    </div>
  </div>
</template>
