# AstraGo Login Theme

Keycloak 26.x 호환 로그인 테마 (Keycloakify 11.x + Vite 기반)

## 요구사항

- Node.js 18.x 이상
- npm 9.x 이상
- Maven (테마 JAR 빌드 시 필요)

## 빠른 시작

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# Keycloak 테마 JAR 빌드
npm run build-keycloak-theme
```

## 개발 모드

개발 서버 실행 시 `src/main.tsx`에서 Mock KcContext가 자동으로 활성화됩니다.

```typescript
// src/main.tsx
if (import.meta.env.DEV) {
  window.kcContext = getKcContextMock({
    pageId: "login.ftl",  // 테스트할 페이지 변경 가능
    overrides: {
      // 필요시 오버라이드 데이터 추가
    }
  });
}
```

### 테스트 가능한 페이지

- `login.ftl` - 로그인 페이지
- `register.ftl` - 회원가입 페이지
- `login-reset-password.ftl` - 비밀번호 재설정
- `login-update-password.ftl` - 비밀번호 변경
- `error.ftl` - 에러 페이지

## 프로젝트 구조

```
src/
├── keycloak-theme/
│   ├── login/
│   │   ├── pages/           # 커스텀 페이지 컴포넌트
│   │   │   └── Login.tsx    # 로그인 페이지
│   │   ├── i18n.ts          # 다국어 설정
│   │   ├── KcContext.ts     # KcContext 타입 확장
│   │   ├── KcPage.tsx       # 페이지 라우터
│   │   ├── KcPageStory.tsx  # 개발용 Mock Context
│   │   └── Template.tsx     # 페이지 템플릿
│   └── kc.gen.ts            # Keycloakify 자동 생성 파일
├── main.tsx                 # 앱 엔트리포인트
└── main.app.tsx             # 비-Keycloak 앱 (선택)
```

## 빌드 출력

```bash
npm run build-keycloak-theme
```

빌드 후 생성되는 파일:
- `dist_keycloak/keycloak-theme.jar` - Keycloak 25+ 호환 테마

## Keycloak에 테마 적용

1. JAR 파일을 Keycloak의 `providers/` 디렉토리에 복사
2. Keycloak 재시작
3. Admin Console에서 Realm Settings > Themes > Login Theme 선택

```bash
# Docker 예시
docker cp dist_keycloak/keycloak-theme.jar keycloak:/opt/keycloak/providers/
docker exec keycloak /opt/keycloak/bin/kc.sh build
docker restart keycloak
```

## 환경 변수

vite.config.ts에서 Keycloakify 설정 확인:

```typescript
keycloakify({
  accountThemeImplementation: "none",
  keycloakVersionTargets: {
    hasAccountTheme: false,
    "21-and-below": false,
    "23": false,
    "24": false,
    "25-and-above": "keycloak-theme.jar"
  }
})
```

## CI/CD

### GitHub Actions

`v*` 태그 푸시 시 자동으로:
1. 테마 빌드
2. Docker 이미지 빌드 및 푸시
3. GitHub Release 생성

```bash
# 릴리즈 방법
# 1. package.json version 업데이트
# 2. 태그 생성 및 푸시
git tag v1.0.0
git push origin v1.0.0
```

### GitLab CI

main 브랜치 푸시 및 태그 생성 시 자동 빌드

## 커스터마이징

### 새 페이지 추가

1. `src/keycloak-theme/login/pages/` 에 컴포넌트 생성
2. `KcPage.tsx`에서 import 및 라우팅 추가

### 스타일 수정

- Emotion styled-components 사용
- `Template.tsx`에서 전역 스타일 수정
- 각 페이지 컴포넌트에서 개별 스타일 적용

### 다국어 추가

`src/keycloak-theme/login/i18n.ts`에서 번역 추가:

```typescript
.withCustomTranslations({
  en: {
    // 기본 번역 (현재 한국어로 설정됨)
  },
  ko: {
    // 한국어 번역 추가 시
  }
})
```

## 참고 자료

- [Keycloakify 공식 문서](https://docs.keycloakify.dev/)
- [Keycloakify GitHub](https://github.com/keycloakify/keycloakify)
- [Keycloak 테마 가이드](https://www.keycloak.org/docs/latest/server_development/#_themes)
