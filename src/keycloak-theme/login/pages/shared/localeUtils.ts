/**
 * 언어 정보 추출 함수
 * 우선순위: URL 쿼리 파라미터 > 세션 스토리지 > Accept-Language 헤더 > 기본값
 */
export const getLocale = (): string => {
  // 1. URL 쿼리 파라미터 kc_locale에서 우선 추출
  const urlParams = new URL(window.location.href).searchParams;
  const urlLocale = urlParams.get('kc_locale');
  if (urlLocale) {
    return urlLocale;
  }

  // 2. 세션 스토리지에서 추출
  const sessionLocale = sessionStorage.getItem('kc_locale');
  if (sessionLocale) {
    return sessionLocale;
  }

  // 3. Accept-Language 헤더에서 추출 (브라우저 언어 설정)
  if (navigator.languages && navigator.languages.length > 0) {
    const browserLang = navigator.languages[0].split('-')[0]; // 'ko-KR' -> 'ko'
    if (browserLang === 'ko' || browserLang === 'en') {
      return browserLang === 'ko' ? 'ko' : 'en';
    }
  }

  // 4. 기본값: "ko"
  return 'ko';
};

