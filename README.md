# Scrabble AI (Browser)

A Scrabble-style game you can run locally in a browser with an AI opponent. Includes full Scrabble rules (anchors, adjacency, cross-words, blanks), drag-and-drop tiles, and zoom/pan on the board.

## Run locally

```bash
cd /Users/alind/Downloads/scrabble-ai
python3 -m http.server 8000
```

Open `http://localhost:8000` in your browser.

## Features

- Full Scrabble move validation (anchors, adjacency, cross-words, blanks)
- Drag-and-drop tiles between rack and board
- Board zoom (slider + mouse wheel) and pan (drag background)
- Adjustable AI difficulty
- Large dictionary (`words.js`) with prefix pruning for faster AI search

## Files

- `index.html`
- `styles.css`
- `app.js`
- `words.js`

## Notes

This is a simplified single-player experience (you vs AI). The AI uses an anchor-based search and dictionary prefix pruning to generate moves.
