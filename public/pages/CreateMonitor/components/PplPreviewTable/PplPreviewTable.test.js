/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { pplRespToDocs, PplPreviewTable } from './PplPreviewTable';

describe('pplRespToDocs', () => {
  test('converts PPL schema+datarows response to flat docs', () => {
    const resp = {
      schema: [
        { name: 'name', type: 'string' },
        { name: 'age', type: 'integer' },
      ],
      datarows: [
        ['Alice', 30],
        ['Bob', 25],
      ],
    };
    const docs = pplRespToDocs(resp);
    expect(docs).toHaveLength(2);
    expect(docs[0]).toEqual({ name: 'Alice', age: 30 });
    expect(docs[1]).toEqual({ name: 'Bob', age: 25 });
  });

  test('converts hits response to flat docs', () => {
    const resp = {
      hits: {
        hits: [
          {
            _id: '1',
            _index: 'idx',
            _score: 1,
            _type: '_doc',
            _source: { name: 'Alice', nested: { field: 'val' } },
          },
        ],
      },
    };
    const docs = pplRespToDocs(resp);
    expect(docs).toHaveLength(1);
    expect(docs[0]._id).toBe('1');
    expect(docs[0].name).toBe('Alice');
    expect(docs[0]['nested.field']).toBe('val');
  });

  test('returns empty array for null/undefined', () => {
    expect(pplRespToDocs(null)).toEqual([]);
    expect(pplRespToDocs(undefined)).toEqual([]);
    expect(pplRespToDocs({})).toEqual([]);
  });

  test('handles empty datarows', () => {
    const resp = { schema: [{ name: 'x', type: 'integer' }], datarows: [] };
    expect(pplRespToDocs(resp)).toEqual([]);
  });
});

describe('PplPreviewTable', () => {
  test('renders with docs', () => {
    const docs = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ];
    const { container } = render(<PplPreviewTable docs={docs} />);
    expect(container.textContent).toContain('Alice');
  });

  test('renders empty state', () => {
    const { container } = render(<PplPreviewTable docs={[]} />);
    expect(container).toBeTruthy();
  });

  test('renders loading state', () => {
    const { container } = render(<PplPreviewTable docs={[]} isLoading={true} />);
    expect(container).toBeTruthy();
  });
});
