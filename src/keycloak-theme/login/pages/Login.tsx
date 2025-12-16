import { useState, useEffect, type FormEventHandler } from 'react';
import { clsx } from 'keycloakify/tools/clsx';
import { useConstCallback } from 'keycloakify/tools/useConstCallback';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import { useGetClassName } from 'keycloakify/login/lib/useGetClassName';
import type { KcContext } from '../kcContext';
import type { I18n } from '../i18n';
import styled from '@emotion/styled';

import { ReactComponent as MailIcon } from './icons/mail_outline.svg';
import { ReactComponent as LockIcon } from './icons/lock_outline.svg';
import { ReactComponent as VisibilityOffIcon } from './icons/visibility_off_white.svg';
import { ReactComponent as VisibilityIcon } from './icons/remove_red_eye_white.svg';
import microsoftLogo from './microsoft_logo.png';
import background from '../assets/login-background.svg';
import logo from './white-logo.png';
import Footer from '../../Footer';
import { setCookie, getCookie, deleteCookie } from './shared/cookieUtils';
// 슬라이더 이미지 - 실제 이미지 파일 경로로 교체해주세요
import slide1 from './images/slide1.png';
import slide2 from './images/slide2.png';
import slide3 from './images/slide3.png';

const my_custom_param = new URL(window.location.href).searchParams.get(
  'my_custom_param',
);
if (my_custom_param !== null) {
  console.log('my_custom_param:', my_custom_param);
}

