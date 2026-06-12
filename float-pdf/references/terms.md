# Reify ApS standardvilkår (terms appendix)

Ready-to-paste markup for the standard-terms appendix of a Float proposal/offer.
These are **Reify ApS' standardvilkår §§ 1–12** in Danish, laid out across three
landscape-A4 pages using the `.page--terms` layout (2-column fine print) from
`assets/page.css`.

Usage:
- Append these pages after the signature page.
- Each terms page is `<section class="page page--terms">` with a `.terms-header`
  and a `.terms-columns` block. Remember the per-page logo lockup with **unique
  SVG ids** (`float-circle-5`, `float-grad-5`, …) and the footer-meta page number.
- The legal text below is the canonical wording — keep it verbatim unless the
  user explicitly asks to change a clause. If the engagement differs (e.g. fixed
  price vs. hourly), adjust §5 wording to match the offer, not the reverse.

> Tip: only the `.terms-columns` inner content changes between the three pages.
> The page shell, logo lockup, and footer-meta follow the same pattern as the
> other pages in `assets/page-template.html`.

---

## Page A — §§ 1–6 (header eyebrow "BILAG")

```html
<div class="terms-header">
  <span class="eyebrow">BILAG</span>
  <h2>Standardvilkår for projekter med <em class="accent">Reify ApS</em></h2>
  <p class="lede">Gældende for alle ydelser leveret af Konsulenten (Reify ApS) til Kunden, medmindre andet er udtrykkeligt aftalt skriftligt. §§ 1–6.</p>
</div>

<div class="terms-columns">
  <h3>1. Anvendelsesområde</h3>
  <p>1.1 Disse standardvilkår gælder for alle ydelser leveret af Konsulenten til Kunden, medmindre andet er udtrykkeligt aftalt skriftligt.</p>
  <p>1.2 Det specifikke arbejdsomfang, opgaver, tidsplan og leverancer (herefter "Opgaven") er defineret i den separate projektbeskrivelse, arbejdsbeskrivelse (Statement of Work) eller ordrebekræftelse sendt til Kunden.</p>

  <h3>2. Konsulentens rettigheder og pligter</h3>
  <p>2.1 Konsulenten udfører de aftalte opgaver professionelt og i overensstemmelse med denne aftale.</p>
  <p>2.2 Konsulenten forpligter sig til at handle loyalt og udelukkende varetage Kundens interesser.</p>
  <p>2.3 Konsulenten er frit stillet til at tilrettelægge og planlægge udførelsen af sine ydelser, herunder arbejdstider og arbejdssted. Konsulenten er ligeledes frit stillet til at bestemme, hvilke personer der skal udføre det praktiske arbejde.</p>
  <p>2.4 Disse vilkår begrænser ikke Konsulentens ret til at udføre ydelser for andre kunder eller opdragsgivere.</p>
  <p>2.5 Ved afslutning af Opgaven forpligter Konsulenten sig til at returnere alt materiale, der er overdraget af Kunden.</p>

  <h3>3. Kundens medvirken</h3>
  <p>3.1 Kunden forpligter sig til at stille menneskelige ressourcer, dokumentation, software, diagrammer, lokaler og andre nødvendige materialer til rådighed for konsulenten for at sikre optimale betingelser for løsning af Opgaven.</p>
  <p>3.2 Kunden forpligter sig til at give alle oplysninger om Kundens virksomhed, herunder tekniske, økonomiske og organisatoriske forhold, som Konsulenten har brug for til at løse Opgaven.</p>
  <p>3.3 Kunden udpeger en repræsentant med bemyndigelse til at indgå forpligtelser på Kundens vegne i relation til Konsulenten.</p>

  <h3>4. Rapportering</h3>
  <p>4.1 Parterne afholder statusmøder som angivet i projektbeskrivelsen eller som gensidigt aftalt.</p>
  <p>4.2 Medmindre andet er aftalt, rapporterer Konsulenten løbende om projektstatus og forbrugte timer.</p>

  <h3>5. Vederlag og betaling</h3>
  <p>5.1 Honoraret for Opgaven (hvad enten det er fast pris eller timebaseret) er angivet i projektbeskrivelsen.</p>
  <p>5.2 Udføres arbejdet på timebasis, faktureres Konsulentens honorar månedligt bagud eller som andet aftalt.</p>
  <p>5.3 Betaling af honorar inkluderer ikke Konsulentens udlæg eller ekstraordinære udgifter. "Udlæg" omfatter:</p>
  <p class="terms-sub">Udgifter i forbindelse med nødvendig og dokumenteret transport, rejser, overnatning og forplejning.</p>
  <p class="terms-sub">Udgifter i forbindelse med materialer, værktøjer, software, underleverandører, certificering mv., med forhåndsgodkendelse fra Kunden.</p>
  <p>5.4 Konsulentens honorar dækker ikke ekstraarbejde som følge af, at Kunden udvider omfanget af den oprindelige Opgave eller ændrer dens indhold.</p>
  <p>5.5 Fakturaer forfalder til betaling 8 dage fra fakturadatoen.</p>
  <p>5.6 Alle honorarer og refusionskrav er angivet eksklusive moms.</p>
  <p>5.7 Forfaldne beløb pålægges renter i henhold til gældende dansk lovgivning om morarenter. Manglende betaling betragtes som væsentlig misligholdelse, der berettiger Konsulenten til at standse arbejdet, indtil betaling er sket.</p>

  <h3>6. Immaterielle rettigheder</h3>
  <p>6.1 Medmindre andet er aftalt i projektbeskrivelsen, er Kunden berettiget til at anvende det materiale, der er produceret i forbindelse med Opgaven. Kunden har ejendomsretten til de producerede kopier/prøver og har ret til at anvende og ændre materialet til egne interne formål.</p>
  <p>6.2 Konsulenten bevarer alle rettigheder til sine idéer, opfindelser, knowhow og metoder og er berettiget til at anvende disse ved løsning af opgaver for andre kunder.</p>
  <p>6.3 Kunden er ansvarlig for at sikre eventuelle specifikke immaterielle rettigheder, der er nødvendige som følge af Opgaven, og for at sikre, at det ønskede arbejde ikke krænker tredjemands rettigheder.</p>
</div>
```

