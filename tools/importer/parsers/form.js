/* eslint-disable */
/* global WebImporter */

/**
 * form parser.
 * Source: div.sharePriceCalculator > .share-price-calculator <form>: title
 * (.share-price-calculator__title), intro (.share-price-calculator__content),
 * inputs (.ctrl-holder label + input/select/textarea), calculate CTA
 * (a.btn / button), read-only display (.share-price-calculator__display-container)
 * and disclaimer (.share-price-calculator__disclaimer).
 * Block table (blocks/form/form.js): copy rows (headings/text) and field rows
 * Label | Type | Options | Mandatory | Placeholder, plus a Submit row.
 * Rows are padded to five cells.
 */

const WIDTH = 5;

function text(el) {
  return (el ? el.textContent : '').replace(/[\s ]+/g, ' ').trim();
}

function fieldType(control) {
  const tag = control.tagName.toLowerCase();
  if (tag === 'select') return 'select';
  if (tag === 'textarea') return 'textarea';
  const cls = control.getAttribute('class') || '';
  const type = (control.getAttribute('type') || 'text').toLowerCase();
  if (type === 'text' && /\bv-(digits|number)\b/.test(cls)) return 'number';
  return ['email', 'tel', 'number', 'date', 'url', 'checkbox', 'radio', 'hidden'].includes(type) ? type : 'text';
}

function row(...cells) {
  while (cells.length < WIDTH) cells.push('');
  return cells;
}

/* ---------- AEM Core Components forms (.aemformcontainer / form.cmp-form) ---------- */

/** Clean copy of a rich-text block as copy-row content (headings, paragraphs; lists flattened). */
function coreCopy(document, rich) {
  const out = [];
  const clone = rich.cloneNode(true);
  clone.querySelectorAll('script, style, svg').forEach((n) => n.remove());
  clone.querySelectorAll('a:not([href])').forEach((a) => a.replaceWith(...a.childNodes));
  [clone, ...clone.querySelectorAll('*')].forEach((n) => {
    n.removeAttribute('style');
    n.removeAttribute('class');
  });
  [...clone.children].forEach((el) => {
    if (/^(UL|OL)$/.test(el.tagName)) {
      // form.js keeps each copy element as a paragraph: one per list item
      el.querySelectorAll(':scope > li').forEach((li) => {
        if (!text(li)) return;
        const p = document.createElement('p');
        p.append(...li.childNodes);
        out.push(p);
      });
    } else if (text(el)) {
      out.push(el);
    }
  });
  return out;
}

function optionList(document, labels) {
  const ul = document.createElement('ul');
  labels.forEach((l) => {
    const li = document.createElement('li');
    li.textContent = l;
    ul.append(li);
  });
  return ul;
}

function isRequired(fieldset, control) {
  if (fieldset && fieldset.classList.contains('required')) return true;
  const req = control && control.getAttribute('required');
  return req !== null && req !== undefined && req !== 'false';
}

function stripStar(label) {
  return label.replace(/\s*\*\s*$/, '').trim();
}

function coreField(document, item) {
  const fieldset = item.querySelector('fieldset.cmp-form-options');
  if (fieldset) {
    const select = fieldset.querySelector('select');
    if (select || fieldset.classList.contains('cmp-form-options--drop-down')) {
      const label = stripStar(text(fieldset.querySelector('.cmp-form-options__label, label, legend')));
      const opts = select ? [...select.querySelectorAll('option')] : [];
      const empty = opts.find((o) => o.hasAttribute('data-empty-option') || !o.getAttribute('value'));
      const labels = opts.filter((o) => o !== empty).map(text).filter(Boolean);
      return row(label || select?.getAttribute('name') || 'Select', 'select', optionList(document, labels),
        isRequired(fieldset, select) ? 'true' : '', empty ? text(empty) : '');
    }
    const inputs = [...fieldset.querySelectorAll('input[type="checkbox"], input[type="radio"]')];
    if (inputs.length) {
      const type = inputs[0].getAttribute('type').toLowerCase();
      const legend = stripStar(text(fieldset.querySelector('legend, .cmp-form-options__label')));
      const labels = inputs.map((input) => {
        const holder = input.closest('label') || input.parentElement;
        return text(holder.querySelector('.cmp-form-options__field-description')) || text(holder)
          || input.getAttribute('value') || '';
      }).filter(Boolean);
      return row(legend || labels[0] || 'Options', type, optionList(document, labels),
        isRequired(fieldset, inputs[0]) ? 'true' : '');
    }
  }
  // text / email / textarea fields (.cmp-form-text)
  const control = item.querySelector('textarea, input:not([type="hidden"]):not([type="submit"]):not([type="button"])');
  if (control) {
    const id = control.getAttribute('id');
    const labelEl = (id && item.querySelector(`label[for="${id}"]`)) || item.querySelector('label');
    const label = stripStar(text(labelEl)) || control.getAttribute('name') || 'Field';
    const wrapper = item.querySelector('.cmp-form-text') || item;
    const required = isRequired(wrapper.classList.contains('required') ? wrapper : null, control);
    return row(label, fieldType(control), '', required ? 'true' : '', control.getAttribute('placeholder') || '');
  }
  return null;
}

