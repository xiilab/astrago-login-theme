import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";

export default function Info(props: PageProps<Extract<KcContext, { pageId: "info.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { advancedMsgStr, msg } = i18n;

    const { messageHeader, message, requiredActions, skipLink, actionUri } = kcContext;

    // 간단하게 현재 접속한 origin으로 돌아가기
    const targetUrl = window.location.origin;

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
                    <span dangerouslySetInnerHTML={{ __html: message?.summary ?? "" }} />
                )
            }
        >
            <div id="kc-info-message">
                <p
                    className="instruction"
                    dangerouslySetInnerHTML={{
                        __html: (() => {
                            let html = message?.summary?.trim() ?? "";

                            if (requiredActions) {
                                html += " <b>";
                                html += requiredActions.map(requiredAction => advancedMsgStr(`requiredAction.${requiredAction}`)).join(", ");
                                html += "</b>";
                            }

                            return html;
                        })()
                    }}
                />
                {(() => {
                    if (skipLink) {
                        return null;
                    }

                    // ✅ actionUri가 있으면 우선 사용
                    if (actionUri) {
                        return (
                            <p>
                                <a href={actionUri}>{msg("proceedWithAction")}</a>
                            </p>
                        );
                    }

                    // ✅ 항상 현재 baseUrl로 돌아가는 링크 표시
                    return (
                        <p>
                            <a href={targetUrl}>{msg("backToApplication")}</a>
                        </p>
                    );
                })()}
            </div>
        </Template>
    );
} 