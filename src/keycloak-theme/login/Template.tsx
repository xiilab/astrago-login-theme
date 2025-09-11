// Copy pasted from: https://github.com/InseeFrLab/keycloakify/blob/main/src/login/Template.tsx

import { assert } from 'keycloakify/tools/assert';
import { clsx } from 'keycloakify/tools/clsx';
import { usePrepareTemplate } from 'keycloakify/lib/usePrepareTemplate';
import { type TemplateProps } from 'keycloakify/login/TemplateProps';
import { useGetClassName } from 'keycloakify/login/lib/useGetClassName';
import type { KcContext } from './kcContext';
import type { I18n } from './i18n';
import styled from '@emotion/styled';

export default function Template(props: TemplateProps<KcContext, I18n>) {
  const {
    displayInfo = false,
    displayMessage = true,
    displayRequiredFields = false,
    displayWide = false,
    showAnotherWayIfPresent = true,
    headerNode,
    showUsernameNode = null,
    infoNode = null,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
    children,
  } = props;

  const { getClassName } = useGetClassName({ doUseDefaultCss, classes });

  const { msg, changeLocale, labelBySupportedLanguageTag, currentLanguageTag } = i18n;

  const { realm, locale, auth, url, message, isAppInitiatedAction } = kcContext;

  const { isReady } = usePrepareTemplate({
    doFetchDefaultThemeResources: doUseDefaultCss,
    styles: [
      `${url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly.min.css`,
      `${url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly-additions.min.css`,
      `${url.resourcesCommonPath}/lib/zocial/zocial.css`,
      `${url.resourcesPath}/css/login.css`,
    ],
    htmlClassName: getClassName('kcHtmlClass'),
    bodyClassName: getClassName('kcBodyClass'),
  });

  if (!isReady) {
    return null;
  }

  return (
    <Container>
      <div className={getClassName('kcLoginClass')}>
        <div id="kc-header" className={getClassName("kcHeaderClass")} style={{
            textAlign: 'center',
            padding: '30px 0 10px 0',
            marginBottom: '0px'
        }}>
                <div 
                    id="kc-header-wrapper" 
                    className={getClassName("kcHeaderWrapperClass")}
                    style={{ 
                        fontFamily: '"Work Sans"',
                        fontSize: '32px',
                        fontWeight: '600',
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                >
                    DooGPU
                </div>
            </div>
        <Wrapper>
          <div
            className={clsx(
              // getClassName('kcFormCardClass'),
              displayWide && getClassName('kcFormCardAccountClass'),
            )}>
            {/* <header className={getClassName('kcFormHeaderClass')}>
              {realm.internationalizationEnabled &&
                (assert(locale !== undefined), true) &&
                locale.supported.length > 1 && (
                  <div id="kc-locale">
                    <div
                      id="kc-locale-wrapper"
                      className={getClassName('kcLocaleWrapperClass')}
                    >
                      <div className="kc-dropdown" id="kc-locale-dropdown">
                        // eslint-disable-next-line jsx-a11y/anchor-is-valid 
                        <a href="#" id="kc-current-locale-link">
                          {labelBySupportedLanguageTag[currentLanguageTag]}
                        </a>
                        <ul>
                          {locale.supported.map(({ languageTag }) => (
                            <li key={languageTag} className="kc-dropdown-item">
                              // eslint-disable-next-line jsx-a11y/anchor-is-valid 
                              <a
                                href="#"
                                onClick={() => changeLocale(languageTag)}
                              >
                                {labelBySupportedLanguageTag[languageTag]}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              {!(
                auth !== undefined &&
                auth.showUsername &&
                !auth.showResetCredentials
              ) ? (
                displayRequiredFields && (
                  <div className={getClassName('kcContentWrapperClass')}>
                    <div
                      className={clsx(
                        getClassName('kcLabelWrapperClass'),
                        'subtitle'
                      )}
                    >
                      <span className="subtitle">
                        <span className="required">*</span>
                        {msg('requiredFields')}
                      </span>
                    </div>
                    <div className="col-md-10">
                      <h1 id="kc-page-title">{headerNode}</h1>
                    </div>
                  </div>
                )
              ) : displayRequiredFields ? (
                <div className={getClassName('kcContentWrapperClass')}>
                  <div
                    className={clsx(
                      getClassName('kcLabelWrapperClass'),
                      'subtitle'
                    )}
                  >
                    <span className="subtitle">
                      <span className="required">*</span>{' '}
                      {msg('requiredFields')}
                    </span>
                  </div>
                  <div className="col-md-10">
                    {showUsernameNode}
                    <div className={getClassName('kcFormGroupClass')}>
                      <div id="kc-username">
                        <label id="kc-attempted-username">
                          {auth?.attemptedUsername}
                        </label>
                        <a id="reset-login" href={url.loginRestartFlowUrl}>
                          <div className="kc-login-tooltip">
                            <i className={getClassName('kcResetFlowIcon')}></i>
                            <span className="kc-tooltip-text">
                              {msg('restartLoginTooltip')}
                            </span>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {showUsernameNode}
                  <div className={getClassName('kcFormGroupClass')}>
                    <div id="kc-username">
                      <label id="kc-attempted-username">
                        {auth?.attemptedUsername}
                      </label>
                      <a id="reset-login" href={url.loginRestartFlowUrl}>
                        <div className="kc-login-tooltip">
                          <i className={getClassName('kcResetFlowIcon')}></i>
                          <span className="kc-tooltip-text">
                            {msg('restartLoginTooltip')}
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                </>
              )}
            </header> */}
            <div id="kc-content">
              <div id="kc-content-wrapper">
                {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
                {/* {displayMessage &&
                  message !== undefined &&
                  (message.type !== 'warning' || !isAppInitiatedAction) && (
                    <div className={clsx('alert', `alert-${message.type}`)}>
                      {message.type === 'success' && (
                        <span
                          className={getClassName('kcFeedbackSuccessIcon')}
                        ></span>
                      )}
                      {message.type === 'warning' && (
                        <span
                          className={getClassName('kcFeedbackWarningIcon')}
                        ></span>
                      )}
                      {message.type === 'error' && (
                        <span
                          className={getClassName('kcFeedbackErrorIcon')}
                        ></span>
                      )}
                      {message.type === 'info' && (
                        <span
                          className={getClassName('kcFeedbackInfoIcon')}
                        ></span>
                      )}
                      <span
                        className="kc-feedback-text"
                        dangerouslySetInnerHTML={{
                          __html: message.summary,
                        }}
                      />
                    </div>
                  )} */}
                {children}
                {auth !== undefined && auth.showTryAnotherWayLink && showAnotherWayIfPresent && (
                  <form
                    id="kc-select-try-another-way-form"
                    action={url.loginAction}
                    method="post"
                    className={clsx(displayWide && getClassName('kcContentWrapperClass'))}>
                    <div
                      className={clsx(
                        displayWide && [
                          getClassName('kcFormSocialAccountContentClass'),
                          getClassName('kcFormSocialAccountClass'),
                        ],
                      )}>
                      <div className={getClassName('kcFormGroupClass')}>
                        <input type="hidden" name="tryAnotherWay" value="on" />
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a
                          href="#"
                          id="try-another-way"
                          onClick={() => {
                            document.forms['kc-select-try-another-way-form' as never].submit();
                            return false;
                          }}>
                          {msg('doTryAnotherWay')}
                        </a>
                      </div>
                    </div>
                  </form>
                )}
                {displayInfo && (
                  <div id="kc-info" className={getClassName('kcSignUpClass')}>
                    <div id="kc-info-wrapper" className={getClassName('kcInfoAreaWrapperClass')}>
                      {infoNode}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Wrapper>
      </div>
    </Container>
  );
}

const Container = styled('div')`
  background: linear-gradient(135deg, #003f7f 0%, #005eb8 50%, #0078d4 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled('div')`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 120px);
  padding: 20px;
  margin-top: 20px;
  
  > div {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    padding: 30px;
    min-width: 400px;
    max-width: 500px;
  }
`;