function parseCoreForm(element, document, form) {
  const cells = [];

  // copy that sits beside the form inside the same container (before it)
  const outside = [...element.querySelectorAll('.rich-text')].filter((r) => !form.contains(r));
  const before = outside.filter((r) => r.compareDocumentPosition(form) & 4);
  const after = outside.filter((r) => !before.includes(r));
  before.forEach((r) => { const c = coreCopy(document, r); if (c.length) cells.push(row(c)); });

  // walk the form's grid columns in document order
  let items = [...form.querySelectorAll('.aem-GridColumn')].filter((n) => !n.parentElement.closest('.aem-GridColumn'));
  if (!items.length) items = [...form.children];
  items.forEach((item) => {
    if (item.classList.contains('recaptcha') || item.querySelector('.cmp-form-recaptcha')) return;
    const button = item.querySelector('button, input[type="submit"]');
    if (item.classList.contains('button') || (button && !item.querySelector('fieldset, select, textarea'))) {
      if (button) cells.push(row('Submit', text(button) || button.getAttribute('value') || 'Submit'));
      const thanks = item.querySelector('[data-thank-you-message]');
      const msg = thanks && thanks.getAttribute('data-thank-you-message');
      if (msg && msg.trim()) {
        const holder = document.createElement('div');
        holder.innerHTML = msg;
        const content = [...holder.children].filter((el) => text(el));
        if (content.length) cells.push(row('Success', content));
      }
      return;
    }
    const rich = item.matches('.richtext') || item.querySelector('.rich-text');
    if (rich && !item.querySelector('fieldset, select, input:not([type="hidden"]), textarea')) {
      const c = coreCopy(document, item.querySelector('.rich-text') || item);
      if (c.length) cells.push(row(c));
      return;
    }
    const field = coreField(document, item);
    if (field) cells.push(field);
  });

  after.forEach((r) => { const c = coreCopy(document, r); if (c.length) cells.push(row(c)); });

  const block = WebImporter.Blocks.createBlock(document, { name: 'form', cells });
  element.replaceWith(block);
}

export default function parse(element, { document }) {
  const coreForm = element.matches('form.cmp-form') ? element
    : element.querySelector('.aemformcontainer form, form.cmp-form');
  if (coreForm && !element.querySelector('.share-price-calculator')) {
    parseCoreForm(element, document, coreForm);
    return;
  }

  const cells = [];
  const form = element.querySelector('form') || element;

  const title = form.querySelector('.share-price-calculator__title h1, .share-price-calculator__title h2, .share-price-calculator__title h3, h2, h3');
  if (title && text(title)) {
    const h = document.createElement(title.tagName.toLowerCase());
    h.textContent = text(title);
    cells.push(row(h));
  }

  const intro = form.querySelector('.share-price-calculator__content');
  if (intro) {
    [...intro.querySelectorAll('p')].forEach((p) => {
      if (!text(p)) return;
      const np = document.createElement('p');
      np.textContent = text(p);
      cells.push(row(np));
    });
  }

  // input fields
  form.querySelectorAll('input, select, textarea').forEach((control) => {
    const type = (control.getAttribute('type') || '').toLowerCase();
    if (['submit', 'button', 'reset'].includes(type)) return;
    const id = control.getAttribute('id');
    const labelEl = (id && form.querySelector(`label[for="${id}"]`)) || control.closest('.ctrl-holder')?.querySelector('label');
    const label = text(labelEl) || control.getAttribute('name') || 'Field';
    const required = /\bv-required\b/.test(control.getAttribute('class') || '') || control.hasAttribute('required');
    const options = control.tagName === 'SELECT'
      ? [...control.querySelectorAll('option')].map(text).filter(Boolean).join(', ')
      : '';
    cells.push(row(label, fieldType(control), options, required ? 'true' : '', control.getAttribute('placeholder') || ''));
  });

  // read-only result displays (no form control) become plain text rows
  form.querySelectorAll('.share-price-calculator__display-container .ctrl-holder').forEach((holder) => {
    if (holder.querySelector('input, select, textarea')) return;
    const label = text(holder.querySelector('label'));
    const value = text(holder.querySelector('.display'));
    const p = [label, value].filter(Boolean).join(': ');
    if (p) cells.push(row(p, 'plaintext'));
  });

  const cta = form.querySelector('.share-price-calculator__cta, button[type="submit"], input[type="submit"], a.btn');
  if (cta) {
    const label = text(cta) || cta.getAttribute('value') || 'Submit';
    cells.push(row('Submit', label));
  }

  const disclaimer = form.querySelector('.share-price-calculator__disclaimer');
  if (disclaimer && text(disclaimer)) {
    const p = document.createElement('p');
    p.textContent = text(disclaimer).replace(/\$\s*(\d+)\s*\.\s*(\d+)/g, '$$$1.$2');
    cells.push(row(p));
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'form', cells });
  element.replaceWith(block);
}
