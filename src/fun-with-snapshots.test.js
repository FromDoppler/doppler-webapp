import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import snapshotDiff from 'snapshot-diff';
import Loading from './components/Loading/Loading';
import { create } from 'react-test-renderer';

describe('Jest Snapshots', () => {
  describe('of objects', () => {
    it('should sort the properties alphabetically', async () => {
      const a = { a: 1, c: 2, b: 3 };
      expect(a).toMatchInlineSnapshot(`
        Object {
          "a": 1,
          "b": 3,
          "c": 2,
        }
      `);
    });

    it('should include properties with undefined value', async () => {
      const a = { a: 1, b: 2, c: 3, d: undefined };
      expect(a).toMatchInlineSnapshot(`
        Object {
          "a": 1,
          "b": 2,
          "c": 3,
          "d": undefined,
        }
      `);
    });

    it('should include properties with function values, but without details', async () => {
      const a = { a: 1, b: (x) => x + 2, c: (x, y) => x + y };
      expect(a).toMatchInlineSnapshot(`
        Object {
          "a": 1,
          "b": [Function],
          "c": [Function],
        }
      `);
    });

    it('should work with not inline snapshots', async () => {
      const a = { a: 1, b: (x) => x + 2, c: (x, y) => x + y };
      expect(a).toMatchSnapshot();
    });
  });

  describe('of components', () => {
    it('should use a prettied HTML', async () => {
      const a = create(<Loading page />);
      expect(a).toMatchInlineSnapshot(`
        <div
          className="wrapper-loading"
        >
          <div
            className="loading-page"
          />
        </div>
      `);
    });

    it('should work with not inline snapshots', async () => {
      const a = create(<Loading page />);
      expect(a).toMatchSnapshot();
    });
  });

  describe('Diff of components', () => {
    it('should work :P', async () => {
      const a = create(<Loading />);
      const b = create(<Loading page />);
      expect(snapshotDiff(a, b)).toMatchInlineSnapshot(`
        "Snapshot Diff:
        - First value
        + Second value

          <div
        -   className=\\"loading-box\\"
        +   className=\\"wrapper-loading\\"
        + >
        +   <div
        +     className=\\"loading-page\\"
            />
        + </div>"
      `);
    });

    it('should work with not inline snapshots', async () => {
      const a = create(<Loading />);
      const b = create(<Loading page />);
      expect(snapshotDiff(a, b)).toMatchSnapshot();
    });
  });

  describe('Diff of objects', () => {
    it('should not pay attention to properties order', async () => {
      const a = { a: 1, b: 2, c: 3 };
      const b = { a: 1, c: 3, b: 2 };
      expect(snapshotDiff(a, b)).toMatchInlineSnapshot(`
        "Snapshot Diff:
        Compared values have no visual difference."
      `);
    });

    it('should detect differences in property values', async () => {
      const a = { a: 1, b: 2, c: 3 };
      const b = { a: 1, b: 3, c: 3 };
      expect(snapshotDiff(a, b)).toMatchInlineSnapshot(`
        "Snapshot Diff:
        - First value
        + Second value

          Object {
            \\"a\\": 1,
        -   \\"b\\": 2,
        +   \\"b\\": 3,
            \\"c\\": 3,
          }"
      `);
    });

    it('should detect differences in property names', async () => {
      const a = { a: 1, b: 2, c: 3 };
      const b = { a: 1, x: 2, c: 3 };
      expect(snapshotDiff(a, b)).toMatchInlineSnapshot(`
        "Snapshot Diff:
        - First value
        + Second value

          Object {
            \\"a\\": 1,
        -   \\"b\\": 2,
            \\"c\\": 3,
        +   \\"x\\": 2,
          }"
      `);
    });

    it('should differentiate undefined properties than properties with undefined value', async () => {
      const a = { a: 1, b: 2, c: 3 };
      const b = { a: 1, b: 2, c: 3, d: undefined };
      expect(snapshotDiff(a, b)).toMatchInlineSnapshot(`
        "Snapshot Diff:
        - First value
        + Second value

          Object {
            \\"a\\": 1,
            \\"b\\": 2,
            \\"c\\": 3,
        +   \\"d\\": undefined,
          }"
      `);
    });

    it('should work with not inline snapshots', async () => {
      const a = { a: 1, b: 2, c: 3 };
      const b = { a: 1, b: 2, c: 3, d: undefined };
      expect(snapshotDiff(a, b)).toMatchSnapshot();
    });
  });
});
