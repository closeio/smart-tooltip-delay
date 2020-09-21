# smart-tooltip-delay

[![NPM](https://img.shields.io/npm/v/@closeio/smart-tooltip-delay.svg)](https://www.npmjs.com/package/@closeio/smart-tooltip-delay) [![JavaScript Style Guide](https://img.shields.io/badge/code%20style-prettier-success)](https://prettier.io)

Smart tooltip delay experience in a breeze.

### <img width="680px" height="80px" src="./smart-tooltip-delay-example.gif" />

This tiny library can help you create a tooltip experience where the first one is shown with a delay and any subsequent ones are shown immediately. After a defined amount of time of no tooltip activity, the first tooltip delay is restored.

```
(hover button) 600ms delay (show tooltip) (hover another button) 0ms delay
```

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

1. Create an instance of `SmartTooltipDelay`
1. Set your tooltip library's delay dynamically using
   `instance.getCurrentDelay()` whenever the user attempts to show a tooltip
1. Whenever a tooltip is shown, call `instance.show()`
1. Whenever a tooltip is hidden, call `instance.hide()`
1. Enjoy smart tooltip experience

You can create a single `SmartTooltipDelay` instance for the entire app or you can create instances for each button sets.

### Example using Tippy.js

This example uses a single shared smart delay and a tooltip library called Tippy.js.

#### `shared-delay.js`

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
import sharedSmartDelay from './shared-delay.js';

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

## License

MIT © [Close](https://github.com/closeio)
