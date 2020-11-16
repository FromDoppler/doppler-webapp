import React, { useRef, createRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { InjectAppServices, AppServices } from '../../services/pure-di';

type CaptchaUtils = Readonly<
  [
    (props: any) => JSX.Element,
    () => Promise<CaptchaVerificationResult>,
    React.RefObject<ReCAPTCHA>,
  ]
>;

type CaptchaVerificationResult = Readonly<
  | { success: true; captchaResponseToken: string }
  | {
      success?: false;
      captchaError: { errorCallback: true; noToken?: false; errorExecuting?: false };
    }
  | {
      success?: false;
      captchaError: { noToken: true; errorCallback?: false; errorExecuting?: false };
    }
  | {
      success?: false;
      captchaError: { errorExecuting: true; noToken?: false; errorCallback?: false };
    }
>;

export class CaptchaUtilsService {
  /** Returns a ReCAPTCHA component and a related validation function (as a hook)*/
  public useCaptcha() {
    const captchaUtilsRef = useRef<CaptchaUtils>();
    if (!captchaUtilsRef.current) {
      captchaUtilsRef.current = this.createCaptchaUtils();
    }
    return captchaUtilsRef.current;
  }

  /** Returns a ReCAPTCHA component and a related validation function */
  private createCaptchaUtils(): CaptchaUtils {
    /** Reference to re-captcha object */
    const recaptchaRef = createRef<ReCAPTCHA>();

    /** Reference to what to do after captcha verification, I need override this function in order to resolve verifyCapcha promise */
    let onCaptchaChangeMutable:
      | ((captchaResponseToken: string | null, reason: 'change' | 'error') => Promise<void>)
      | null = null;

    /** To call current overrode implementation of onCaptchaChange */
    const onCaptchaChange = (captchaResponseToken: string | null) =>
      onCaptchaChangeMutable && onCaptchaChangeMutable(captchaResponseToken, 'change');

    /** To call current overrode implementation of onCaptchaChange */
    const onCaptchaErrored = () => onCaptchaChangeMutable && onCaptchaChangeMutable(null, 'error');

    /** Generates a promise that is resolved when captcha is resolved (successfully or not) */
    const verifyCaptcha = () => {
      return new Promise<CaptchaVerificationResult>(async (resolve) => {
        onCaptchaChangeMutable = async (captchaResponseToken, resultType) => {
          try {
            await (recaptchaRef.current && recaptchaRef.current.reset());
          } catch (error) {
            console.log('Error resetting captcha', error);
          }

          if (resultType === 'error') {
            resolve({ captchaError: { errorCallback: true } });
          } else if (!captchaResponseToken) {
            resolve({ captchaError: { noToken: true } });
          } else {
            resolve({ success: true, captchaResponseToken: captchaResponseToken });
          }
        };

        try {
          await (recaptchaRef.current && recaptchaRef.current.execute());
          /* nothing to do if it is successful, only wait for onChange. */
        } catch (error) {
          console.log('error on captcha execute', error);
          resolve({ captchaError: { errorExecuting: true } });
        }
        // If challenge window is closed, we do not have feedback, so, by the moment,
        // See more details in https://stackoverflow.com/questions/43488605/detect-when-challenge-window-is-closed-for-google-recaptcha
      });
    };

    const Captcha = InjectAppServices(
      ({ dependencies: { appConfiguration } }: { dependencies: AppServices }) => (
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={appConfiguration.recaptchaPublicKey}
          size="invisible"
          onChange={onCaptchaChange}
          onErrored={onCaptchaErrored}
        />
      ),
    );

    return [Captcha, verifyCaptcha, recaptchaRef];
  }
}
