# L'Atelier des Liens

Site vitrine de **L'Atelier des Liens**, une association intergénérationnelle de Béning-lès-Saint-Avold (57800) qui crée du lien, favorise les échanges et valorise chaque génération.

**Site en ligne :** https://nougrr.github.io/atelier-des-liens/

## Contenu

| Fichier | Rôle |
| --- | --- |
| `index.html` | Page principale (accueil, association, activités, adhésion, contact) |
| `linktree.html` | Page qui regroupe tous les liens de l'association (cible du QR code) |
| `confidentialite.html` | Politique de confidentialité / RGPD |
| `404.html` | Page d'erreur |
| `styles.css` | Styles du site, responsive |
| `script.js` | Menu mobile et défilement vers les sections |
| `assets/` | Logo, formulaire d'adhésion (PDF et PNG), visuels |
| `tools/add_qr_to_pdf.py` | Ajoute un QR code vers `linktree.html` au formulaire d'adhésion |

Le site est en HTML, CSS et JavaScript, sans framework ni étape de build.

## Lancer le site en local

```bash
python3 -m http.server 8000
```

Puis ouvrir http://localhost:8000.

## Déploiement

Chaque push sur `main` déclenche le workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml), qui copie les fichiers du site dans `_site/` et les publie sur GitHub Pages.

Un nouveau fichier à mettre en ligne doit être ajouté à l'étape « Assemble site » de ce workflow. Sinon, il ne sera pas publié.

Après une modification de `styles.css` ou `script.js`, augmentez le paramètre `?v=` dans les balises qui les chargent pour que les navigateurs ne gardent pas l'ancienne version en cache.

## Régénérer le formulaire avec QR code

```bash
pip install qrcode pypdf reportlab pillow
python3 tools/add_qr_to_pdf.py
```

Le script lit `assets/formulaire-adhesion.pdf` et produit `assets/formulaire-adhesion-avec-liens.pdf`.

## Auteur

Site créé par [Ewan URBANC](https://nougrr.github.io/portfolio/).
