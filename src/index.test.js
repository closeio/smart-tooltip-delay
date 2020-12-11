import SmartTooltipDelay from './';

let delayHandler;

beforeEach(() => {
  jest.useFakeTimers();
  delayHandler = new SmartTooltipDelay({
    delay: 600,
    noDelay: 0,
    resetAfterTime: 2500,
  });
});

test('sets no delay after showing and resets the delay after hiding', () => {
  expect(delayHandler.getCurrentDelay()).toEqual(600);

  // Mock hovering over a tooltip that shows after a delay
  jest.advanceTimersByTime(delayHandler.getCurrentDelay());
  delayHandler.show();

  expect(delayHandler.getCurrentDelay()).toEqual(0);

  // Mock hovering out
  delayHandler.hide();

  // The delay should reset after the specified reset time, 2500ms.
  jest.advanceTimersByTime(1000);
  expect(delayHandler.getCurrentDelay()).toEqual(0);
  jest.advanceTimersByTime(1499);
  expect(delayHandler.getCurrentDelay()).toEqual(0);
  jest.advanceTimersByTime(1);
  expect(delayHandler.getCurrentDelay()).toEqual(600);
});

test('bumps reset delay after consequent shows/hides', () => {
  // Mock hovering over a tooltip that shows after a delay
  jest.advanceTimersByTime(delayHandler.getCurrentDelay());
  delayHandler.show();

  // Mock hovering out
  delayHandler.hide();

  // The delay should reset after the specified reset time, 2500ms.
  jest.advanceTimersByTime(2499);
  expect(delayHandler.getCurrentDelay()).toEqual(0);

  // Show another
  delayHandler.show();

  // Not enough time for the delay to reset.
  jest.advanceTimersByTime(1000);
  expect(delayHandler.getCurrentDelay()).toEqual(0);

  // Show another
  delayHandler.hide();
  delayHandler.show();

  // Again, not enough time for the delay to reset.
  jest.advanceTimersByTime(1500);
  expect(delayHandler.getCurrentDelay()).toEqual(0);

  delayHandler.hide();

  // The delay should reset after the specified reset time, 2500ms.
  jest.advanceTimersByTime(2500);
  expect(delayHandler.getCurrentDelay()).toEqual(600);
});
