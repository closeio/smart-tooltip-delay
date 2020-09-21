# smart-tooltip-delay

[![NPM](https://img.shields.io/npm/v/@closeio/smart-tooltip-delay.svg)](https://www.npmjs.com/package/@closeio/smart-tooltip-delay) [![JavaScript Style Guide](https://img.shields.io/badge/code%20style-prettier-success)](https://prettier.io)

Smart tooltip delay experience in a breeze.

### <img width="680px" height="80px" src="./smart-tooltip-delay-example.gif" />

This tiny library can help you create a tooltip experience where the first one is shown with a delay and any subsequent ones are shown immediately or with a different delay. After a defined amount of time of no tooltip activity, the original tooltip delay is restored.

The GIF above shows a smart tooltip delay where tooltips are shown after 600ms, but once the first one is shown, any subsequent ones are shown immediately. After 2500ms of no tooltip activity the original 600ms delay is restored.

### <img height="40px" src="./close.svg" />

Interested in working on projects like this? [Close](https://close.com) is looking for [great engineers](https://jobs.close.com) to join our team!

## Install

```bash
yarn add @closeio/smart-tooltip-delay
```

## Benefits

- Extremely lightweight (less than 400B minzipped).
- Library-agnostic approach — you can combine multiple tooltip libraries and have the smart delay working for each.
- No other 3rd-party dependencies.

## API

When instantiating `SmartTooltipDelay`, you can provide an object with 3 options:

1. `delay` – default delay for each tooltip
1. `noDelay` – delay set for each subsequently shown tooltip (going from `delay` to `noDelay`)
1. `resetAfterTime` – time in milliseconds after which the default delay is restored (going from `noDelay` to `delay`)

## Usage

To integrate with a tooltip library, follow these steps:

1. `const instance = new SmartTooltipDelay({ delay: 600, noDelay: 0, resetAfterTime: 2500 })`
1. Set your tooltip library's delay dynamically using
   `instance.getCurrentDelay()` whenever the user attempts to show a tooltip
1. Whenever a tooltip is shown, call `instance.show()`
1. Whenever a tooltip is hidden, call `instance.hide()`
1. Enjoy smart tooltip experience

You can create a single `SmartTooltipDelay` instance for the entire app or you can create instances for each button toolbar.

### Example using Tippy.js

This example uses a single shared smart delay and a tooltip library called Tippy.js.

#### `sharedDelay.js`

```jsx
import SmartTooltipDelay from '@closeio/smart-tooltip-delay';

export default new SmartTooltipDelay({
  delay: 600,
  noDelay: 0,
  resetAfterTime: 2500,
});
```

#### `MyTooltip.js`

```jsx
import sharedSmartDelay from './sharedDelay.js';

export default function MyTooltip({ content /** … more props … */ }) {
  // Show with a smart delay, hide immediately
  const delayArrayRef = useRef([sharedSmartDelay.getCurrentDelay(), 0]);

  // Update Tippy's delay when we try to interact with it.
  const handleOnTrigger = useCallback(() => {
    delayArrayRef.current[0] = sharedSmartDelay.getCurrentDelay();
  }, []);

  // Tell the smart delay that the tooltip has been shown.
  const handleOnShow = useCallback(() => {
    sharedSmartDelay.show();
  }, []);

  // Tell the smart delay that the tooltip has been hidden.
  const handleOnHide = useCallback(() => {
    sharedSmartDelay.hide();
  }, []);

  return (
    <Tippy
      delay={delayArrayRef.current}
      onTrigger={handleOnTrigger}
      onShow={handleOnShow}
      onHide={handleOnHide}
      // … more props
    >
      {content}
    </Tippy>
  );
}
```

### Example using Bootstrap v2.3.2 Tooltips

This example uses a single shared smart delay and a tooltips from the Bootstrap framework.

#### `sharedDelay.js`

```jsx
import SmartTooltipDelay from '@closeio/smart-tooltip-delay';

export default new SmartTooltipDelay({
  delay: 600,
  noDelay: 0,
  resetAfterTime: 2500,
});
```

#### `applySmartDelay.js`

```jsx
import $ from 'jquery';
import sharedSmartDelay from './sharedDelay.js';

/**
 * Extends Bootstrap Tooltip v2.3.2 with smart delay.
 */
export default function applySmartDelay() {
  // Do "Smart" tooltip delay by default.
  $.fn.tooltip.defaults.delay = { show: sharedSmartDelay.getCurrentDelay() };

  // Override Tooltip's `enter` method to sneak in a different "show" delay.
  const Tooltip = $.fn.tooltip.Constructor;
  const _enter = Tooltip.prototype.enter;
  Tooltip.prototype.enter = function (e) {
    const self = $(e.currentTarget).data(this.type);

    if (self && self.options && self.options.hasSmartDelay) {
      self.options.delay = { show: sharedSmartDelay.getCurrentDelay() };
    }

    _enter.call(this, e);
  };

  // Set the "Smart" behaviour without overriding potential custom per-tooltip delay.
  const _getOptions = Tooltip.prototype.getOptions;
  Tooltip.prototype.getOptions = function (initialOptions) {
    const options = _getOptions.call(this, initialOptions);
    // If delay wasn't set, and it is not 0, use smart delay
    options.hasSmartDelay = !initialOptions.delay && initialOptions.delay !== 0;
    return options;
  };

  $(document).on({
    'show.bs.tooltip': sharedSmartDelay.show,
    'hide.bs.tooltip': sharedSmartDelay.hide,
  });
}
```

## License

MIT © [Close](https://github.com/closeio)