## Page B — §§ 7–10 (header eyebrow "BILAG · FORTSAT")

```html
<div class="terms-header">
  <span class="eyebrow">BILAG · FORTSAT</span>
  <h2>Standardvilkår <em class="accent">(fortsat)</em></h2>
  <p class="lede">§§ 7–10.</p>
</div>

<div class="terms-columns">
  <h3>7. Tidsplaner og forsinkelser</h3>
  <p>7.1 Hvis en specifik tidsplan er aftalt i projektbeskrivelsen, kan Konsulenten kræve forlængelse, hvis forsinkelser skyldes:</p>
  <p class="terms-sub">a) Kunden udvider omfanget eller ændrer indholdet af Opgaven.</p>
  <p class="terms-sub">b) Kunden undlader at stille nødvendige ressourcer eller oplysninger til rådighed i strid med punkt 3.</p>
  <p class="terms-sub">c) Forsinkelser fra andre rådgivere/leverandører, der forhindrer Konsulenten i at udføre sine opgaver.</p>
  <p class="terms-sub">d) Sygdom hos Konsulenten eller nøglepersoner.</p>
  <p class="terms-sub">e) Myndigheders manglende rettidig udstedelse af godkendelser/svar eller påbud.</p>
  <p class="terms-sub">f) Force majeure eller andre begivenheder uden for Konsulentens kontrol.</p>

  <h3>8. Ansvar</h3>
  <p>8.1 Konsulenten er ansvarlig for fejl og mangler i overensstemmelse med dansk erstatningsret, med de nedenstående begrænsninger.</p>
  <p>8.2 Konsulenten er ikke ansvarlig for driftstab, tabt fortjeneste eller andre indirekte tab.</p>
  <p>8.3 Konsulentens ansvar er begrænset til det samlede honorar for den pågældende Opgave (eller den pågældende fase af Opgaven, hvis den er opdelt i faser).</p>
  <p>8.4 Konsulenten er ikke ansvarlig for forsinkelser forårsaget af Kunden.</p>
  <p>8.5 Konsulentens ansvar ophører 2 år efter afslutningen af den Opgave, som fejlen eller manglen vedrører.</p>
  <p>8.6 Krav skal fremsættes skriftligt uden ugrundet ophold, efter at Kunden blev eller burde være blevet opmærksom på ansvarsgrundlaget.</p>

  <h3>9. Opsigelse</h3>
  <p>9.1 Aftalen vedrørende en specifik Opgave kan opsiges med én uges varsel af begge parter.</p>
  <p>9.2 Ved opsigelse er Konsulenten berettiget til honorar for udført arbejde frem til udløbet af opsigelsesvarslet.</p>
  <p>9.3 Begge parter kan opsige aftalen uden varsel i tilfælde af væsentlig misligholdelse fra den anden parts side.</p>

  <h3>10. Fortrolighed og ensidig fortrolighedsaftale (NDA)</h3>
  <p>10.1 Parterne er gensidigt forpligtet til at hemmeligholde alle oplysninger, der ikke er alment kendte, vedrørende den anden part. Denne forpligtelse gælder også for medarbejdere og eksterne rådgivere og består efter afslutningen af Opgaven.</p>
  <p>10.2 Konsulenten forpligter sig til at behandle alle oplysninger, data, dokumenter, forretningshemmeligheder, teknisk information, kundelister, økonomiske oplysninger og øvrigt materiale ("Fortrolige Oplysninger"), som Konsulenten modtager eller får adgang til i forbindelse med Opgaven, som strengt fortrolige.</p>
  <p>10.3 Konsulenten må udelukkende anvende Fortrolige Oplysninger til det formål, der er nødvendigt for at udføre Opgaven, og må ikke videregive disse til tredjemand uden Kundens forudgående skriftlige samtykke.</p>
  <p>10.4 Fortrolighedsforpligtelsen gælder ikke oplysninger, der:</p>
  <p class="terms-sub">a) Er eller bliver offentligt tilgængelige uden Konsulentens medvirken.</p>
  <p class="terms-sub">b) Allerede var i Konsulentens besiddelse før modtagelsen fra Kunden, dokumenteret skriftligt.</p>
  <p class="terms-sub">c) Er modtaget lovligt fra en tredjemand uden fortrolighedsforpligtelse.</p>
  <p class="terms-sub">d) Er udviklet selvstændigt af Konsulenten uden brug af Fortrolige Oplysninger.</p>
  <p class="terms-sub">e) Skal udleveres i henhold til lov, domstolsafgørelse eller myndighedspåbud, forudsat at Konsulenten underretter Kunden før sådan udlevering, såfremt det er lovligt muligt.</p>
  <p>10.5 Konsulenten forpligter sig til at sikre, at Konsulentens medarbejdere, underleverandører og samarbejdspartnere, der får adgang til Fortrolige Oplysninger, er underlagt tilsvarende fortrolighedsforpligtelser.</p>
  <p>10.6 Ved afslutning eller opsigelse af Opgaven skal Konsulenten returnere eller slette alle Fortrolige Oplysninger, herunder eventuelle kopier, medmindre opbevaring er påkrævet ved lov.</p>
  <p>10.7 Denne fortrolighedsforpligtelse består i 3 år efter afslutningen af Opgaven, uanset årsagen til ophør. For forretningshemmeligheder som defineret i lov om forretningshemmeligheder består forpligtelsen, så længe oplysningerne har karakter af forretningshemmeligheder.</p>
  <p>10.8 Ved brud på denne fortrolighedsforpligtelse er Konsulenten erstatningsansvarlig efter dansk rets almindelige regler. Kunden kan desuden kræve, at Konsulenten straks ophører med den pågældende adfærd.</p>
</div>
```

## Page C — §§ 11–12 (header eyebrow "BILAG · FORTSAT")

```html
<div class="terms-header">
  <span class="eyebrow">BILAG · FORTSAT</span>
  <h2>Standardvilkår <em class="accent">(fortsat)</em></h2>
  <p class="lede">§§ 11–12.</p>
</div>

<div class="terms-columns">
  <h3>11. Overdragelse</h3>
  <p>Ingen af parterne må overdrage rettigheder eller pligter i henhold til denne aftale til tredjemand uden den anden parts skriftlige samtykke. Sådant samtykke kan ikke nægtes uden saglig begrundelse.</p>

  <h3>12. Lovvalg og værneting</h3>
  <p>12.1 Disse vilkår er underlagt dansk ret.</p>
  <p>12.2 Enhver tvist i forbindelse med disse vilkår skal forsøges løst ved mediation gennem Mediationsinstituttet i overensstemmelse med dettes regler.</p>
  <p>12.3 Kan en løsning ikke opnås ved mediation, afgøres tvisten ved Københavns Byret.</p>
</div>
```
