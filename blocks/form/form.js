/*
 * Form Block
 * Builds a web form from either:
 *   - a link to a form definition sheet (.json) with columns
 *     Name, Label, Type, Options, Mandatory, Placeholder, Value, Help; or
 *   - inline rows: Label | Type | Options (comma-separated or a list).
 * Special rows (first cell, case-insensitive):
 *   "Action"  | URL the form POSTs JSON to (default: the sheet URL)
 *   "Submit"  | submit button label
 *   "Success" | message shown after a successful submit
 * Any other row that is only text/headings is kept as intro or step copy.
 * Field types: text, email, tel, number, date, textarea, select, radio,
 * checkbox, hidden, heading, plaintext, submit.
 */
import { toClassName } from '../../scripts/aem.js';

const FIELD_TYPES = ['text', 'email', 'tel', 'number', 'date', 'url', 'textarea', 'select', 'radio', 'checkbox', 'hidden', 'heading', 'plaintext', 'submit'];

const AMOUNT = '[$€£]\\s?\\d[\\d,]*(?:\\.\\d+)?';
const DISPLAY_PATTERN = new RegExp(`^([^:]{1,40}):\\s*(${AMOUNT})$`);
const AMOUNT_PATTERN = new RegExp(AMOUNT, 'g');

let formCount = 0;

/* wrap currency amounts in copy so they can be styled and read by calculators */
function markAmounts(el) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    const text = node.textContent;
    const matches = [...text.matchAll(AMOUNT_PATTERN)];
    if (!matches.length) return;
    const frag = document.createDocumentFragment();
    let last = 0;
    matches.forEach((m) => {
      const [amount] = m;
      frag.append(text.slice(last, m.index));
      const span = document.createElement('span');
      span.className = 'form-amount';
      span.textContent = amount;
      frag.append(span);
      last = m.index + amount.length;
    });
    frag.append(text.slice(last));
    node.replaceWith(frag);
  });
}

function parseAmount(text) {
  return Number(String(text || '').replace(/[^\d.]/g, ''));
}

/* authored cells may wrap their text in a single <p>; labels must not contain blocks */
function cellHtml(cell) {
  if (!cell) return '';
  const only = cell.children.length === 1 ? cell.firstElementChild : null;
  if (only?.tagName === 'P' && only.textContent.trim() === cell.textContent.trim()) {
    return only.innerHTML;
  }
  return cell.innerHTML;
}

function splitOptions(value) {
  if (Array.isArray(value)) return value;
  return String(value || '').split(',').map((o) => o.trim()).filter(Boolean);
}

function isMandatory(value) {
  return /^(true|yes|x|required|1)$/i.test(String(value || '').trim());
}

function fieldId(def, i) {
  return `form-${formCount}-${toClassName(def.name || def.label || `field-${i}`)}`;
}

