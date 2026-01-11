# Valda tekniker

## Översikt
- **HTML/CSS/JavaScript utan byggsteg** för att hålla allt enkelt och gratis.
- **GitHub Pages** för hosting med automatiska deploys vid push till `master`.
- **Statiska datafiler** (JSON) i varje resmålsmapp.

## Varför dessa val
- Lätt att underhålla och förstå.
- Inga externa beroenden.
- Snabb publicering via GitHub Actions.

## Struktur
- `index.html` är landningssidan.
- `trips/<resmål>/` innehåller resmålssida och datafiler.
- `specs/` innehåller krav och dokumentation.
