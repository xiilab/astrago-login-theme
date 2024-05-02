// ejected using 'npx eject-keycloak-page'
import { clsx } from 'keycloakify/tools/clsx';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import { useGetClassName } from 'keycloakify/login/lib/useGetClassName';
import type { KcContext } from '../kcContext';
import type { I18n } from '../i18n';
import styled from '@emotion/styled';

import { ReactComponent as MailIcon } from './icons/mail_outline.svg';
import { ReactComponent as LockIcon } from './icons/lock_outline.svg';
import { ReactComponent as VisibilityOffIcon } from './icons/visibility_off_white.svg';
import { ReactComponent as VisibilityIcon } from './icons/remove_red_eye_white.svg';
import { ReactComponent as GoogleLogoIcon } from './icons/google_logo.svg';
import { ReactComponent as WhiteLogo } from './WhiteLogo.svg';
import { ReactComponent as BlackLogo } from './BlackLogo.svg';

import mySvg from './loginBackground.svg';

import Footer from '../../Footer';

interface ErrorInputContainerProps {
  showError?: boolean;
}

export default function Register(
  props: PageProps<Extract<KcContext, { pageId: 'register.ftl' }>, I18n>,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { getClassName } = useGetClassName({
    doUseDefaultCss,
    classes,
  });

  const {
    url,
    messagesPerField,
    register,
    realm,
    passwordRequired,
    recaptchaRequired,
    recaptchaSiteKey,
  } = kcContext;

  const { msg, msgStr } = i18n;

  return (
    <>
      <Wrapper>
        <Container>
          <Template
            {...{ kcContext, i18n, doUseDefaultCss, classes }}
            headerNode={msg('registerTitle')}>
            <form
              id="kc-register-form"
              className={getClassName('kcFormClass')}
              action={url.registrationAction}
              method="post">
              <Section>
                <Title>
                  <BlackLogo />
                </Title>
                <SubTitle>Join the Membership</SubTitle>
                <FormContainer>
                  <InputContainer>
                    <div
                      className={clsx(
                        getClassName('kcFormGroupClass'),
                        messagesPerField.printIfExists(
                          'firstName',
                          getClassName('kcFormGroupErrorClass'),
                        ),
                      )}>
                      {/* <div className={getClassName('kcLabelWrapperClass')}>
                  <label
                    htmlFor="firstName"
                    className={getClassName('kcLabelClass')}
                  >
                    {msg('firstName')}
                  </label>
                </div> */}
                      <div className={getClassName('kcInputWrapperClass')}>
                        <input
                          type="text"
                          id="firstName"
                          className={getClassName('kcInputClass')}
                          name="firstName"
                          placeholder="First name"
                          defaultValue={register.formData.firstName ?? ''}
                        />
                      </div>
                    </div>
                  </InputContainer>

                  <InputContainer>
                    <div
                      className={clsx(
                        getClassName('kcFormGroupClass'),
                        messagesPerField.printIfExists(
                          'lastName',
                          getClassName('kcFormGroupErrorClass'),
                        ),
                      )}>
                      {/* <div className={getClassName('kcLabelWrapperClass')}>
                  <label
                    htmlFor="lastName"
                    className={getClassName('kcLabelClass')}
                  >
                    {msg('lastName')}
                  </label>
                </div> */}
                      <div className={getClassName('kcInputWrapperClass')}>
                        <input
                          type="text"
                          id="lastName"
                          className={getClassName('kcInputClass')}
                          name="lastName"
                          placeholder="Last name"
                          defaultValue={register.formData.lastName ?? ''}
                        />
                      </div>
                    </div>
                  </InputContainer>

                  <InputContainer>
                    {!realm.registrationEmailAsUsername && (
                      <div
                        className={clsx(
                          getClassName('kcFormGroupClass'),
                          messagesPerField.printIfExists(
                            'username',
                            getClassName('kcFormGroupErrorClass'),
                          ),
                        )}>
                        {/* <div className={getClassName('kcLabelWrapperClass')}>
                      <label
                        htmlFor="username"
                        className={getClassName('kcLabelClass')}
                      >
                        {msg('username')}
                      </label>
                    </div> */}
                        <div className={getClassName('kcInputWrapperClass')}>
                          <input
                            type="text"
                            id="username"
                            className={getClassName('kcInputClass')}
                            name="username"
                            defaultValue={register.formData.username ?? ''}
                            autoComplete="username"
                            placeholder="user name"
                          />
                        </div>
                      </div>
                    )}
                  </InputContainer>
                  <GuideText>
                    영문자, 숫자로 10자 이내로 기입해 주세요. (특수문자, 한글 입력 불가)
                  </GuideText>

                  <InputContainer>
                    <div
                      className={clsx(
                        getClassName('kcFormGroupClass'),
                        messagesPerField.printIfExists(
                          'email',
                          getClassName('kcFormGroupErrorClass'),
                        ),
                      )}>
                      {/* <div className={getClassName('kcLabelWrapperClass')}>
                    <label
                      htmlFor="email"
                      className={getClassName('kcLabelClass')}
                    >
                      {msg('email')}
                    </label>
                  </div> */}
                      <div className={getClassName('kcInputWrapperClass')}>
                        <input
                          type="text"
                          id="email"
                          className={getClassName('kcInputClass')}
                          name="email"
                          placeholder="Email"
                          defaultValue={register.formData.email ?? ''}
                          autoComplete="email"
                        />
                      </div>
                    </div>
                  </InputContainer>

                  {passwordRequired && (
                    <>
                      <InputContainer>
                        <div
                          className={clsx(
                            getClassName('kcFormGroupClass'),
                            messagesPerField.printIfExists(
                              'password',
                              getClassName('kcFormGroupErrorClass'),
                            ),
                          )}>
                          {/* <div className={getClassName('kcLabelWrapperClass')}>
                        <label
                          htmlFor="password"
                          className={getClassName('kcLabelClass')}
                        >
                          {msg('password')}
                        </label>
                      </div> */}
                          <div className={getClassName('kcInputWrapperClass')}>
                            <input
                              type="password"
                              id="password"
                              className={getClassName('kcInputClass')}
                              name="password"
                              autoComplete="new-password"
                              placeholder="password"
                            />
                          </div>
                        </div>
                      </InputContainer>
                      <GuideText>
                        영문 대소문자, 솟자, 특수문자 중 2가지 이상 10~16자 이내로 기입해 주세요.
                      </GuideText>
                      <InputContainer>
                        <div
                          className={clsx(
                            getClassName('kcFormGroupClass'),
                            messagesPerField.printIfExists(
                              'password-confirm',
                              getClassName('kcFormGroupErrorClass'),
                            ),
                          )}>
                          {/* <div className={getClassName('kcLabelWrapperClass')}>
                        <label
                          htmlFor="password-confirm"
                          className={getClassName('kcLabelClass')}
                        >
                          {msg('passwordConfirm')}
                        </label>
                      </div> */}
                          <div className={getClassName('kcInputWrapperClass')}>
                            <input
                              type="password"
                              id="password-confirm"
                              className={getClassName('kcInputClass')}
                              name="password-confirm"
                              placeholder="Confirm password"
                            />
                          </div>
                        </div>
                      </InputContainer>
                    </>
                  )}
                  <InputContainer>
                    <div
                      className={clsx(
                        getClassName('kcFormGroupClass'),
                        messagesPerField.printIfExists(
                          'phone',
                          getClassName('kcFormGroupErrorClass'),
                        ),
                      )}>
                      {/* <div className={getClassName('kcLabelWrapperClass')}>
                  <label
                    htmlFor="phone"
                    className={getClassName('kcLabelClass')}
                  >
                    {msg('phone')}
                  </label>
                </div> */}
                      <div className={getClassName('kcInputWrapperClass')}>
                        <input
                          type="text"
                          id="phone"
                          className={getClassName('kcInputClass')}
                          name="phone"
                          placeholder="Phone"
                          // defaultValue={register.formData.phone ?? ''}
                        />
                      </div>
                    </div>
                  </InputContainer>

                  {recaptchaRequired && (
                    <div className="form-group">
                      <div className={getClassName('kcInputWrapperClass')}>
                        <div
                          className="g-recaptcha"
                          data-size="compact"
                          data-sitekey={recaptchaSiteKey}></div>
                      </div>
                    </div>
                  )}
                  <div className={getClassName('kcFormGroupClass')}>
                    <div id="kc-form-buttons" className={getClassName('kcFormButtonsClass')}>
                      <RegisterButton>
                        <input
                          className={clsx(
                            getClassName('kcButtonClass'),
                            getClassName('kcButtonPrimaryClass'),
                            getClassName('kcButtonBlockClass'),
                            getClassName('kcButtonLargeClass'),
                          )}
                          type="submit"
                          value={msgStr('doRegister')}
                        />
                      </RegisterButton>
                    </div>
                    <div id="kc-form-options" className={getClassName('kcFormOptionsClass')}>
                      <div className={getClassName('kcFormOptionsWrapperClass')}>
                        {/* <a href={url.loginUrl}>{msg('backToLogin')}</a> */}
                        <LoginUrlText>
                          <p>Were you a member?</p>
                          <a href={url.loginUrl}>
                            <span>Back to Login</span>
                          </a>
                        </LoginUrlText>
                      </div>
                    </div>
                  </div>
                </FormContainer>
              </Section>
            </form>
          </Template>
        </Container>
        <BackgroundWrapper
          data-sy="BackgroundWrapper"
          style={{
            backgroundSize: 'cover',
            backgroundImage: `url(${mySvg})`,
            backgroundPosition: 'center',
          }}>
          <BackgroundContainer data-sy="BackgroundContainer">
            <WhiteLogo />
            <LogoContent>
              <span>
                astrago는 자원 최적화 기술을 활용하여 GPU 서버의 활용도를 극대화하는 솔루션입니다.
              </span>
              <span>
                이를 통해 학습 시간을 단축하여 사용자의 프로젝트 계획을 더욱 향상시킵니다.
              </span>
            </LogoContent>
          </BackgroundContainer>
        </BackgroundWrapper>
      </Wrapper>
    </>
  );
}

