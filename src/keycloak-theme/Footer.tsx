import styled from '@emotion/styled';

import { ReactComponent as LangIcon } from './login/pages/icons/language_FILL0.svg';

const Footer = () => {
  return (
    <Wrapper>
      <Section>
        <img src="images/slogan.png" alt="slogan" />
      </Section>
    </Wrapper>
  );
};

const Wrapper = styled('footer')`
  margin-bottom: 50px;
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

  & img {
    width: 420px;
    height: 40px;
  }
  padding: 0 100px;
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
