import { useEffect } from 'react';

type keysPressedType = { [key: string]: boolean };
type keysPressedCodeType = { [key: string]: string };
type keysType = string[];
type KeyboardControllerType<T = { register: () => void; unregister: () => void }> = (
  callback: (props: { keys: keysType; keysPressedCode: keysPressedCodeType; sortedKeys: keysType }) => void,
  repeatTime: number,
) => T;

export const useKeyboardController: KeyboardControllerType<void> = (callback, repeatTime) => {
  useEffect(() => {
    const keyboard = KeyboardController(callback, repeatTime);
    keyboard.register();
    return () => keyboard.unregister();
  }, [callback, repeatTime]);
};

export const KeyboardController: KeyboardControllerType = (callback, repeatTime) => {
  let keysPressed: keysPressedType = {};
  let keysPressedCode: keysPressedCodeType = {};
  let sortedKeys: keysType = [];
  let interval: NodeJS.Timer;

  const keydownHandler = (event: KeyboardEvent) => {
    const key = (event || window.event).code;
    const metaKey = (event || window.event).metaKey;
    // const shiftKey = (event || window.event).shiftKey;
    // const altKey = (event || window.event).altKey;
    // const ctrlKey = (event || window.event).ctrlKey;
    const code = (event || window.event).code;

    // const specialKey = metaKey || shiftKey || altKey || ctrlKey;
    // console.log(specialKey);
    if (metaKey) {
      blurHandler();
      return false;
    }

    // Which key pressed and fire interval
    keysPressedCode[key] = code;
    keysPressed[key] = true;
    if (sortedKeys.indexOf(key) === -1) {
      sortedKeys.push(key);
      if (sortedKeys.length === 1) {
        fire();
      }
    }

    // TODO: this prevented by scroll but probably now do nothing this is needed when scrolls appears, for example when the game mode is on
    // Need to set some boolean and for example some shortcut exit this or entered
    event.preventDefault();
    return false;
  };

  const keyupHandler = (event: KeyboardEvent) => {
    const key = (event || window.event).code;
    delete keysPressed[key];
    delete keysPressedCode[key];
    const index = sortedKeys.indexOf(key);
    if (index !== -1) {
      sortedKeys.splice(index, 1);
    }
  };

  const blurHandler = () => {
    keysPressed = {};
    keysPressedCode = {};
    sortedKeys = [];
    trigger();
  };

  const trigger = () => {
    const keys = Object.keys(keysPressed);
    callback({ keys, keysPressedCode, sortedKeys });

    if (keys.length === 0) {
      clearInterval(interval);
    }
  };

  const fire = () => {
    clearInterval(interval);
    trigger();

    interval = setInterval(() => {
      trigger();
    }, repeatTime);
  };

  const register = () => {
    console.log('register KeyboardController');

    window.addEventListener('keydown', keydownHandler);
    window.addEventListener('keyup', keyupHandler);
    window.addEventListener('blur', blurHandler);
  };

  const unregister = () => {
    console.log('unregister KeyboardController');
    clearInterval(interval);
    window.removeEventListener('keydown', keydownHandler);
    window.removeEventListener('keyup', keyupHandler);
    window.removeEventListener('blur', blurHandler);
  };
  return {
    register,
    unregister,
  };
};
