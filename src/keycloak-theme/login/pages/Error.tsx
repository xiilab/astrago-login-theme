import type { PageProps } from 'keycloakify/login/pages/PageProps';
import type { KcContext } from '../kcContext';
import type { I18n } from '../i18n';

export default function Error(props: PageProps<Extract<KcContext, { pageId: 'error.ftl' }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { message, client, url } = kcContext;

    // post-broker-login에서 오는 경우 승인 대기로 처리
    const currentUrl = window.location.href;
    const isPostBrokerLogin = currentUrl.includes('post-broker-login') || 
                             currentUrl.includes('login-actions');
    
    console.log('Error.tsx Debug - currentUrl:', currentUrl);
    console.log('Error.tsx Debug - isPostBrokerLogin:', isPostBrokerLogin);
    console.log('Error.tsx Debug - message:', message);

    const handleBackToLogin = () => {
        // Keycloak에서 제공하는 로그인 URL 사용
        window.location.href = url.loginUrl || url.loginAction || '/auth/realms/astrago/login';
    };

    // post-broker-login URL이면 승인 대기 UI로 리다이렉트
    if (isPostBrokerLogin) {
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
                                        width: '100%',
                                        marginBottom: '16px'
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                padding: '40px 20px'
                            }}>
                                <div style={{ fontSize: '48px', marginBottom: '24px' }}>⚠️</div>
                                <div style={{
                                    color: '#d32f2f',
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    marginBottom: '16px'
                                }}>오류가 발생했습니다</div>
                                <div style={{
                                    color: '#17171f',
                                    fontSize: '14px',
                                    lineHeight: '20px',
                                    marginBottom: '32px'
                                }}>
                                    {message?.summary ? (
                                        <span dangerouslySetInnerHTML={{ __html: message.summary }} />
                                    ) : (
                                        '예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
                                    )}
                                </div>
                                <div style={{
                                    backgroundColor: '#f8f8f8',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    width: '100%',
                                    marginBottom: '16px'
                                }}>
                                    <div style={{
                                        color: '#17171f',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        marginBottom: '8px'
                                    }}>
                                        문제가 지속되면
                                        <br />
                                        <br />
                                        주관 담당자에게 문의해주세요.
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}