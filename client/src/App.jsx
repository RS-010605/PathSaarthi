import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Header, Footer } from './components'
import Home from './pages/Home'
import Careers from './pages/Careers'
import CareerDetail from './pages/CareerDetail'
import Compare from './pages/Compare'
import Contribute from './pages/Contribute'
import Admin from './pages/Admin'
import AdminLogin, { AdminGate } from './pages/AdminLogin'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

const words = {
  en: {
    explore: 'Explore careers', compare: 'Compare careers', contribute: 'Contribute', about: 'About', contact: 'Contact', admin: 'Admin sign in',
    tagline: 'Helping students turn career questions into clear, practical next steps.', trending: 'Trending', pathway: 'Explore pathway',
    heroBadge: 'Career clarity for every student', heroTitle1: 'Your future.', heroTitle2: 'Your pathway.', heroTitle3: 'Your next step.',
    heroDescription: 'Discover careers, understand the education route, and turn big ambitions into practical next steps — in a language you understand.',
    searchPlaceholder: 'Search software developer, nurse, designer...', findPath: 'Find my path', structured: 'Structured career pathways', roadmaps: 'Step-by-step roadmaps', resources: 'Learning resources',
    preview: 'Your pathway preview', curious: 'From curious to career-ready', discover: 'Discover your direction', discoverSub: 'Explore interests and career options', understand: 'Understand the route', understandSub: 'Qualifications, skills and milestones', learn: 'Learn by doing', learnSub: 'Projects and curated learning resources', nextStep: 'Take your next step', nextStepSub: 'Track progress and keep moving',
    smallSteps: 'Small steps. Clear direction.', journey: 'Built for the journey ahead.', possibilities: 'Explore what is possible', fitCareer: 'Find a career that fits your future', fitDescription: 'Start with a field you are curious about. Explore the learning route and skills required for each career.', viewAll: 'View all careers', popular: 'Popular pathways', trendingCareers: 'Trending careers to explore', trendingDescription: 'A starting shortlist selected for this demo. Explore the route before choosing your next step.', exploreAll: 'Explore all', howWorks: 'How it works', clearerRoute: 'A clearer route from question to action', plan: 'Plan', contributeTitle: 'Contribute', exploreTitle: 'Explore',
    exploreDesc: 'Search a broad set of careers and understand what the work involves.', planDesc: 'See qualifications, skills, alternative routes, and ordered milestones.', contributeDesc: 'Suggest improvements so career guidance can keep evolving.', nextStarts: 'Your next step starts here', decision: 'A career decision should come with a clear path.', decisionDesc: 'Explore the options, compare the routes, and make your next move with more confidence.', contributeIdea: 'Contribute an idea', footerDisclaimer: 'Sample guidance requires official verification.',
    saveData: 'Export saved data (JSON)', importData: 'Import saved data (JSON)', importSuccess: 'Data imported successfully. Refreshing dashboard…', importError: 'Could not import this file. Please select a valid PathSaarthi JSON backup.',
    mobileLanguage: 'Language'
  },
  hi: {
    explore: 'करियर खोजें', compare: 'करियर की तुलना', contribute: 'योगदान दें', about: 'हमारे बारे में', contact: 'संपर्क', admin: 'एडमिन लॉगिन',
    tagline: 'छात्रों को करियर के सवालों से स्पष्ट और व्यावहारिक अगले कदमों तक पहुँचाना।', trending: 'लोकप्रिय', pathway: 'करियर मार्ग देखें',
    heroBadge: 'हर छात्र के लिए करियर मार्गदर्शन', heroTitle1: 'आपका भविष्य।', heroTitle2: 'आपका मार्ग।', heroTitle3: 'आपका अगला कदम।',
    heroDescription: 'करियर विकल्प खोजें, शिक्षा का रास्ता समझें और बड़े लक्ष्यों को व्यावहारिक कदमों में बदलें — अपनी भाषा में।',
    searchPlaceholder: 'सॉफ्टवेयर डेवलपर, नर्स, डिजाइनर खोजें...', findPath: 'मेरा मार्ग खोजें', structured: 'व्यवस्थित करियर मार्ग', roadmaps: 'चरण-दर-चरण रोडमैप', resources: 'सीखने के संसाधन',
    preview: 'आपके मार्ग की झलक', curious: 'जिज्ञासा से करियर-तैयारी तक', discover: 'अपनी दिशा खोजें', discoverSub: 'रुचियों और करियर विकल्पों को देखें', understand: 'मार्ग समझें', understandSub: 'योग्यता, कौशल और पड़ाव', learn: 'करके सीखें', learnSub: 'प्रोजेक्ट और चुने हुए सीखने के संसाधन', nextStep: 'अगला कदम उठाएँ', nextStepSub: 'प्रगति पर नज़र रखें और आगे बढ़ें',
    smallSteps: 'छोटे कदम। स्पष्ट दिशा।', journey: 'आपके आगे के सफर के लिए।', possibilities: 'संभावनाएँ खोजें', fitCareer: 'अपने भविष्य के अनुकूल करियर खोजें', fitDescription: 'अपनी रुचि के क्षेत्र से शुरुआत करें और हर करियर के लिए सीखने का मार्ग व आवश्यक कौशल देखें।', viewAll: 'सभी करियर देखें', popular: 'लोकप्रिय मार्ग', trendingCareers: 'देखने योग्य लोकप्रिय करियर', trendingDescription: 'इस डेमो के लिए चुने गए शुरुआती विकल्प। अगला कदम चुनने से पहले मार्ग देखें।', exploreAll: 'सभी देखें', howWorks: 'यह कैसे काम करता है', clearerRoute: 'सवाल से कार्रवाई तक स्पष्ट मार्ग', plan: 'योजना बनाएँ', contributeTitle: 'योगदान दें', exploreTitle: 'खोजें',
    exploreDesc: 'कई करियर खोजें और समझें कि काम में क्या करना होता है।', planDesc: 'योग्यता, कौशल, वैकल्पिक रास्ते और क्रमबद्ध पड़ाव देखें।', contributeDesc: 'करियर मार्गदर्शन बेहतर बनाने के लिए सुझाव दें।', nextStarts: 'आपका अगला कदम यहाँ से शुरू होता है', decision: 'करियर का फैसला स्पष्ट मार्ग के साथ होना चाहिए।', decisionDesc: 'विकल्प खोजें, मार्गों की तुलना करें और अधिक भरोसे के साथ अगला कदम उठाएँ।', contributeIdea: 'सुझाव दें', footerDisclaimer: 'नमूना जानकारी को आधिकारिक स्रोतों से सत्यापित करें।',
    saveData: 'सेव डेटा एक्सपोर्ट करें (JSON)', importData: 'सेव डेटा इम्पोर्ट करें (JSON)', importSuccess: 'डेटा इम्पोर्ट हो गया। डैशबोर्ड रीफ़्रेश हो रहा है…', importError: 'फ़ाइल इम्पोर्ट नहीं हो सकी। सही PathSaarthi JSON बैकअप चुनें.', mobileLanguage: 'भाषा'
  },
  gu: {
    explore: 'કારકિર્દી શોધો', compare: 'કારકિર્દીની તુલના', contribute: 'યોગદાન આપો', about: 'અમારા વિશે', contact: 'સંપર્ક', admin: 'એડમિન લૉગિન',
    tagline: 'વિદ્યાર્થીઓને કારકિર્દીના પ્રશ્નોથી સ્પષ્ટ અને વ્યવહારુ આગળના પગલાં સુધી પહોંચાડીએ.', trending: 'ટ્રેન્ડિંગ', pathway: 'કારકિર્દીનો માર્ગ જુઓ',
    heroBadge: 'દરેક વિદ્યાર્થી માટે કારકિર્દી માર્ગદર્શન', heroTitle1: 'તમારું ભવિષ્ય.', heroTitle2: 'તમારો માર્ગ.', heroTitle3: 'તમારું આગળનું પગલું.',
    heroDescription: 'કારકિર્દી શોધો, શિક્ષણનો માર્ગ સમજો અને મોટા લક્ષ્યોને વ્યવહારુ પગલાંમાં ફેરવો — તમારી સમજની ભાષામાં.',
    searchPlaceholder: 'સોફ્ટવેર ડેવલપર, નર્સ, ડિઝાઇનર શોધો...', findPath: 'મારો માર્ગ શોધો', structured: 'વ્યવસ્થિત કારકિર્દી માર્ગ', roadmaps: 'પગલું-દર-પગલું રોડમેપ', resources: 'શીખવાના સંસાધનો',
    preview: 'તમારા માર્ગની ઝલક', curious: 'જિજ્ઞાસાથી કારકિર્દી માટે તૈયાર થવા સુધી', discover: 'તમારી દિશા શોધો', discoverSub: 'રુચિઓ અને કારકિર્દીના વિકલ્પો જુઓ', understand: 'માર્ગ સમજો', understandSub: 'લાયકાત, કુશળતા અને પડાવ', learn: 'કરીને શીખો', learnSub: 'પ્રોજેક્ટ અને પસંદ કરેલા શીખવાના સંસાધનો', nextStep: 'આગળનું પગલું લો', nextStepSub: 'પ્રગતિ જુઓ અને આગળ વધતા રહો',
    smallSteps: 'નાનાં પગલાં. સ્પષ્ટ દિશા.', journey: 'તમારી આગળની સફર માટે.', possibilities: 'શક્યતાઓ શોધો', fitCareer: 'તમારા ભવિષ્યને અનુકૂળ કારકિર્દી શોધો', fitDescription: 'તમારી રુચિના ક્ષેત્રથી શરૂઆત કરો. દરેક કારકિર્દી માટે શીખવાનો માર્ગ અને જરૂરી કુશળતા જુઓ.', viewAll: 'બધી કારકિર્દી જુઓ', popular: 'લોકપ્રિય માર્ગો', trendingCareers: 'જોવા જેવી લોકપ્રિય કારકિર્દી', trendingDescription: 'આ ડેમો માટે પસંદ કરેલા શરૂઆતના વિકલ્પો. આગળનું પગલું પસંદ કરતાં પહેલાં માર્ગ જુઓ.', exploreAll: 'બધું જુઓ', howWorks: 'આ કેવી રીતે કાર્ય કરે છે', clearerRoute: 'પ્રશ્નથી કાર્ય સુધીનો સ્પષ્ટ માર્ગ', plan: 'યોજના બનાવો', contributeTitle: 'યોગદાન આપો', exploreTitle: 'શોધો',
    exploreDesc: 'વિવિધ કારકિર્દી શોધો અને કામમાં શું કરવાનું હોય છે તે સમજો.', planDesc: 'લાયકાત, કુશળતા, વૈકલ્પિક માર્ગો અને ક્રમબદ્ધ પડાવ જુઓ.', contributeDesc: 'કારકિર્દી માર્ગદર્શન સુધારવા સૂચનો આપો.', nextStarts: 'તમારું આગળનું પગલું અહીંથી શરૂ થાય છે', decision: 'કારકિર્દીનો નિર્ણય સ્પષ્ટ માર્ગ સાથે હોવો જોઈએ.', decisionDesc: 'વિકલ્પો શોધો, માર્ગોની તુલના કરો અને વધુ આત્મવિશ્વાસથી આગળ વધો.', contributeIdea: 'સૂચન આપો', footerDisclaimer: 'નમૂનાની માહિતી સત્તાવાર સ્ત્રોતોથી ચકાસવી જરૂરી છે.',
    saveData: 'સેવ કરેલો ડેટા એક્સપોર્ટ કરો (JSON)', importData: 'સેવ કરેલો ડેટા ઇમ્પોર્ટ કરો (JSON)', importSuccess: 'ડેટા ઇમ્પોર્ટ થયો. ડેશબોર્ડ ફરી ખૂલી રહ્યો છે…', importError: 'આ ફાઇલ ઇમ્પોર્ટ થઈ શકી નથી. યોગ્ય PathSaarthi JSON બેકઅપ પસંદ કરો.', mobileLanguage: 'ભાષા'
  }
}
export const LanguageContext = React.createContext({ language: 'en', t: k => k })
export default function App() {
  const [language, setLanguage] = React.useState(localStorage.getItem('pathsaarthi.language') || 'en')
  React.useEffect(() => { localStorage.setItem('pathsaarthi.language', language) }, [language])
  const t = key => words[language]?.[key] || words.en[key] || key
  const location = useLocation()
  React.useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [location.pathname])
  return <LanguageContext.Provider value={{ language, t }}>
    <div className="min-h-screen"><Header language={language} setLanguage={setLanguage} /><Routes>
      <Route path="/" element={<Home />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/careers/:id" element={<CareerDetail />} />
      <Route path="/compare" element={<Compare />} />
      <Route path="/contribute" element={<Contribute />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminGate><Admin /></AdminGate>} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Routes><Footer /></div>
  </LanguageContext.Provider>
}
