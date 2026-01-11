# Travels

Travels är en helt statisk reseplanerare för att samla, jämföra och dela resmål. Allt innehåll ligger i statiska filer och publiceras via GitHub Pages.

## Struktur

- `index.html` – landningssida med resmål.
- `assets/` – gemensam CSS och JavaScript.
- `trips/<resmål>/` – separata resmål med datafiler (t.ex. `places.json`).
- `specs/` – krav och valda tekniska beslut.

## Lokalt

Öppna `index.html` direkt i webbläsaren eller använd en enkel statisk server:

```bash
python -m http.server 8000
```

Besök sedan `http://localhost:8000`.

## Publicering

GitHub Actions publicerar automatiskt till GitHub Pages vid push till `master`.