function buildField(def, i) {
  const type = FIELD_TYPES.includes(def.type) ? def.type : 'text';
  const id = fieldId(def, i);
  const name = def.name || toClassName(def.label || `field-${i}`);
  const wrap = document.createElement('div');
  wrap.className = `form-field form-field-${type}`;

  if (type === 'heading') {
    const h = document.createElement(/^h[1-6]$/i.test(def.level || '') ? def.level : 'h3');
    h.textContent = def.label;
    wrap.append(h);
    return wrap;
  }
  if (type === 'plaintext') {
    const display = (def.label || '').trim().match(DISPLAY_PATTERN);
    if (display) {
      // "Label: $0.00" renders as a labelled read-only value (e.g. a calculator result)
      wrap.className = 'form-field form-field-output';
      const label = document.createElement('label');
      label.className = 'form-label';
      label.htmlFor = id;
      const [, labelText, value] = display;
      label.textContent = labelText.trim();
      const output = document.createElement('output');
      output.className = 'form-output';
      output.id = id;
      output.setAttribute('aria-live', 'polite');
      output.textContent = value;
      wrap.append(label, output);
      return wrap;
    }
    const p = document.createElement('p');
    if (def.labelHtml) p.innerHTML = def.labelHtml;
    else p.textContent = def.label;
    markAmounts(p);
    wrap.append(p);
    return wrap;
  }
  if (type === 'submit') {
    const button = document.createElement('button');
    button.type = 'submit';
    button.className = 'button';
    button.textContent = def.label || 'Submit';
    wrap.append(button);
    return wrap;
  }

  const label = document.createElement(type === 'radio' || type === 'checkbox' ? 'legend' : 'label');
  label.className = 'form-label';
  if (def.labelHtml) label.innerHTML = def.labelHtml;
  else label.textContent = def.label || name;
  if (def.required) label.dataset.required = 'true';

  let control;
  const options = splitOptions(def.options);
  if (type === 'select') {
    control = document.createElement('select');
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = def.placeholder || 'Please select';
    control.append(placeholder);
    options.forEach((o) => {
      const opt = document.createElement('option');
      opt.value = o;
      opt.textContent = o;
      if (o === def.value) opt.selected = true;
      control.append(opt);
    });
  } else if ((type === 'radio' || type === 'checkbox') && options.length) {
    const fieldset = document.createElement('fieldset');
    fieldset.className = wrap.className;
    fieldset.append(label);
    options.forEach((o, j) => {
      const optId = `${id}-${j}`;
      const input = document.createElement('input');
      input.type = type;
      input.name = name;
      input.value = o;
      input.id = optId;
      if (def.required && type === 'radio') input.required = true;
      const optLabel = document.createElement('label');
      optLabel.htmlFor = optId;
      optLabel.textContent = o;
      const row = document.createElement('div');
      row.className = 'form-option';
      row.append(input, optLabel);
      fieldset.append(row);
    });
    return fieldset;
  } else if (type === 'textarea') {
    control = document.createElement('textarea');
  } else {
    control = document.createElement('input');
    control.type = type;
    if (def.value) control.value = def.value;
  }

  control.id = id;
  control.name = name;
  if (def.placeholder && type !== 'select') control.placeholder = def.placeholder;
  if (def.required) control.required = true;

  if (type === 'hidden') {
    wrap.append(control);
    return wrap;
  }

  if (type === 'checkbox') {
    const optLabel = document.createElement('label');
    optLabel.htmlFor = id;
    if (def.labelHtml) optLabel.innerHTML = def.labelHtml;
    else optLabel.textContent = def.label || name;
    wrap.append(control, optLabel);
  } else {
    label.htmlFor = id;
    wrap.append(label, control);
  }
  if (def.help) {
    const help = document.createElement('p');
    help.className = 'form-help';
    help.textContent = def.help;
    wrap.append(help);
  }
  return wrap;
}

function fromSheet(json) {
  const rows = Array.isArray(json?.data) ? json.data : [];
  const get = (r, k) => r[k] ?? r[k.toLowerCase()] ?? '';
  return rows.map((r) => ({
    name: get(r, 'Name'),
    label: get(r, 'Label'),
    type: String(get(r, 'Type') || 'text').toLowerCase(),
    options: get(r, 'Options'),
    required: isMandatory(get(r, 'Mandatory')),
    placeholder: get(r, 'Placeholder'),
    value: get(r, 'Value'),
    help: get(r, 'Help'),
  }));
}

function fromRows(rows, config) {
  const defs = [];
  rows.forEach((row) => {
    const cells = [...row.children];
    const key = cells[0]?.textContent.trim() || '';
    const lower = key.toLowerCase();
    if (lower === 'action') {
      config.action = cells[1]?.querySelector('a')?.href || cells[1]?.textContent.trim();
      return;
    }
    if (lower === 'submit') {
      // keep the button where it is authored (e.g. beside the field it acts on)
      defs.push({ type: 'submit', label: cells[1]?.textContent.trim() || 'Submit' });
      return;
    }
    if (lower === 'success') {
      config.success = cells[1]?.innerHTML;
      return;
    }
    const typeText = cells[1]?.textContent.trim().toLowerCase();
    if (cells.length >= 2 && FIELD_TYPES.includes(typeText)) {
      const list = cells[2]?.querySelectorAll('li');
      const label = key.replace(/\*$/, '').trim();
      defs.push({
        label,
        labelHtml: cellHtml(cells[0]).replace(/\*\s*(<\/[^>]+>)?\s*$/, '$1'),
        type: typeText,
        options: list?.length
          ? [...list].map((li) => li.textContent.trim())
          : cells[2]?.textContent,
        required: /\*$/.test(key) || isMandatory(cells[3]?.textContent),
        placeholder: cells[4]?.textContent.trim(),
      });
      return;
    }
    // copy row: keep authored content as plaintext / heading
    cells.forEach((c) => {
      [...c.children].forEach((el) => {
        if (/^H[1-6]$/.test(el.tagName)) {
          defs.push({ type: 'heading', label: el.textContent, level: el.tagName.toLowerCase() });
        } else if (el.textContent.trim()) defs.push({ type: 'plaintext', label: el.textContent, labelHtml: el.innerHTML });
      });
    });
  });
  return defs;
}

