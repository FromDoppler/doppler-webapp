import { useEffect, useState } from 'react';

export const useFingerPrintingV2 = () => {
  const [fingerPrintingIdV2, setFingerPrintingIdV2] = useState(null);

  useEffect(() => {
    /******/ (() => {
      // webpackBootstrap
      /******/ var __webpack_modules__ = {
        /***/ 442: /***/ (__unused_webpack_module, exports) => {
          Object.defineProperty(exports, '__esModule', { value: true });
          exports.cyrb53 = exports.javaHashCode = exports.murmurhash3_32_gc = void 0;
          // @ts-nocheck
          // https://github.com/artem0/canvas-fingerprinting/blob/master/hash/murmurhash3.js
          // output - 3705295134 a hashed number of the string.
          // https://en.wikipedia.org/wiki/MurmurHash
          function murmurhash3_32_gc(key, seed) {
            var remainder, bytes, h1, h1b, c1, c2, k1, i;
            remainder = key.length & 3; // key.length % 4
            bytes = key.length - remainder;
            h1 = seed;
            c1 = 0xcc9e2d51;
            c2 = 0x1b873593;
            i = 0;
            while (i < bytes) {
              k1 =
                (key.charCodeAt(i) & 0xff) |
                ((key.charCodeAt(++i) & 0xff) << 8) |
                ((key.charCodeAt(++i) & 0xff) << 16) |
                ((key.charCodeAt(++i) & 0xff) << 24);
              ++i;
              k1 = ((k1 & 0xffff) * c1 + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
              k1 = (k1 << 15) | (k1 >>> 17);
              k1 = ((k1 & 0xffff) * c2 + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
              h1 ^= k1;
              h1 = (h1 << 13) | (h1 >>> 19);
              h1b = ((h1 & 0xffff) * 5 + ((((h1 >>> 16) * 5) & 0xffff) << 16)) & 0xffffffff;
              h1 = (h1b & 0xffff) + 0x6b64 + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16);
            }
            k1 = 0;
            switch (remainder) {
              case 3:
                k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
                break;
              case 2:
                k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
                break;
              case 1:
                k1 ^= key.charCodeAt(i) & 0xff;
                k1 = ((k1 & 0xffff) * c1 + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
                k1 = (k1 << 15) | (k1 >>> 17);
                k1 = ((k1 & 0xffff) * c2 + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
                h1 ^= k1;
                break;
              default:
                return 0;
            }
            h1 ^= key.length;
            h1 ^= h1 >>> 16;
            h1 =
              ((h1 & 0xffff) * 0x85ebca6b + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) &
              0xffffffff;
            h1 ^= h1 >>> 13;
            h1 =
              ((h1 & 0xffff) * 0xc2b2ae35 + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16)) &
              0xffffffff;
            h1 ^= h1 >>> 16;
            return h1 >>> 0;
          }
          exports.murmurhash3_32_gc = murmurhash3_32_gc;
          // taken from same above repo
          const javaHashCode = (string, K) => {
            var hash = 0;
            if (string.length === 0) {
              return hash;
            }
            let char;
            for (var i = 0; i < string.length; i++) {
              char = string.charCodeAt(i);
              hash = K * ((hash << 5) - hash) + char;
              hash = hash & hash;
            }
            return hash;
          };
          exports.javaHashCode = javaHashCode;
          // reference - https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript#answer-52171480
          // output - 6533356943844037
          const cyrb53 = function (str, seed = 0) {
            let h1 = 0xdeadbeef ^ seed,
              h2 = 0x41c6ce57 ^ seed;
            for (let i = 0, ch; i < str.length; i++) {
              ch = str.charCodeAt(i);
              h1 = Math.imul(h1 ^ ch, 2654435761);
              h2 = Math.imul(h2 ^ ch, 1597334677);
            }
            h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
            h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
            return 4294967296 * (2097151 & h2) + (h1 >>> 0);
          };
          exports.cyrb53 = cyrb53;

          /***/
        },

        /***/ 881: /***/ (__unused_webpack_module, exports) => {
          Object.defineProperty(exports, '__esModule', { value: true });
          exports.getCanvasFingerprint = exports.isCanvasSupported = void 0;
          const isCanvasSupported = () => {
            var elem = document.createElement('canvas');
            return !!(elem.getContext && elem.getContext('2d'));
          };
          exports.isCanvasSupported = isCanvasSupported;
          // this working code snippet is taken from - https://github.com/artem0/canvas-fingerprinting/blob/master/fingerprinting/fingerprint.js
          const getCanvasFingerprint = () => {
            // If canvas is not supported simply return a static string
            if (!(0, exports.isCanvasSupported)()) return 'broprint.js';
            // draw a canvas of given text and return its data uri
            // different browser generates different dataUri based on their hardware configs
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            // https://www.browserleaks.com/canvas#how-does-it-work
            ctx.fillStyle = 'rgb(255,0,255)';
            ctx.beginPath();
            ctx.rect(20, 20, 150, 100);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.fillStyle = 'rgb(0,255,255)';
            ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();

            var txt = 'abz1AQWETREqq{]=+-?>90#$%^@£éú';
            ctx.textBaseline = 'top';
            ctx.font = '17px "Arial 17"';
            ctx.textBaseline = 'alphabetic';
            ctx.fillStyle = 'rgb(255,5,5)';
            ctx.rotate(0.03);
            ctx.fillText(txt, 4, 17);
            ctx.fillStyle = 'rgb(155,255,5)';
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'red';
            ctx.fillRect(20, 12, 100, 5);
            return canvas.toDataURL();
          };
          exports.getCanvasFingerprint = getCanvasFingerprint;

          /***/
        },

        /***/ 502: /***/ (__unused_webpack_module, exports) => {
          Object.defineProperty(exports, '__esModule', { value: true });
          exports.generateTheAudioFingerPrint = void 0;
          //  ref = https://github.com/rickmacgillis/audio-fingerprint/blob/master/audio-fingerprinting.js
          // @ts-nocheck
          exports.generateTheAudioFingerPrint = (function () {
            var context = null;
            var currentTime = null;
            var oscillator = null;
            var compressor = null;
            var fingerprint = null;
            var callback = null;
            function run(cb, debug = false) {
              callback = cb;
              try {
                setup();
                oscillator.connect(compressor);
                compressor.connect(context.destination);
                oscillator.start(0);
                context.startRendering();
                context.oncomplete = onComplete;
              } catch (e) {
                if (debug) {
                  throw e;
                }
              }
            }
            function setup() {
              setContext();
              currentTime = context.currentTime;
              setOscillator();
              setCompressor();
            }
            function setContext() {
              var audioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
              context = new audioContext(1, 44100, 44100);
            }
            function setOscillator() {
              oscillator = context.createOscillator();
              oscillator.type = 'triangle';
              oscillator.frequency.setValueAtTime(10000, currentTime);
            }
            function setCompressor() {
              compressor = context.createDynamicsCompressor();
              setCompressorValueIfDefined('threshold', -50);
              setCompressorValueIfDefined('knee', 40);
              setCompressorValueIfDefined('ratio', 12);
              setCompressorValueIfDefined('reduction', -20);
              setCompressorValueIfDefined('attack', 0);
              setCompressorValueIfDefined('release', 0.25);
            }
            function setCompressorValueIfDefined(item, value) {
              if (
                compressor[item] !== undefined &&
                typeof compressor[item].setValueAtTime === 'function'
              ) {
                compressor[item].setValueAtTime(value, context.currentTime);
              }
            }
            function onComplete(event) {
              generateFingerprints(event);
              compressor.disconnect();
            }
            function generateFingerprints(event) {
              var output = null;
              for (var i = 4500; 5e3 > i; i++) {
                var channelData = event.renderedBuffer.getChannelData(0)[i];
                output += Math.abs(channelData);
              }
              fingerprint = output.toString();
              if (typeof callback === 'function') {
                return callback(fingerprint);
              }
            }
            return {
              run: run,
            };
          })();

          /***/
        },

        /***/ 393: /***/ (__unused_webpack_module, exports, __webpack_require__) => {
          exports.$ = void 0;
          const EncryptDecrypt_1 = __webpack_require__(442);
          const GenerateCanvasFingerprint_1 = __webpack_require__(881);
          const generateTheAudioPrints_1 = __webpack_require__(502);
          /**
           * This functions working
           * @Param {null}
           * @return {Promise<string>} - resolve(string)
           */
          const getCurrentBrowserFingerPrint = () => {
            /**
             * @return {Promise} - a frequency number 120.256896523
             * @reference - https://fingerprintjs.com/blog/audio-fingerprinting/
             */
            const getTheAudioPrints = new Promise((resolve, reject) => {
              generateTheAudioPrints_1.generateTheAudioFingerPrint.run(function (fingerprint) {
                resolve(fingerprint);
              });
            });
            /**
             *
             * @param {null}
             * @return {Promise<string>} - and sha512 hashed string
             */
            const DevicePrints = new Promise((resolve, reject) => {
              getTheAudioPrints
                .then((audioChannelResult) => {
                  let fingerprint =
                    window.btoa(audioChannelResult) +
                    (0, GenerateCanvasFingerprint_1.getCanvasFingerprint)();
                  // using btoa to hash the values to looks better readable
                  resolve((0, EncryptDecrypt_1.cyrb53)(fingerprint, 0));
                })
                .catch(() => {
                  try {
                    // if failed with audio fingerprint then resolve only with canvas fingerprint
                    resolve(
                      (0, EncryptDecrypt_1.cyrb53)(
                        (0, GenerateCanvasFingerprint_1.getCanvasFingerprint)(),
                      ).toString(),
                    );
                  } catch (error) {
                    reject('Failed to generate the finger print of this browser');
                  }
                });
            });
            return DevicePrints;
          };
          exports.$ = getCurrentBrowserFingerPrint;

          /***/
        },

        /******/
      };
      /************************************************************************/
      /******/ // The module cache
      /******/ var __webpack_module_cache__ = {};
      /******/
      /******/ // The require function
      /******/ function __webpack_require__(moduleId) {
        /******/ // Check if module is in cache
        /******/ var cachedModule = __webpack_module_cache__[moduleId];
        /******/ if (cachedModule !== undefined) {
          /******/ return cachedModule.exports;
          /******/
        }
        /******/ // Create a new module (and put it into the cache)
        /******/ var module = (__webpack_module_cache__[moduleId] = {
          /******/ // no module.id needed
          /******/ // no module.loaded needed
          /******/ exports: {},
          /******/
        });
        /******/
        /******/ // Execute the module function
        /******/ __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
        /******/
        /******/ // Return the exports of the module
        /******/ return module.exports;
        /******/
      }
      /******/
      /************************************************************************/
      // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
      (() => {
        /* harmony import */ var fp_module = __webpack_require__(393);

        // eslint-disable-next-line no-whitespace-before-property
        (0, fp_module /* .getCurrentBrowserFingerPrint */.$)().then((fingerprint) => {
          /***/
          setFingerPrintingIdV2(fingerprint);
          /***/
        });
      })();

      /******/
    })();
  }, []);

  return fingerPrintingIdV2;
};
