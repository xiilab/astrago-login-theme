import type { PageProps } from 'keycloakify/login/pages/PageProps';
import type { KcContext } from '../kcContext';
import type { I18n } from '../i18n';

export default function Error(props: PageProps<Extract<KcContext, { pageId: 'error.ftl' }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { message, client } = kcContext;

    const handleBackToLogin = () => {
        window.location.href = '/auth/realms/astrago/login';
    };

    return (
        <Template
            {...{ kcContext, i18n, doUseDefaultCss, classes }}
            displayMessage={false}
            headerNode="DooGPU">
            <div style={{ margin: '0 auto', width: '380px' }}>
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
        </Template>
    );
}