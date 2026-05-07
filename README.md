# USDA Soil Texture Triangle

A lightweight React and Vite web app for entering one or many soil samples, validating sand/silt/clay percentages, plotting valid samples on a USDA textural triangle, and assigning the 12 standard USDA texture classes.

The rendered diagram can be exported as either PNG or SVG, including the currently represented valid samples and their labels.

## Project Structure

```text
.
|-- index.html
|-- package.json
|-- src
|   |-- App.tsx
|   |-- main.tsx
|   |-- soilTexture.ts
|   `-- styles.css
|-- tsconfig.json
`-- vite.config.ts
```

## Sample Entry

Manual rows auto-calculate the remaining texture fraction after two of the three percentages have been entered or edited. For example, entering sand and clay calculates silt as `100 - sand - clay`.

CSV import appends rows to the current sample list. The file must include headers named:

```csv
sample,sand,clay
Field A,40,20
Field B,62,16
```

Pipe, semicolon, tab, and comma delimiters are accepted. Imported rows calculate silt automatically from `100 - sand - clay`.

## USDA Classification Logic

The app uses the 12 standard USDA textural classes: sand, loamy sand, sandy loam, loam, silt loam, silt, sandy clay loam, clay loam, silty clay loam, sandy clay, silty clay, and clay.

`src/soilTexture.ts` contains the classification rules as direct inequalities over sand, silt, and clay percentages. Inputs are valid only when each fraction is between 0 and 100 and the total equals 100% within a small decimal tolerance. The sand and loamy sand rules use the standard USDA/NRCS modifier expressions `silt + 1.5 * clay` and `silt + 2 * clay`, which match the lower-left textural triangle boundaries.

The triangle plot uses ternary coordinates with clay at the apex, sand at the lower-left vertex, and silt at the lower-right vertex:

```ts
x = (sand * sandVertex.x + silt * siltVertex.x + clay * clayVertex.x) / 100
y = (sand * sandVertex.y + silt * siltVertex.y + clay * clayVertex.y) / 100
```

Class regions are drawn as USDA polygon regions, and plotted points use the same ternary coordinate transform as the triangle.

## Official References

- USDA NRCS Soil Texture Calculator: https://www.nrcs.usda.gov/resources/education-and-teaching-materials/soil-texture-calculator
- NRCS Calculator Tools page, listing Soil Texture Calculator: https://www.nrcs.usda.gov/conservation-basics/natural-resource-concerns/soil/calculator-tools

The NRCS calculator is used as the functional benchmark: it calculates texture classes from percent sand, silt, and clay and supports plotting multiple points.

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment

Vercel is the recommended host for this static Vite app.

1. Push the project to a Git repository.
2. Import the repository in Vercel.
3. Use the default Vite settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy.

Netlify works with the same build command and `dist` publish directory.

## Future Improvements

- CSV export of classified samples.
- Optional sand fraction fields matching the more detailed NRCS calculator behavior.
- Saved projects in local storage or a small hosted database.
- Accessibility-focused keyboard shortcuts for larger field datasets.
