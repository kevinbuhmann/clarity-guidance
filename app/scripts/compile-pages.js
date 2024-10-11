const fs = require('fs');
const glob = require('glob');
const path = require('path');

const domino = require('domino');
const parseFrontMatter = require('front-matter');
const { marked } = require('marked');
const { gfmHeadingId } = require('marked-gfm-heading-id');
const { markedHighlight } = require('marked-highlight');
const prismjs = require('prismjs');

// add languages for code highlighting
require('prismjs/components/prism-bash');
require('prismjs/components/prism-json');
require('prismjs/components/prism-typescript');

// heading ids
marked.use(gfmHeadingId());

// code highlight
marked.use(
  markedHighlight({
    highlight: (code, lang) =>
      prismjs.languages[lang] ? prismjs.highlight(code, prismjs.languages[lang], lang) : code,
  }),
);

main();

async function main() {
  const compiledContentPath = './src/compiled-content';

  const pages = [];

  for (const pageFilePath of glob.sync('../*.md')) {
    const filename = path.parse(pageFilePath).name;
    const number = filename === 'README' ? undefined : +filename;
    const { attributes, body } = parseFrontMatter(fs.readFileSync(pageFilePath).toString());

    pages.push({ filename, number, title: attributes['title'] });

    writeFile(`${filename}.component.html`, await compileMarkdown(body));
    writeFile(`${filename}.component.ts`, getPageComponentTs(filename));
  }

  pages.sort((a, b) => a.number - b.number);

  const numberedPages = pages.filter(page => page.number !== undefined);

  writeJson('pages.json', numberedPages);
  writeFile(`page-routes.ts`, getPageRoutesTs(pages));

  function writeJson(filename, data) {
    writeFile(filename, JSON.stringify(data, undefined, 2));
  }

  function writeFile(filename, contents) {
    fs.writeFileSync(path.join(compiledContentPath, filename), contents);
  }
}

function getPageComponentTs(filename) {
  return `
import { Component } from '@angular/core';

@Component({
  templateUrl: './${filename}.component.html',
  standalone: true,
})
export class Page${filename}Component {}
`;
}

function getPageRoutesTs(pages) {
  return `
import { Routes } from '@angular/router';

export const pageRoutes: Routes = [
  ${pages.map(({ filename, number }) => `{ path: '${number || ''}', loadComponent: () => import('./../compiled-content/${filename}.component').then(m => m.Page${filename}Component)},`).join('\n  ')}
];`;
}

async function compileMarkdown(markdown) {
  const document = domino.createDocument(marked(markdown, { mangle: false }));

  styleTables(document);
  styleInlineCode(document);
  styleText(document);
  openExternalLinksInNewTab(document);

  return document.body.innerHTML;
}

function styleTables(document) {
  for (const tableElement of Array.from(document.querySelectorAll('table'))) {
    tableElement.classList.add('table');
  }
}

function styleInlineCode(document) {
  for (const codeElement of Array.from(document.querySelectorAll('code:not(pre code)'))) {
    codeElement.setAttribute('cds-text', 'code');
  }
}

function styleText(document) {
  const defaultAttributes = {
    h1: [{ attributeName: 'cds-text', attributeValue: 'headline' }],
    h2: [
      { attributeName: 'cds-text', attributeValue: 'title' },
      { attributeName: 'cds-layout', attributeValue: 'm-t:xl' },
    ],
    h3: [
      { attributeName: 'cds-text', attributeValue: 'section' },
      { attributeName: 'cds-layout', attributeValue: 'm-t:lg' },
    ],
    h4: [
      { attributeName: 'cds-text', attributeValue: 'subsection' },
      { attributeName: 'cds-layout', attributeValue: 'm-t:md' },
    ],
    h5: [
      { attributeName: 'cds-text', attributeValue: 'subsection light' },
      { attributeName: 'cds-layout', attributeValue: 'm-t:md' },
    ],
    h6: [
      { attributeName: 'cds-text', attributeValue: 'body bold' },
      { attributeName: 'cds-layout', attributeValue: 'm-t:md' },
    ],
    p: [
      { attributeName: 'cds-text', attributeValue: 'body' },
      { attributeName: 'cds-layout', attributeValue: 'm-t:md' },
    ],
    table: [
      { attributeName: 'cds-text', attributeValue: 'body' },
      { attributeName: 'cds-layout', attributeValue: 'm-t:md' },
    ],
    'li > ul, li > ol': [{ attributeName: 'cds-layout', attributeValue: 'm-y:md m-l:lg' }],
    ol: [
      { attributeName: 'cds-text', attributeValue: 'body' },
      { attributeName: 'cds-layout', attributeValue: 'm-t:md m-l:xs' },
    ],
    ul: [
      { attributeName: 'cds-text', attributeValue: 'body' },
      { attributeName: 'cds-layout', attributeValue: 'm-t:md m-l:xs' },
    ],
    li: [{ attributeName: 'cds-layout', attributeValue: 'm-t:xs' }],
    img: [{ attributeName: 'cds-layout', attributeValue: 'm-t:xxl' }],
    strong: [{ attributeName: 'cds-text', attributeValue: 'medium' }],
  };

  for (const [rawSelector, attributes] of Object.entries(defaultAttributes)) {
    for (const { attributeName, attributeValue } of attributes) {
      const selector = rawSelector
        .split(/,\s*/g)
        .map(singleSelector => `${singleSelector}:not([${attributeName}])`)
        .join(', ');

      for (const element of Array.from(document.querySelectorAll(selector))) {
        element.setAttribute(attributeName, attributeValue);
      }
    }
  }
}

function openExternalLinksInNewTab(document) {
  for (const linkElement of Array.from(document.querySelectorAll('a[href]'))) {
    if (!linkElement.href.startsWith('/')) {
      linkElement.setAttribute('rel', 'noopener');
      linkElement.setAttribute('target', '_blank');
    }
  }
}
