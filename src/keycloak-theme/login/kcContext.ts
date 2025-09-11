import { createGetKcContext } from 'keycloakify/login';

export type KcContextExtension =
  // WARNING: It's important to keep in sync the extraThemeProperties declared in the package.json and this type definition.
  | { pageId: 'login.ftl'; extraThemeProperties: { foo: string } }
  | { pageId: 'my-extra-page-1.ftl' }
  | { pageId: 'my-extra-page-2.ftl'; someCustomValue: string }
  // | { pageId: 'approval_check_flow.ftl'; approvalYN: 'Y' | 'N' }
  // NOTE: register.ftl is deprecated in favor of register-user-profile.ftl
  // but let's say we use it anyway and have this plugin enabled: https://github.com/micedre/keycloak-mail-whitelisting
  // keycloak-mail-whitelisting define the non standard ftl global authorizedMailDomains, we declare it here.
  | { pageId: 'register.ftl'; authorizedMailDomains: string[] };

//NOTE: In most of the cases you do not need to overload the KcContext, you can
// just call createGetKcContext(...) without type arguments.
// You want to overload the KcContext only if:
// - You have custom plugins that add some values to the context (like https://github.com/micedre/keycloak-mail-whitelisting that adds authorizedMailDomains)
// - You want to add support for extra pages that are not yey featured by default, see: https://docs.keycloakify.dev/contributing#adding-support-for-a-new-page
export const { getKcContext } = createGetKcContext<KcContextExtension>({
  mockData: [
    {
      pageId: 'login.ftl',
      locale: {
        //When we test the login page we do it in french
        currentLanguageTag: 'ko',
      },
      //Uncomment the following line for hiding the Alert message
      //"message": undefined
      //Uncomment the following line for showing an Error message
      //message: { type: "error", summary: "This is an error" }
    },
    {
      pageId: 'my-extra-page-2.ftl',
      someCustomValue: 'foo bar baz',
    },
    // Info 페이지를 통한 Approval Check Flow 테스트
    {
      pageId: 'info.ftl',
      messageHeader: '승인 대기',
      locale: {
        currentLanguageTag: 'ko',
      },
    },
    {
      //NOTE: You will either use register.ftl (legacy) or register-user-profile.ftl, not both
      pageId: 'register-user-profile.ftl',
      locale: {
        currentLanguageTag: 'ko',
      },
      profile: {
        attributes: [
          {
            validators: {
              pattern: {
                pattern: '^[a-zA-Z0-9]+$',
                'ignore.empty.value': true,
                // eslint-disable-next-line no-template-curly-in-string
                'error-message': '${alphanumericalCharsOnly}',
              },
            },
            //NOTE: To override the default mock value
            value: undefined,
            name: 'username',
          },
          {
            validators: {
              options: {
                options: [
                  'male',
                  'female',
                  'non-binary',
                  'transgender',
                  'intersex',
                  'non_communicated',
                ],
              },
            },
            // eslint-disable-next-line no-template-curly-in-string
            displayName: '${gender}',
            annotations: {},
            required: true,
            groupAnnotations: {},
            readOnly: false,
            name: 'gender',
          },
        ],
      },
    },
    {
      pageId: 'register.ftl',
      authorizedMailDomains: [
        'example.com',
        'another-example.com',
        '*.yet-another-example.com',
        '*.example.com',
        'hello-world.com',
      ],
      // Simulate we got an error with the email field
      messagesPerField: {
        printIfExists: <T>(fieldName: string, className: T) => {
          console.log({ fieldName });
          return fieldName === 'email' ? className : undefined;
        },
        existsError: (fieldName: string) => fieldName === 'email',
        get: (fieldName: string) => `Fake error for ${fieldName}`,
        exists: (fieldName: string) => fieldName === 'email',
      },
    },
  ],
});

export const { kcContext } = getKcContext({
  // ========================================
  // 테스트 설정 가이드
  // ========================================
  // 1. 로그인 페이지 테스트 (현재 활성화)
  // mockPageId: 'login.ftl',
  // 2. Approval Check Flow 직접 테스트
  //    - 승인 대기 상태 (approvalYN: 'N') 테스트
  //    - 승인 완료 상태 (approvalYN: 'Y') 테스트
  // mockPageId: 'approval_check_flow.ftl',
  // 3. Info 페이지를 통한 Approval Check Flow 테스트
  //    - 실제 키클락 환경에서 post-broker-login 리다이렉션 시뮬레이션
  //    - URL 파라미터 기반 조건부 렌더링 테스트
  // mockPageId: 'info.ftl',
  // 4. 다른 페이지 테스트
  // mockPageId: 'idp-review-user-profile.ftl',
  // mockPageId: 'register.ftl',
  mockPageId: 'error.ftl',
  // ========================================
  // 403 Forbidden 오류 해결 방법:
  // 1. 개발 환경에서는 위의 mockPageId를 사용하여 테스트
  // 2. 실제 키클락 환경에서는 Post Broker Login Flow 설정 필요
  // 3. 브라우저에서 직접 post-broker-login 접근은 불가능 (인증 세션 필요)
  // ========================================
});

export type KcContext = NonNullable<
  ReturnType<typeof getKcContext>['kcContext']
>;
