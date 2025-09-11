import type { PageProps } from 'keycloakify/login/pages/PageProps';
import type { KcContext } from '../kcContext';
import type { I18n } from '../i18n';

export default function Info(props: PageProps<Extract<KcContext, { pageId: 'info.ftl' }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { advancedMsgStr, msg } = i18n;

    const { messageHeader, message, requiredActions, skipLink, actionUri, url } = kcContext;

    // 간단하게 현재 접속한 origin으로 돌아가기
    const targetUrl = window.location.origin;

    // 디버깅을 위한 메시지 로깅
    console.log('Info.tsx Debug - kcContext:', kcContext);
    console.log('Info.tsx Debug - message:', message);
    console.log('Info.tsx Debug - messageHeader:', messageHeader);
    console.log('Info.tsx Debug - message?.summary:', message?.summary);

    // 승인 관련 메시지 감지
    const messageText = message?.summary || messageHeader || '';
    console.log('Info.tsx Debug - messageText:', messageText);
    
    const isApprovalPending = messageText.includes('승인 대기') || 
                             messageText.includes('거부되었습니다') ||
                             messageText.includes('approval') ||
                             messageText.includes('pending') ||
                             messageText.includes('계정 승인') ||
                             messageText.includes('승인');
    const isApprovalRequired = messageText.includes('승인 신청이 필요') ||
                              messageText.includes('ServiceNow');
                              
    console.log('Info.tsx Debug - isApprovalPending:', isApprovalPending);
    console.log('Info.tsx Debug - isApprovalRequired:', isApprovalRequired);

    const handleBackToLogin = () => {
        // Keycloak에서 제공하는 로그인 URL 사용
        window.location.href = url.loginUrl || url.loginAction || '/auth/realms/astrago/protocol/openid-connect/auth';
    };

    // 승인 관련 메시지인 경우 커스텀 UI 표시
    if (isApprovalPending || isApprovalRequired) {
        return (
            <div style={{
                background: 'linear-gradient(135deg, #003f7f 0%, #005eb8 50%, #0078d4 100%)',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{
                    textAlign: 'center',
                    padding: '30px 0 10px 0',
                    marginBottom: '0px'
                }}>
                    <div style={{
                        fontFamily: '"Work Sans"',
                        fontSize: '32px',
                        fontWeight: '600',
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                        DooGPU
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    minHeight: 'calc(100vh - 120px)',
                    padding: '20px',
                    marginTop: '20px'
                }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                        padding: '30px',
                        minWidth: '400px',
                        maxWidth: '500px',
                        margin: '0 auto',
                        width: '380px'
                    }}>
                        <div id="kc-form">
                            <div id="kc-form-wrapper">
                                {isApprovalPending && (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        padding: '40px 20px'
                                    }}>
                                        <div style={{ fontSize: '48px', marginBottom: '24px' }}>⏳</div>
                                        <div style={{
                                            color: '#005eb8',
                                            fontSize: '18px',
                                            fontWeight: '700',
                                            marginBottom: '16px'
                                        }}>승인 대기 중</div>
                                        <div style={{
                                            color: '#17171f',
                                            fontSize: '14px',
                                            lineHeight: '20px',
                                            marginBottom: '32px'
                                        }}>
                                            관리자가 계정을 검토하고 있습니다.
                                            <br />
                                            승인 완료 시 이메일로 알려드립니다.
                                        </div>
                                        <div style={{
                                            backgroundColor: '#f8f8f8',
                                            borderRadius: '8px',
                                            padding: '20px',
                                            width: '100%'
                                        }}>
                                            <div style={{
                                                color: '#17171f',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                marginBottom: '8px'
                                            }}>
                                                문의사항이 있으시면
                                                <br />
                                                <br />
                                                주관 담당자에게 문의 부탁드립니다.
                                            </div>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            marginTop: '16px'
                                        }}>
                                            <button
                                                onClick={handleBackToLogin}
                                                style={{
                                                    background: 'transparent',
                                                    border: '1px solid #d5d4d8',
                                                    color: '#17171f',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    padding: '12px 24px',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                로그인으로 돌아가기
                                            </button>
                                        </div>
                                    </div>
                                )}
                                
                                {isApprovalRequired && (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        padding: '40px 20px'
                                    }}>
                                        <div style={{ fontSize: '48px', marginBottom: '24px' }}>📝</div>
                                        <div style={{
                                            color: '#005eb8',
                                            fontSize: '18px',
                                            fontWeight: '700',
                                            marginBottom: '16px'
                                        }}>승인 신청 필요</div>
                                        <div style={{
                                            color: '#17171f',
                                            fontSize: '14px',
                                            lineHeight: '20px',
                                            marginBottom: '32px'
                                        }}>
                                            계정 사용을 위해 승인 신청이 필요합니다.
                                            <br />
                                            ServiceNow를 통해 승인을 신청해주세요.
                                        </div>
                                        <div style={{
                                            backgroundColor: '#f8f8f8',
                                            borderRadius: '8px',
                                            padding: '20px',
                                            width: '100%'
                                        }}>
                                            <div style={{
                                                color: '#17171f',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                marginBottom: '8px'
                                            }}>
                                                승인 신청 방법 안내
                                                <br />
                                                1. ServiceNow 포털 접속
                                                <br />
                                                2. IT 서비스 요청
                                                <br />
                                                3. 계정 승인 신청 작성
                                            </div>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            marginTop: '16px'
                                        }}>
                                            <button
                                                onClick={handleBackToLogin}
                                                style={{
                                                    background: 'transparent',
                                                    border: '1px solid #d5d4d8',
                                                    color: '#17171f',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    padding: '12px 24px',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                로그인으로 돌아가기
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 기본 Info 페이지 렌더링
    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={
                messageHeader ? (
                    <span dangerouslySetInnerHTML={{ __html: messageHeader }} />
                ) : (
                    <span dangerouslySetInnerHTML={{ __html: message?.summary ?? '' }} />
                )
            }
        >
            <div id="kc-info-message">
                <p
                    className="instruction"
                    dangerouslySetInnerHTML={{
                        __html: (() => {
                            let html = message?.summary?.trim() ?? '';

                            if (requiredActions) {
                                html += ' <b>';
                                html += requiredActions.map(requiredAction => advancedMsgStr(`requiredAction.${requiredAction}`)).join(', ');
                                html += '</b>';
                            }

                            return html;
                        })()
                    }}
                />
                {(() => {
                    if (skipLink) {
                        return null;
                    }

                    if (actionUri) {
                        return (
                            <p>
                                <a href={actionUri}>{msg('proceedWithAction')}</a>
                            </p>
                        );
                    }

                    return (
                        <p>
                            <a href={targetUrl}>{msg('backToApplication')}</a>
                        </p>
                    );
                })()}
            </div>
        </Template>
    );
}