const Wrapper = styled('div')`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const BackgroundWrapper = styled('div')`
  flex-grow: 1;
  min-width: 1000px;
`;

const BackgroundContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  gap: 15px;
  height: 100%;
`;

const LogoContent = styled('div')`
  span {
    display: block;
    line-height: 28px;
  }
  font-weight: 500;
  font-size: 16px;
  text-align: center;
`;

const Container = styled('div')`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 620px;

  #kc-registration {
    font-size: 14px;
    text-align: center;
    span {
      color: #90919e;
    }

    a {
      margin-left: 5px;
      color: #5b29c7;
      font-weight: 700;
    }
  }
`;

const Section = styled('div')`
  margin: 0 auto;
  width: 380px;
`;

const Title = styled('div')`
  text-align: center;
`;

const SubTitle = styled('div')`
  color: #5b29c7;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  line-height: 25px;
  margin: 32px 0 34px 0;
`;

const FormContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  button {
    font-weight: 700;
  }
`;

const InputContainer = styled('div')<ErrorInputContainerProps>`
  background-color: #ffffff;
  border: ${(props) => (props.showError ? '1px solid #F14A4A' : '1px solid #D5D4D8')};
  height: 48px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 22px 0 20px;
  gap: 10px;
  transition: all 0.5s ease;

  &:focus-within {
    border: ${(props) => (props.showError ? '1px solid #F14A4A' : '1px solid #5b29c7')};
  }

  input {
    width: 360px;
    height: 28px;
    background: transparent;
    border-color: transparent;
    color: #17171f;
  }

  input::placeholder {
    size: 14px;
    font-style: normal;
    color: #90919e;
  }

  input:focus {
    outline: none;
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-text-fill-color: #17171f;
    -webkit-box-shadow: 0 0 0px 1000px #ffffff inset;
    box-shadow: 0 0 0px 1000px #ffffff inset;
    transition: background-color 5000s ease-in-out 0s;
  }
`;

const GuideText = styled('div')`
  font-weight: 400;
  font-size: 12px;
  color: #7a7a7a;
  margin-left: 20px;
  margin-bottom: 20px;
  margin-top: -14px;
`;

const RegisterButton = styled('div')`
  width: 462px;
  height: 54px;
  border-radius: 10px;
  cursor: pointer;

  background: #ff7525;
  border: none;
  margin-bottom: 16px;
  text-align: center;
  line-height: 54px;
  margin-top: 40px;
  input {
    background: transparent;
    border: none;
    color: #ffffff;
    font-weight: 700;
    font-size: 21px;
    cursor: pointer;
  }
`;

const LoginUrlText = styled('div')`
  font-size: 14px;
  text-align: center;
  color: #ffffff;
  text-decoration: none;
  display: flex;
  justify-content: center;
  span {
    margin-left: 5px;
    color: #ff7525;
    text-decoration: underline;
  }
`;