export default function Login(
  props: PageProps<Extract<KcContext, { pageId: 'login.ftl' }>, I18n> & {
    displayMessage?: boolean;
  },
) {
  const {
    kcContext,
    i18n,
    doUseDefaultCss,
    Template,
    classes,
    displayMessage = true,
  } = props;

  const { getClassName } = useGetClassName({
    doUseDefaultCss,
    classes,
  });

  const { social, realm, url, usernameHidden, login, auth, message } =
    kcContext;

  const { msg } = i18n;

  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
  const [passwordType, setPasswordType] = useState({
    type: 'password',
    visible: false,
  });
  const [isAdmin, setIsAdmin] = useState(false);
  // validation 메시지 상태 추가
  const [validationMessage, setValidationMessage] = useState<
    string | undefined
  >(undefined);
  // 팝업 상태 추가 - 페이지 진입 시 자동으로 열림
  const [isPopupOpen, setIsPopupOpen] = useState(true);
  // 이미지 슬라이더 상태
  const [currentSlide, setCurrentSlide] = useState(0);
  // 이미지 확대 모달 상태
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  
  // 슬라이드 데이터
  const slides = [
    {
      image: slide1,
      alt: '슬라이드 1',
      description: (
        <>
          이미지 커밋 할 실행 중인 워크로드 상세보기로 이동합니다.
          <br />
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start', textAlign: 'left' }}>
            <div style={{ fontSize: '13px', color: '#d32f2f', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>⚠</span>
              <span>주의사항</span>
            </div>
            <div style={{ fontSize: '13px', color: '#666666', lineHeight: '1.7', paddingLeft: '20px' }}>
              <div>
                • 실행 중인 워크로드만 가능합니다.
              </div>
            </div>
          </div>
        </>
      )
    },
    {
      image: slide2,
      alt: '슬라이드 2',
      description: '상세보기의 이미지 및 리소스 Private Registry의 Commit Image 실행을 클릭합니다.'
    },
    {
      image: slide3,
      alt: '슬라이드 3',
      description: (
        <>
          이미지명과 태그명을 입력 후 저장 버튼을 클릭합니다.
          <br />
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start', textAlign: 'left' }}>
            <div style={{ fontSize: '13px', color: '#d32f2f', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>⚠</span>
              <span>주의사항</span>
            </div>
            <div style={{ fontSize: '13px', color: '#666666', lineHeight: '1.7', paddingLeft: '20px' }}>
              <div style={{ marginBottom: '6px' }}>
                • 네트워크 및 이미지 용량으로 인해 백업 시간이 소요될 수 있습니다.
              </div>
              <div>
                • 이미지 저장 후 워크스페이스 &gt; 리포지토리 &gt; Private Registry에서 해당 이미지를 확인할 수 있습니다.
              </div>
            </div>
          </div>
        </>
      )
    }
  ];

  // 페이지 진입 시 팝업 자동 표시
  useEffect(() => {
    setIsPopupOpen(true);
  }, []);

  // 이미지 슬라이더 자동 전환 (1 -> 2 -> 3 -> 1 순서)
  useEffect(() => {
    if (!isPopupOpen) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        // 0 -> 1 -> 2 -> 0 순서로 순차 전환
        return (prev + 1) % slides.length;
      });
    }, 10000); // 10초마다 자동 전환

    return () => clearInterval(interval);
  }, [isPopupOpen, slides.length]);

  // 슬라이더 네비게이션 함수
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => {
      // 역순 전환
      return (prev - 1 + slides.length) % slides.length;
    });
  };

  const goToNext = () => {
    setCurrentSlide((prev) => {
      // 순차 전환
      return (prev + 1) % slides.length;
    });
  };

  // ===== onSubmit 함수 수정 =====
  const onSubmit = useConstCallback<FormEventHandler<HTMLFormElement>>((e) => {
    e.preventDefault();

    setIsLoginButtonDisabled(true);

    const formElement = e.target as HTMLFormElement;
    const emailInput = formElement.querySelector(
      "input[name='email']",
    ) as HTMLInputElement;
    const username = emailInput?.value || '';

    // 비밀번호 공백 체크
    const passwordInput = formElement.querySelector(
      "input[name='password']",
    ) as HTMLInputElement;
    if (!passwordInput || passwordInput.value.trim() === '') {
      setIsLoginButtonDisabled(false);
      setValidationMessage('비밀번호를 입력해 주세요.');
      passwordInput?.focus();
      return;
    }

    // 쿠키에서 실패 정보 확인
    const failInfo = getCookie(`login_fail_${username}`);
    if (failInfo) {
      try {
        const { count, until } = JSON.parse(failInfo);
        const now = Date.now();
        if (count >= 5 && now < until) {
          setValidationMessage(
            '보안 정책으로 이 기기에서 로그인 시도가 제한되었습니다. 5분 후 다시 시도하세요.',
          );
          setIsLoginButtonDisabled(false);
          return;
        }
      } catch (e) {
        // 쿠키 파싱 오류 시 무시
      }
    }

    //NOTE: Even if we login with email Keycloak expect username and password in
    //the POST request.
    formElement
      .querySelector("input[name='email']")
      ?.setAttribute('name', 'username');

    setValidationMessage(undefined); // 로그인 시도 전 메시지 초기화
    formElement.submit();
  });
  // ===== onSubmit 함수 끝 =====

  // handlePasswordType 함수 복원
  const handlePasswordType = () => {
    setPasswordType(() => {
      if (!passwordType.visible) {
        return { type: 'text', visible: true };
      }
      return { type: 'password', visible: false };
    });
  };

  // kcContext.message.summary가 존재하는 경우 message 상태 업데이트 및 실패 횟수 관리
  useEffect(() => {
    if (message?.summary) {
      setValidationMessage(message.summary);

      // 실패한 계정명 추출
      const form = document.getElementById(
        'kc-form-login',
      ) as HTMLFormElement | null;
      let emailInput = form?.querySelector(
        "input[name='email']",
      ) as HTMLInputElement | null;
      if (!emailInput) {
        // 이미 name이 username으로 바뀌었을 수 있음
        emailInput = form?.querySelector(
          "input[name='username']",
        ) as HTMLInputElement | null;
      }
      const username = emailInput?.value || login.username || '';

      if (username) {
        const failInfo = getCookie(`login_fail_${username}`);
        let count = 1;
        let until = 0;
        const now = Date.now();
        if (failInfo) {
          try {
            const parsed = JSON.parse(failInfo);
            count = parsed.count + 1;
            until = parsed.until;
          } catch (e) {
            // 쿠키 파싱 오류 시 무시
          }
        }
        if (count >= 5) {
          until = now + 5 * 60 * 1000; // 5분 제한
          setCookie(
            `login_fail_${username}`,
            JSON.stringify({ count, until }),
            5,
          );
        } else {
          setCookie(
            `login_fail_${username}`,
            JSON.stringify({ count, until: 0 }),
            5,
          );
        }
      }
    } else {
      // 로그인 성공 시 쿠키 삭제
      const username = login.username || '';
      if (username) {
        deleteCookie(`login_fail_${username}`);
      }
    }
  }, [message, login.username]);

  return (
    <>
      <Wrapper>
        <Container>
          <Template
            {...{ kcContext, i18n, doUseDefaultCss, classes }}
            displayInfo={social.displayInfo}
            displayWide={realm.password && social.providers !== undefined}
            headerNode={msg('doLogIn')}>
            <Section>
              {/* <Title>ASTRAGO</Title> */}
              <Title>DooGPU</Title>
              <SubTitle>Login to your Account</SubTitle>
              <div
                id="kc-form"
                className={clsx(
                  realm.password &&
                    social.providers !== undefined &&
                    getClassName('kcContentWrapperClass'),
                )}>
                <div
                  id="kc-form-wrapper"
                  className={clsx(
                    realm.password &&
                      social.providers && [
                        getClassName('kcFormSocialAccountContentClass'),
                        getClassName('kcFormSocialAccountClass'),
                      ],
                  )}>
                  {realm.password && (
                    <>
                      {isAdmin ? (
                        <form
                          id="kc-form-login"
                          onSubmit={onSubmit}
                          action={url.loginAction}
                          method="post">
                          <div className={getClassName('kcFormGroupClass')}>
                            {(() => {
                                const label = !realm.loginWithEmailAllowed
                                  ? 'username'
                                  : realm.registrationEmailAsUsername
                                    ? 'email'
                                    : 'usernameOrEmail';

                                const autoCompleteHelper: typeof label =
                                  label === 'usernameOrEmail'
                                    ? 'username'
                                    : label;

                                return (
                                  <>
                                    <InputContainer
                                      showError={
                                        displayMessage && message !== undefined
                                      }>
                                      <MailIcon />
                                      <input
                                        tabIndex={1}
                                        id={autoCompleteHelper}
                                        className={getClassName('kcInputClass')}
                                        name={autoCompleteHelper}
                                        defaultValue={login.username}
                                        placeholder="E-mail"
                                        type="text"
                                        autoFocus={true}
                                      />
                                    </InputContainer>
                                  </>
                                );
                              })()}
                          </div>
                          <div
                            className={getClassName('kcFormGroupClass')}
                            style={{ marginBottom: 16 }}>
                            <PasswordInputWrapper>
                              <PasswordInputContainer
                                showError={
                                  displayMessage && message !== undefined
                                }>
                                <LockIcon />
                                <input
                                  tabIndex={2}
                                  id="password"
                                  className={getClassName('kcInputClass')}
                                  name="password"
                                  type={passwordType.type}
                                  placeholder="Password"
                                />
                                <VisibleButton onClick={handlePasswordType}>
                                  {passwordType.visible ? (
                                    <VisibilityIcon />
                                  ) : (
                                    <VisibilityOffIcon />
                                  )}
                                </VisibleButton>
                              </PasswordInputContainer>
                              {displayMessage &&
                                (validationMessage !== undefined ||
                                  message !== undefined) && (
                                  <div
                                    className={clsx(
                                      'alert',
                                      `alert-${message?.type}`,
                                    )}>
                                    <ErrorText
                                      className="kc-feedback-text"
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          validationMessage ||
                                          message?.summary ||
                                          '',
                                      }}
                                    />
                                  </div>
                                )}
                            </PasswordInputWrapper>
                          </div>
                          <div
                            id="kc-form-buttons"
                            className={getClassName('kcFormGroupClass')}>
                            <input
                              type="hidden"
                              id="id-hidden-input"
                              name="credentialId"
                              {...(auth?.selectedCredential !== undefined
                                ? {
                                    value: auth.selectedCredential,
                                  }
                                : {})}
                            />
                            <LoginButtonWrapper>
                              <LoginButton>
                                <input
                                  tabIndex={4}
                                  name="login"
                                  id="kc-login"
                                  type="submit"
                                  value="LOG IN"
                                  disabled={isLoginButtonDisabled}
                                />
                              </LoginButton>
                            </LoginButtonWrapper>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div>
                            {/* Azure Login 버튼 */}
                            {realm.password &&
                              social.providers !== undefined && (
                                <div
                                  id="kc-social-providers"
                                  className={clsx(
                                    getClassName(
                                      'kcFormSocialAccountContentClass',
                                    ),
                                    getClassName('kcFormSocialAccountClass'),
                                  )}>
                                  <ul
                                    className={clsx(
                                      getClassName(
                                        'kcFormSocialAccountListClass',
                                      ),
                                      social.providers.length > 4 &&
                                        getClassName(
                                          'kcFormSocialAccountDoubleListClass',
                                        ),
                                    )}>
                                    {social.providers.map((p) => (
                                      <li
                                        key={p.providerId}
                                        className={getClassName(
                                          'kcFormSocialAccountListLinkClass',
                                        )}>
                                        <a
                                          href={p.loginUrl}
                                          id={`zocial-${p.alias}`}
                                          className={clsx(
                                            'zocial',
                                            p.providerId,
                                          )}>
                                          <span>{p.displayName}</span>
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Section>
          </Template>
          <FooterWrapper>
            <Footer 
              showAdminButton={!isAdmin}
              onAdminClick={() => setIsAdmin(true)}
              showGeneralButton={isAdmin}
              onGeneralClick={() => setIsAdmin(false)}
            />
          </FooterWrapper>
        </Container>
        <BackgroundWrapper
          data-sy="BackgroundWrapper"
          style={{
            backgroundSize: 'cover',
            backgroundImage: `url(${background})`,
            backgroundPosition: 'center',
          }}>
          <BackgroundContainer data-sy="BackgroundContainer">
            <img src={logo} alt="logo" />
          </BackgroundContainer>
        </BackgroundWrapper>
      </Wrapper>
      {/* 팝업 모달 */}
      {isPopupOpen && (
        <ModalOverlay onClick={() => setIsPopupOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitleWrapper>
                <ModalTitle>DooGPU 시스템 업그레이드 작업 공지</ModalTitle>
              </ModalTitleWrapper>
            </ModalHeader>
            <ModalBody>
              <NoticeDate>
                <DateText>12/27 (토) ~ 12/30 (화)</DateText>
              </NoticeDate>
              <NoticeContent>
                <NoticeSection>
                  <NoticeItemTitle>백업 안내</NoticeItemTitle>
                  <NoticeItemText>
                    Private Registry에서 사용중인 이미지에 대해 백업 부탁드립니다.
                    <NoticeSubText>(백업 생성 시간에 5~10분 소요될 수 있음)</NoticeSubText>
                  </NoticeItemText>
                </NoticeSection>
                <NoticeSection>
                  <NoticeItemTitle>백업 방법</NoticeItemTitle>
                  <NoticeItemText>
                    실행중인 워크로드 상세보기 &gt; Container Image 실행 &gt; 이름 및 태그 입력
                  </NoticeItemText>
                </NoticeSection>
                <NoticeFooter>
                  <ImageSlider>
                    <SliderContainer>
                      <SliderTrack 
                        style={{ 
                          transform: `translateX(-${currentSlide * 33.333333}%)`,
                          transition: 'transform 0.5s ease-in-out'
                        }}
                      >
                        {slides.map((slide, index) => (
                          <Slide key={index}>
                            <SlideContent>
                              <SlideImage 
                                src={slide.image} 
                                alt={slide.alt}
                                onClick={() => setEnlargedImage(slide.image)}
                                style={{ cursor: 'pointer' }}
                              />
                              <SlideDescription>{slide.description}</SlideDescription>
                            </SlideContent>
                          </Slide>
                        ))}
                      </SliderTrack>
                    </SliderContainer>
                    <SliderControls>
                      <SliderButton onClick={goToPrevious} aria-label="이전 이미지">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15 18L9 12L15 6" stroke="#005eb8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </SliderButton>
                      <SliderIndicators>
                        {slides.map((_, index) => (
                          <Indicator
                            key={index}
                            active={currentSlide === index}
                            onClick={() => goToSlide(index)}
                            aria-label={`슬라이드 ${index + 1}`}
                          />
                        ))}
                      </SliderIndicators>
                      <SliderButton onClick={goToNext} aria-label="다음 이미지">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 18L15 12L9 6" stroke="#005eb8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </SliderButton>
                    </SliderControls>
                  </ImageSlider>
                </NoticeFooter>
              </NoticeContent>
            </ModalBody>
            <ModalFooter>
              <ModalButton onClick={() => setIsPopupOpen(false)}>
                확인
              </ModalButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
      {/* 이미지 확대 모달 */}
      {enlargedImage && (
        <ImageEnlargeOverlay onClick={() => setEnlargedImage(null)}>
          <ImageEnlargeContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <ImageEnlargeCloseButton onClick={() => setEnlargedImage(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </ImageEnlargeCloseButton>
            <EnlargedImage src={enlargedImage} alt="확대된 이미지" />
          </ImageEnlargeContent>
        </ImageEnlargeOverlay>
      )}
    </>
  );
}
const FooterWrapper = styled('div')`
  position: absolute;
  bottom: 0;
`;

const Wrapper = styled('div')`
  display: flex;
  flex-direction: row;
  width: 100%;

  & .kcFormSocialAccountListClass {
    list-style: none;
  }

  /* 동적으로 생성되는 Azure AD 로그인 버튼 스타일 - LOG IN 버튼과 동일한 스타일 */
  #zocial-azuread {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 380px !important;
    height: 54px !important;
    background: #005eb8 !important;
    border: none !important;
    border-radius: 12px !important;
    text-decoration: none !important;
    color: #ffffff !important;
    font-weight: 700 !important;
    font-size: 16px !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;

    &:hover {
      background: #004a9a !important;
    }

    /* Microsoft 로고 제거 */
    &:before {
      display: none !important;
    }

    /* 기존 텍스트를 숨기고 새로운 텍스트 표시 */
    span {
      display: none !important;
    }

    /* LOG IN 텍스트를 :after 가상 요소로 추가 */
    &:after {
      content: 'LOG IN' !important;
      color: #ffffff !important;
      font-weight: 700 !important;
      font-size: 16px !important;
    }
  }
`;

const BackgroundWrapper = styled('div')`
  flex-grow: 1;
  min-width: 1000px;
  position: relative;
`;

const BackgroundContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  gap: 15px;
  height: 100%;
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);

  & img {
    width: 100%;
    height: 80px;
  }
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
  margin-bottom: 160px;
`;

const Title = styled('h1')`
  text-align: center;
  font-size: 56px;
  font-weight: 700;
  color: #005eb8;
  margin: 0;
  font-family: 'Work Sans', sans-serif;
`;

const SubTitle = styled('div')`
  color: #005eb8;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  line-height: 25px;
  margin: 15px 0 34px 0;
`;

const InputContainer = styled('div')<ErrorInputContainerProps>`
  background-color: #ffffff;
  border: ${(props) =>
    props.showError ? '1px solid #F14A4A' : '1px solid #D5D4D8'};
  height: 48px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 22px 0 20px;
  gap: 10px;
  transition: all 0.5s ease;

  &:focus-within {
    border: ${(props) =>
      props.showError ? '1px solid #F14A4A' : '1px solid #005EB8'};
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

const PasswordInputWrapper = styled('div')`
  position: relative;
`;

interface ErrorInputContainerProps {
  showError: boolean;
}

const PasswordInputContainer = styled(InputContainer)<ErrorInputContainerProps>`
  margin-top: 16px;
  border: ${(props) =>
    props.showError ? '1px solid #F14A4A' : '1px solid #E2E1E7'};
`;

// const ResetWrapper = styled('div')`
//   text-align: right;
//   text-decoration: none;
//   margin-bottom: 27px;
//   a {
//     color: #7a7a7a;
//     font-size: 12px;
//   }
// `;

const Button = styled('button')`
  width: 380px;
  height: 54px;
  border-radius: 12px;
  cursor: pointer;
`;

const VisibleButton = styled('div')`
  background: transparent;
  cursor: pointer;
  border: none;
  height: 18px;
`;

const LoginButtonWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 14px;
`;

const UserDescription = styled('div')`
  color: #17171f;
  font-size: 12px;
  text-align: center;
`;

const ModeWrapper = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

const AdminModeLink = styled('button')`
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  color: #005eb8;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  padding: 0;

  &:hover {
    color: #003d7a;
  }
`;


const LoginButton = styled(Button)`
  background: #005eb8;
  border: none;
  input,
  button {
    background: transparent;
    border: none;
    color: #ffffff;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }
`;

const ErrorText = styled('div')`
  color: #f14a4a;
  font-size: 11px;
  line-height: 16px;
  position: absolute;
  bottom: -30px;
  left: 10px;
`;

// 팝업 관련 스타일 컴포넌트
const ModalOverlay = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled('div')`
  background: #ffffff;
  border-radius: 16px;
  width: 90%;
  max-width: 750px;
  max-height: 85vh;
  overflow: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease;
  position: relative;

  @keyframes slideUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 32px 24px 32px;
  border-bottom: 2px solid #f0f0f0;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
`;

const ModalTitleWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const ModalTitle = styled('h2')`
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: #005eb8;
  font-family: 'Work Sans', sans-serif;
  text-align: center;
  letter-spacing: -0.5px;
`;

const ModalBody = styled('div')`
  padding: 32px;
  color: #17171f;
  font-size: 15px;
  line-height: 1.8;
`;

const NoticeDate = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #005eb8;
  text-align: center;
  margin-bottom: 28px;
  padding: 18px 24px;
  background: linear-gradient(135deg, #e8f2ff 0%, #f0f7ff 100%);
  border-radius: 12px;
  border: 1px solid #d0e5ff;
`;

const DateText = styled('span')`
  font-weight: 600;
`;

const NoticeContent = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const NoticeSection = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const NoticeItemTitle = styled('div')`
  color: #005eb8;
  font-size: 20px;
  font-weight: 700;
  font-family: 'Work Sans', sans-serif;
  margin-bottom: 4px;
`;

const NoticeItemText = styled('div')`
  color: #17171f;
  font-size: 16px;
  line-height: 1.9;
  font-weight: 500;
`;

const NoticeSubText = styled('span')`
  display: block;
  color: #666666;
  font-size: 14px;
  margin-top: 10px;
  padding-left: 0;
  font-weight: 400;
`;

const NoticeFooter = styled('div')`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px solid #e8f2ff;
  text-align: center;
`;

const NoticeFooterText = styled('div')`
  color: #005eb8;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.8;
`;

const ImageSlider = styled('div')`
  width: 100%;
  position: relative;
  margin-top: 8px;
`;

const SliderContainer = styled('div')`
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
  background: #f8f9ff;
  position: relative;
`;

const SliderTrack = styled('div')`
  display: flex;
  transition: transform 0.5s ease-in-out;
  width: 300%;
  height: 100%;
`;

const Slide = styled('div')`
  width: 33.333333%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
`;

const SlideContent = styled('div')`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const SlideImage = styled('img')`
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: contain;
  border-radius: 8px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const SlideDescription = styled('div')`
  width: 100%;
  color: #17171f;
  font-size: 16px;
  line-height: 1.8;
  text-align: center;
  font-weight: 500;
  padding: 0 8px;
  word-break: keep-all;
`;

const ImageEnlargeOverlay = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease;
  cursor: pointer;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ImageEnlargeContent = styled('div')`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
`;

const ImageEnlargeCloseButton = styled('button')`
  position: absolute;
  top: -50px;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  z-index: 2001;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const EnlargedImage = styled('img')`
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

const SliderControls = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
`;

const SliderButton = styled('button')`
  background: #ffffff;
  border: 2px solid #005eb8;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;

  &:hover {
    background: #005eb8;
    svg path {
      stroke: #ffffff;
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

const SliderIndicators = styled('div')`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Indicator = styled('button')<{ active: boolean }>`
  width: ${(props) => (props.active ? '24px' : '8px')};
  height: 8px;
  border-radius: 4px;
  border: none;
  background: ${(props) => (props.active ? '#005eb8' : '#d0e5ff')};
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;

  &:hover {
    background: ${(props) => (props.active ? '#004a9a' : '#a8d0ff')};
  }
`;

const ModalFooter = styled('div')`
  padding: 24px 32px;
  border-top: 2px solid #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fafbfc;
`;

const ModalButton = styled('button')`
  padding: 14px 56px;
  background: linear-gradient(135deg, #005eb8 0%, #004a9a 100%);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;
  box-shadow: 0 4px 12px rgba(0, 94, 184, 0.3);

  &:hover {
    background: linear-gradient(135deg, #004a9a 0%, #003d7a 100%);
    box-shadow: 0 6px 16px rgba(0, 94, 184, 0.4);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(0, 94, 184, 0.3);
  }
`;