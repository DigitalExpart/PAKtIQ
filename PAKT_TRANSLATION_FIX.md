# 🌍 Pakt Translation Fix

## Problem

Active pakts on the home screen (like "Book Reading", "Healthy") were not being translated to French or Spanish. The interface was in the selected language, but pakt names and categories remained in English.

## Solution

### 1. Created Translation Utility (`src/utils/translations.ts`)

**Functions:**
- `translateCategory(category)` - Translates category names
- `translatePaktName(name)` - Translates common pakt names

**Features:**
- Maps database category values to translation keys
- Handles common pakt names like "Book Reading", "Healthy", "Exercise", etc.
- Falls back to original text if translation not found
- Case-insensitive matching for flexibility

### 2. Added Translation Keys

**Categories** (already existed):
- `categories.healthFitness` → "Santé et Fitness" (FR) / "Salud y Fitness" (ES)
- `categories.personalGrowth` → "Croissance Personnelle" (FR) / "Crecimiento Personal" (ES)
- `categories.wellness` → "Bien-être" (FR) / "Bienestar" (ES)
- etc.

**Pakt Names** (new):
- `paktNames.bookReading` → "Lecture de Livres" (FR) / "Lectura de Libros" (ES)
- `paktNames.healthy` → "Santé" (FR) / "Saludable" (ES)
- `paktNames.exercise` → "Exercice" (FR) / "Ejercicio" (ES)
- And 20+ more common pakt names

### 3. Updated All Screens

**Screens Updated:**
- ✅ `app/dashboard.tsx` - Home screen active pakts
- ✅ `app/all-pakts.tsx` - All pakts list
- ✅ `app/pakt-detail.tsx` - Pakt detail screen
- ✅ `app/export.tsx` - Export screen
- ✅ `app/share.tsx` - Share screen
- ✅ `app/journal.tsx` - Journal screen

## Translation Coverage

### Categories Translated:
- Health & Fitness → Santé et Fitness / Salud y Fitness
- Personal Growth → Croissance Personnelle / Crecimiento Personal
- Wellness → Bien-être / Bienestar
- Finance → Finances / Finanzas
- Career & Education → Carrière et Éducation / Carrera y Educación
- Relationships → Relations / Relaciones
- Creativity → Créativité / Creatividad
- Productivity → Productivité / Productividad

### Common Pakt Names Translated:
- Book Reading → Lecture de Livres / Lectura de Libros
- Healthy → Santé / Saludable
- Exercise → Exercice / Ejercicio
- Meditation → Méditation / Meditación
- Learn Language → Apprendre une Langue / Aprender un Idioma
- Save Money → Économiser / Ahorrar Dinero
- Write → Écrire / Escribir
- And 20+ more...

## How It Works

1. **Category Translation:**
   ```typescript
   translateCategory("Personal Growth")
   // Returns: "Croissance Personnelle" (FR) or "Crecimiento Personal" (ES)
   ```

2. **Pakt Name Translation:**
   ```typescript
   translatePaktName("Book Reading")
   // Returns: "Lecture de Livres" (FR) or "Lectura de Libros" (ES)
   ```

3. **Fallback:**
   - If translation not found, returns original text
   - Ensures app always displays something readable

## Files Modified

1. `src/utils/translations.ts` - **NEW** - Translation utility functions
2. `src/locales/en.json` - Added paktNames translations
3. `src/locales/fr.json` - Added paktNames translations (French)
4. `src/locales/es.json` - Added paktNames translations (Spanish)
5. `app/dashboard.tsx` - Uses translation functions
6. `app/all-pakts.tsx` - Uses translation functions
7. `app/pakt-detail.tsx` - Uses translation functions
8. `app/export.tsx` - Uses translation functions
9. `app/share.tsx` - Uses translation functions
10. `app/journal.tsx` - Uses translation functions

## Adding More Translations

To add more pakt name translations:

1. **Add to locale files:**
   ```json
   // src/locales/fr.json
   "paktNames": {
     "newPaktName": "Traduction Française"
   }
   ```

2. **Add to translation utility:**
   ```typescript
   // src/utils/translations.ts
   const commonPaktNames: Record<string, string> = {
     'New Pakt Name': 'paktNames.newPaktName',
     // ...
   };
   ```

## Testing

After the fix:
- [ ] Dashboard shows translated pakt names in French
- [ ] Dashboard shows translated pakt names in Spanish
- [ ] Categories are translated correctly
- [ ] All pakts screen shows translations
- [ ] Pakt detail screen shows translations
- [ ] Export/share screens show translations
- [ ] Journal screen shows translated pakt names
- [ ] Unknown pakt names fall back to original (no errors)

## Notes

- User-entered pakt names that aren't in the common list will show in original language
- This is expected behavior - we can't translate arbitrary user input
- Common pakt names like "Book Reading", "Healthy", "Exercise" are now translated
- Categories are always translated since they come from a fixed list
