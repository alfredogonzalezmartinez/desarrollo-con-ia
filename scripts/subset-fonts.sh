#!/usr/bin/env bash
#
# Regenera los subconjuntos de IBM Plex que van embebidos en el deck.
#
# Por qué existe: el deck no depende de Google Fonts (las fuentes viajan dentro
# del HTML), pero tampoco necesita el alfabeto entero. Se recorta a los
# caracteres que el deck puede llegar a mostrar: IBM Plex completo son ~600 KB,
# recortado ~130 KB.
#
# Sólo hay que volver a ejecutarlo si el deck empieza a usar glifos nuevos
# (otro alfabeto, o símbolos que IBM Plex sí traiga).
#
# Requisitos:  pip3 install fonttools brotli
#
# Ojo: IBM Plex NO trae los glifos decorativos del estilo (❯ ● ▸ ① ✗).
# Esos se dibujan con CSS a propósito, para que no acaben en cuadraditos
# cuando el deck se abra en una máquina sin las fuentes del sistema.

set -euo pipefail

cd "$(dirname "$0")/.."
DEST="src/assets/fonts"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

# Caracteres que el deck puede mostrar: ASCII, latin-1 y latin extendido
# (castellano completo), puntuación tipográfica, flechas, ✓ y símbolos de
# comparación. Si el deck estrena algún carácter fuera de esto, cae a la
# fuente del sistema: añadirlo aquí y reejecutar.
UNICODES='U+0020-007E,U+00A0-00FF,U+0100-017F,U+2000-206F,U+20AC,U+2500-257F,U+2190-2193,U+2212,U+2248,U+2264-2265,U+2713'

echo "· Pidiendo IBM Plex a Google Fonts…"
curl -sf -H 'User-Agent: Mozilla/5.0 (Windows NT 6.1; rv:6.0) Gecko/20110814 Firefox/6.0' \
    'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700' \
    -o "$WORK/plex.css"

n=0
while read -r url; do
    n=$((n + 1))
    curl -sfL "$url" -o "$WORK/src-$n.woff"
done < <(grep -oE 'https://[^)]+' "$WORK/plex.css" | sort -u)

echo "· Recortando a los caracteres del deck…"
mkdir -p "$DEST"
for f in "$WORK"/src-*.woff; do
    name=$(python3 -c "
import sys
from fontTools.ttLib import TTFont
t = TTFont(sys.argv[1])
fam, sub = t['name'].getDebugName(1), t['name'].getDebugName(2)
print(fam.replace('IBM Plex ', 'IBMPlex') .replace(' ', '') + '-' + sub.replace(' ', '') + '.woff2')
" "$f")
    python3 -m fontTools.subset "$f" \
        --unicodes="$UNICODES" --flavor=woff2 --layout-features='*' \
        --no-hinting --desubroutinize --output-file="$DEST/$name"
    echo "  $name"
done

echo "· Listo. $(du -ch "$DEST"/*.woff2 | tail -1 | cut -f1) en $DEST"
