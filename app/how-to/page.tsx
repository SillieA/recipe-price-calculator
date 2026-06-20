import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How To Use – Recipe Price Calculator',
  description:
    'A step-by-step guide to creating recipes, using tags, sharing, and importing/exporting your data.',
};

interface StepProps {
  number: number;
  title: string;
  children: React.ReactNode;
}

function Step({ number, title, children }: StepProps) {
  return (
    <div className="flex gap-5">
      <div className="flex-none">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white text-sm font-bold">
          {number}
        </div>
      </div>
      <div className="pb-8 border-l border-brand-border pl-5 -ml-[calc(1.125rem+1px)] flex-1">
        <h2 className="text-lg font-semibold text-foreground font-heading mb-2">{title}</h2>
        <div className="text-slate-600 space-y-2 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 rounded-md border border-brand-border bg-brand-light px-3 py-2 text-brand-dark text-xs leading-relaxed">
      {children}
    </div>
  );
}

export default function HowToPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">
          How to use the Recipe Price Calculator
        </h1>
        <p className="mt-2 text-slate-500">
          Follow these steps to go from zero to a costed recipe in a few
          minutes.
        </p>
      </div>

      <div className="bg-surface rounded-md border border-brand-border shadow-sm px-8 py-6">
        <Step number={1} title="Add your ingredients">
          <p>
            Go to the <strong>Ingredients</strong> page and click{' '}
            <strong>+ Add ingredient</strong>. Fill in:
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li>
              <strong>Name</strong> – what the ingredient is called, e.g.{' '}
              <em>Plain flour</em>.
            </li>
            <li>
              <strong>Price</strong> – the total price you paid for the package,
              e.g. £1.50.
            </li>
            <li>
              <strong>Amount &amp; Unit</strong> – how much the package
              contains, e.g. 1000&nbsp;g. Together these let the calculator
              work out a cost per gram.
            </li>
            <li>
              <strong>Notes</strong> – optional extra information such as brand
              or supplier.
            </li>
            <li>
              <strong>Tags</strong> – optional labels (e.g. <em>dairy</em>,{' '}
              <em>gluten-free</em>) to organise your library.
            </li>
          </ul>
          <p>Click <strong>Add ingredient</strong> to save it.</p>
          <Note>
            💡 Tip: if you buy a 500&nbsp;g bag for £0.75, enter £0.75 and
            500&nbsp;g. The calculator will divide the price by the quantity to
            get the cost per gram, and use that in every recipe that includes
            this ingredient.
          </Note>
        </Step>

        <Step number={2} title="Create a recipe">
          <p>
            Go to the <strong>Recipes</strong> page and click{' '}
            <strong>+ Add recipe</strong>. Fill in:
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li>
              <strong>Recipe name</strong> – e.g. <em>Sourdough loaf</em>.
            </li>
            <li>
              <strong>Ingredients</strong> – click <em>+ Add ingredient</em> to
              add a row, then choose the ingredient, enter the quantity, and
              select the unit. Repeat for each ingredient. You can use any
              compatible unit (e.g. add flour in grams even if you bought it by
              the kilogram).
            </li>
            <li>
              <strong>Yields (qty)</strong> – how many units one batch makes,
              e.g. <em>1</em> loaf or <em>12</em> cupcakes.
            </li>
            <li>
              <strong>Yield unit</strong> – what each unit is called, e.g.{' '}
              <em>loaves</em> or <em>cookies</em>.
            </li>
            <li>
              <strong>Sale price each</strong> – how much you sell each unit
              for. The calculator uses this to compute your profit and margin.
            </li>
            <li>
              <strong>VAT rated</strong> – tick this if the product is
              standard-rated for UK VAT (20%). The calculator will strip VAT
              from the sale price before computing your margin.
            </li>
            <li>
              <strong>Tags</strong> – optional labels to organise your recipes.
            </li>
          </ul>
          <p>Click <strong>Add recipe</strong> and you will immediately see the cost, profit, and margin.</p>
          <Note>
            💡 Whenever you update an ingredient&apos;s price, the costs for{' '}
            <em>every</em> recipe that uses it will update automatically — you
            never need to re-enter data. You will see a reminder listing the
            affected recipes when you open the ingredient edit form.
          </Note>
        </Step>

        <Step number={3} title="Using tags and searching">
          <p>
            Tags make it easy to filter large lists. You can add tags to both
            ingredients and recipes when creating or editing them:
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li>
              Type a tag name in the tag field, then press{' '}
              <kbd className="rounded border border-brand-border bg-surface-subtle px-1 py-0.5 text-xs font-mono">
                Enter
              </kbd>{' '}
              or{' '}
              <kbd className="rounded border border-brand-border bg-surface-subtle px-1 py-0.5 text-xs font-mono">
                ,
              </kbd>{' '}
              to add it.
            </li>
            <li>
              Start typing to see suggestions based on tags you&apos;ve already
              used — click one to add it instantly.
            </li>
            <li>
              Press{' '}
              <kbd className="rounded border border-brand-border bg-surface-subtle px-1 py-0.5 text-xs font-mono">
                Backspace
              </kbd>{' '}
              when the field is empty to remove the last tag.
            </li>
          </ul>
          <p>
            To filter by tag, type the tag name in the <strong>Search</strong>{' '}
            box at the top of the Ingredients or Recipes page. The search also
            matches against names and notes.
          </p>
        </Step>

        <Step number={4} title="Sharing your data">
          <p>
            You can share your entire ingredient library and all recipes with
            someone else in one click:
          </p>
          <ol className="list-decimal ml-5 space-y-1">
            <li>
              Click <strong>Copy share URL</strong> in the top navigation bar.
            </li>
            <li>
              A URL is copied to your clipboard. Send it to anyone — when they
              open it, your data is merged into their calculator.
            </li>
          </ol>
          <Note>
            ℹ️ Shared data is merged by record ID using the{' '}
            <em>last-updated</em> timestamp, so the most recently edited
            version of each ingredient or recipe wins.
          </Note>
        </Step>

        <Step number={5} title="Exporting and importing">
          <p>
            Use the <strong>Export</strong> and <strong>Import</strong> buttons
            in the navigation bar to back up or transfer your data:
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li>
              <strong>Export</strong> – downloads your entire data set as a
              JSON file named{' '}
              <code className="rounded bg-slate-100 px-1 text-xs font-mono">
                recipe-calculator-YYYY-MM-DD.json
              </code>
              . Keep this as a backup.
            </li>
            <li>
              <strong>Import</strong> – opens a file picker. Select a
              previously exported JSON file and your data will be merged in.
              Existing records are kept; duplicates are resolved by
              last-updated timestamp.
            </li>
          </ul>
          <Note>
            💾 All data is saved locally in your browser. Export regularly if
            you want a persistent backup, especially before clearing browser
            storage.
          </Note>
        </Step>
      </div>
    </div>
  );
}
