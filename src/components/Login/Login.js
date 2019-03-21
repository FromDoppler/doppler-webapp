import React from 'react';

export default function({ location }) {
  return (
    <div>
      {/* TODO: implement login */}
      LOGIN. After login, redirect to{' '}
      {location.state && location.state.from
        ? `${location.state.from.pathname}${location.state.from.search}${location.state.from.hash}`
        : '/'}
      <code>
        <pre>{JSON.stringify(location, null, 2)}</pre>
      </code>
    </div>
  );
}
