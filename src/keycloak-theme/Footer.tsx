import styled from '@emotion/styled';

import { ReactComponent as LangIcon } from './login/pages/icons/language_FILL0.svg';

const Footer = () => {
  return (
    <Wrapper>
      <Section>
      <span>AstraGo 2.0</span>
        <span>도움말 ｜개인정보처리방침 ｜이용약관</span>
        <span>
          (주)씨이랩｜대표이사 : 이우영 ｜사업자등록번호 : 119-86-31534
        </span>
        {/* <span>서울시 강남구 언주로 617, 3,4층 (우)06107</span> */}
      </Section>
      {/* <Section>
        <RightLayout>
          <div>
            <span>Connect with any device.</span>
            <span>Copyright © Xiilab. All Rights Reserved.</span>
          </div>
          <LocaleSelectBox>
            <LangIcon />
            <span>KOR</span>
          </LocaleSelectBox>
        </RightLayout>
      </Section> */}
    </Wrapper>
  );
};

const Wrapper = styled('footer')`
  margin-bottom: 26px;
  box-sizing: border-box;
`;

const Section = styled('section')`
  span {
    display: block;
    text-align: center;
  }
  font-size: 11px;
  color: #90919e;
  font-weight: 300;
  line-height: 22px;
  letter-spacing: -2%;
  max-height: 80px;
`;

// const RightLayout = styled('div')`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 38px;
// `;

// const LocaleSelectBox = styled('button')`
//   border: 1px solid #b7b7b7;
//   width: 86px;
//   height: 34px;
//   border-radius: 100px;
//   background: transparent;
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   justify-content: center;
//   gap: 8px;
//   span {
//     font-size: 12px;
//     color: #b7b7b7;
//   }
// `;
export default Footer;
