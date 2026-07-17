# Palette de couleurs — Plan'it

Listing complet des couleurs utilisées dans le projet, avec leurs variantes clair/sombre.

⚠️ Ce listing est reconstitué à partir des fichiers de code partagés en conversation — il peut exister d'autres couleurs ponctuelles ailleurs dans le projet (formulaires, pages d'auth, etc.) non couvertes ici. Pour un listing garanti exhaustif, faire une recherche globale (`grep`) sur `bg-[#` et `text-[#` dans tout le codebase.

---

## 🎨 Couleurs de marque (logo, identité)

| Usage | Clair | Sombre |
|---|---|---|
| Teal (Plan) | `#4f9288` | `#5dcaa5` |
| Rose (**'it**) | `#c48aaa` | `#c48aaa` (identique) |
| Teal foncé | `#104e64` | — |

## 🖼️ Fonds

| Élément | Clair | Sombre |
|---|---|---|
| Fond de page | `#e6dabb` / `#ecece6` | `#161b27` |
| Fond des cartes | `#e6dabb` | `#1e2433` |

## 🔘 Boutons d'action (logique couleur = action)

| Action | Clair | Sombre |
|---|---|---|
| Modifier | `#4f9288` | `#3d7268` |
| Dupliquer | `#9b6581` | `#7a4f63` |
| Supprimer | rouge (`red-900` / `red-400`) | — |

## 🏷️ Badges de catégories d'événements (`getCategoryColor`)

| Couleur | Classe complète |
|---|---|
| Teal | `bg-[#4f9288] text-[#e6f4f1]` |
| Rose/mauve | `bg-[#9b6581] text-white` |
| Kaki | `bg-[#c8c4a0] text-[#104e64]` |
| Teal foncé | `bg-[#104e64] text-[#e6dabb]` |
| Bleu-gris | `bg-[#7a9e9f] text-white` |

*(mêmes teintes réutilisées pour `getCategoryBorder` en `border-l-[...]`)*

## 👤 Avatars des bénévoles inscrits (`colorsAvatar`, `userId % 5`)

| Couleur | Clair | Sombre |
|---|---|---|
| Teal | `bg-[#4f9288] text-[#e6f4f1]` | `bg-[#5dcaa5] text-[#04342c]` |
| Mauve | `bg-[#9b6581] text-white` | `bg-[#d99cb7] text-[#4b1528]` |
| Kaki | `bg-[#c8c4a0] text-[#104e64]` | `bg-[#e0dcc0] text-[#3a3624]` |
| Teal foncé | `bg-[#104e64] text-[#e6dabb]` | `bg-[#7fc7b6] text-[#04342c]` |
| Bleu-gris | `bg-[#7a9e9f] text-white` | `bg-[#a8c6c7] text-[#1c3536]` |

## 👥 Avatars bénévoles (section "Bénévole(s) inscrit(s)" — couleurs distinctes par rôle)

| Rôle | Avatar clair | Avatar sombre | Badge clair | Badge sombre |
|---|---|---|---|---|
| Admin | `#534AB7` | `#AFA9EC` | `#CECBF6` / texte `#3C3489` | `#3C3489` / texte `#CECBF6` |
| Bénévole | `#D85A30` | `#F0997B` | `#F5C4B3` / texte `#712B13` | `#712B13` / texte `#F5C4B3` |

## 📊 Jauge circulaire de remplissage (missions)

| État | Couleur |
|---|---|
| De la place | `#4f9288` |
| Presque complet (≥66%) | `#ffb84d` |
| Complet (100%) | `#ff4757` |
| Fond de la jauge | `#c8c4a0` |

## 📶 Barres de progression des créneaux

| État | Clair | Sombre |
|---|---|---|
| Places dispo | `bg-[#49B048]` | `bg-[#3ddc97]` |
| Presque complet | `bg-[#8a6a20]` | `bg-[#ffb84d]` |
| Complet | `bg-red-800` | `bg-[#ff4757]` |
| Fond de la barre | `bg-[#c8c4a0]` | `bg-[#3a4150]` |

## 🏷️ Autres badges vus dans le code

| Élément | Clair | Sombre |
|---|---|---|
| Durée événement ("X jours") | `bg-[#E1F5EE] text-[#085041]` | `bg-[#0d2e28] text-[#6ab5a8]` |
| Bandeau événement passé | `bg-amber-500 text-amber-950` | `bg-amber-600 text-white` |
| Stat "amber" (statistiques) | `bg-amber-100` | `bg-[#2a3547]` |

## ✍️ Textes

| Usage | Clair | Sombre |
|---|---|---|
| Texte principal | `#104e64` | `#e6dabb` |
| Texte secondaire/muted | `#5a7070` | `#a0a8a8` |
| Accent (nom mission, titres section) | `#9b6581` | — |