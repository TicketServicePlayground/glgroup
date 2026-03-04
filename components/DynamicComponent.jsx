// Lazy-loaded component registry.
// Components are resolved at render time (not import time) to avoid
// circular dependency issues: DynamicComponent ↔ Grid/Section/TwoBlock/etc.
let _components = null;

function getComponents() {
  if (_components) return _components;
  _components = {
    page: require("@/components/Page").default,
    hero: require("@/components/Hero/Hero").default,
    sliderMain: require("@/components/Slider/Slider").default,
    twoBlock: require("@/components/TwoBlock/TwoBlock").default,
    title: require("@/components/UI/title").default,
    imageBlock: require("@/components/UI/image").default,
    textBlock: require("@/components/UI/text").default,
    buttonBlock: require("@/components/UI/button").default,
    grid: require("@/components/Grid/Grid").default,
    gridItem: require("@/components/Grid/GridItem").default,
    sectionNumber: require("@/components/SectionNumber/SectionNumber").default,
    blockWithArrow: require("@/components/BlockWithArrow/BlockWithArrow").default,
    ourPartners: require("@/components/OurPartners/OurPartners").default,
    ourRecomendations: require("@/components/OurRecomendations/OurRecomendations").default,
    contactForm: require("@/components/ContactForm/ContactForm").default,
    ourCases: require("@/components/OurCases/OurCases").default,
    section: require("@/components/Section/Section").default,
    twoGrids: require("@/components/TwoGrids/twoGrids").default,
    steps: require("@/components/Steps/Steps").default,
    contactMap: require("@/components/ContactMap/ContactMap").default,
    gridWithImage: require("@/components/GridWithImage/GridWithImage").default,
    gridImg: require("@/components/GridWithImage/GridImg").default,
    contact: require("@/components/Contact/Contact").default,
    fromContact: require("@/components/FormContact/FormContact").default,
    HeroAboutUs: require("@/components/HeroAboutUs/HeroAboutUs").default,
    ourAdvantages: require("@/components/OurAdvantages/OurAdvantages").default,
    history: require("@/components/History/History").default,
    staticHeroForConverter: require("@/components/staticHeroForConverter/staticHeroForConverter").default,
    Converter: require("@/components/Converter/Converter").default,
    ServicesList: require("@/components/ServicesList/ServicesList").default,
    singleBankInfo: require("@/components/singleBankInfo/singleBankInfo").default,
    BankExchangeList: require("@/components/BankExchangeList/BankExchangeList").default,
    InfoByCurrency: require("@/components/InfoByCurrency/InfoByCurrency").default,
    buttonCTA: require("@/components/ButtonCTA/ButtonCTA").default,
    accordion: require("@/components/Accordion/Accordion").default,
  };
  return _components;
}

export default function DynamicComponent({ blok }) {
  if (!blok?.component) return null;
  const components = getComponents();
  const Component = components[blok.component];
  if (!Component) {
    console.warn(`Unknown component: "${blok.component}"`);
    return null;
  }
  return <Component blok={blok} />;
}