async function submit(form, config) {
  const data = {};
  new FormData(form).forEach((value, key) => {
    if (data[key] !== undefined) data[key] = [].concat(data[key], value);
    else data[key] = value;
  });
  const button = form.querySelector('button[type="submit"]');
  if (button) button.disabled = true;
  form.setAttribute('aria-busy', 'true');
  const status = form.querySelector('.form-status');
  try {
    const resp = await fetch(config.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    if (!resp.ok) throw new Error(`Submit failed: ${resp.status}`);
    const done = document.createElement('div');
    done.className = 'form-success';
    done.setAttribute('role', 'status');
    done.innerHTML = config.success || '<p>Thank you. Your submission has been received.</p>';
    form.replaceWith(done);
  } catch (e) {
    status.textContent = 'Sorry, something went wrong. Please try again.';
    status.hidden = false;
    if (button) button.disabled = false;
    form.removeAttribute('aria-busy');
  }
}

export default async function decorate(block) {
  formCount += 1;
  const config = {};
  let defs;

  const sheetLink = [...block.querySelectorAll('a[href]')]
    .find((a) => /\.json$/i.test(new URL(a.href, window.location.href).pathname));
  if (sheetLink) {
    const { href } = sheetLink;
    [...block.children].find((r) => r.contains(sheetLink))?.remove();
    [config.action] = href.split('?');
    const resp = await fetch(href).catch(() => null);
    defs = resp?.ok ? fromSheet(await resp.json()) : [];
    defs = fromRows([...block.children], config).concat(defs);
  } else {
    defs = fromRows([...block.children], config);
  }

  const form = document.createElement('form');
  form.className = 'form-form';
  form.noValidate = false;
  defs.forEach((def, i) => form.append(buildField(def, i)));
  if (!defs.some((d) => d.type === 'submit')) {
    form.append(buildField({ type: 'submit', label: config.submit || 'Submit' }, defs.length));
  }
  const status = document.createElement('p');
  status.className = 'form-status';
  status.setAttribute('role', 'alert');
  status.hidden = true;
  form.append(status);

  // calculator: no action, a number field, a result ("Label: $0.00") and a reference amount
  const calcInput = form.querySelector('input[type="number"]');
  const calcOutput = form.querySelector('output.form-output');
  const calcRate = [...form.querySelectorAll('.form-amount')].pop();
  const isCalculator = !config.action && calcInput && calcOutput && calcRate;
  if (isCalculator) {
    calcInput.min = calcInput.min || '0';
    calcInput.step = calcInput.step || '1';
    // the calculate button belongs beside the field it acts on
    const submitField = form.querySelector('.form-field-submit');
    if (submitField) calcInput.closest('.form-field').after(submitField);
    // a single-input calculator does not mark its field as required
    form.querySelectorAll('.form-label[data-required]').forEach((l) => l.removeAttribute('data-required'));
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (isCalculator) {
      const symbol = calcOutput.textContent.trim().match(/^[$€£]/)?.[0] || '';
      const total = Number(calcInput.value) * parseAmount(calcRate.textContent);
      const formatted = total.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      calcOutput.value = `${symbol}${formatted}`;
      return;
    }
    if (!config.action) {
      status.textContent = 'This form has no submit action configured.';
      status.hidden = false;
      return;
    }
    submit(form, config);
  });

  block.replaceChildren(form);
}
