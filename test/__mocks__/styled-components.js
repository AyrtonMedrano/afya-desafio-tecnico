import React from 'react';

const filterProps = (props) => {
  const allowed = new Set([
    'className', 'style', 'id', 'title', 'htmlFor',
    'type', 'name', 'value', 'checked', 'readOnly', 'disabled',
    'placeholder', 'tabIndex', 'role',
    'onClick', 'onChange', 'onFocus', 'onBlur', 'onInput',
    'onKeyDown', 'onKeyUp', 'onKeyPress',
    'onMouseDown', 'onMouseUp', 'onMouseEnter', 'onMouseLeave', 'onMouseMove',
    'onSubmit', 'onInvalid', 'onWheel',
    'onTouchStart', 'onTouchEnd', 'onTouchMove',
  ]);

  const filtered = {};
  for (const [key, val] of Object.entries(props)) {
    if (allowed.has(key) || key.startsWith('aria-') || key.startsWith('data-')) {
      filtered[key] = val;
    }
  }
  return filtered;
};

const makeComponent = (tag) => {
  const Comp = ({ children, ...props }) =>
    React.createElement(
      tag,
      {
        ...filterProps(props),
        className: `${props.className ?? ''} mocked-styled-component`.trim(),
      },
      children
    );

  return (_strings, ..._interpolations) => Comp;
};

const styled = new Proxy(function () {}, {
  apply(_target, _thisArg, args) {
    const [tag] = args;
    return makeComponent(tag);
  },
  get(_target, prop) {
    if (typeof prop === 'string') {
      return makeComponent(prop);
    }
    return undefined;
  },
});

export default styled;

export const css = () => '';
export const createGlobalStyle = () => () => null;
export const keyframes = () => '';
export const ThemeProvider = ({ children }) => children;