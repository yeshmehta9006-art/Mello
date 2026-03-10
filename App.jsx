import React, { useState } from 'react';
import { 
  Stethoscope, 
  Upload, 
  ShieldCheck, 
  Zap, 
  Languages, 
  ArrowLeft, 
  CreditCard, 
  FileText, 
  AlertTriangle,
  Download,
  Share2
} from 'lucide-react';
import { marked } from 'marked';


// --- CONFIGURATION ---
// Go to https://aistudio.google.com/ to get your FREE API Key
const GEMINI_API_KEY = "AlzaSyASlvumet-o6KyTlc8L3lbG82YVE0jA8vw"; 


const App = () => {
  const [step, setStep] = useState('home'); // Steps: home, preview, processing, result
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [mimeType, setMimeType] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // 1. Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
        setBase64Image(event.target.result.split(',')[1]);
        setStep('preview');
      };
      reader.readAsDataURL(file);
    } else {
      alert("Kripya report ki saaf photo (JPG/PNG) upload karein.");
    }
  };


  // 2. Mock Payment & Start Analysis
  const handlePaymentAndAnalyze = () => {
    // Real life mein yahan Razorpay ka code aayega
    setLoading(true);
    setStep('processing');
    
    // Simulating a delay for payment feel
    setTimeout(() => {
      callGeminiAI();
    }, 2000);
  };


  // 3. API Call to Gemini
  const callGeminiAI = async () => {
    if (!GEMINI_API_KEY) {
      setError("API Key missing hai! Kripya code mein API Key dalein.");
      setStep('home');
      return;
    }


    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;
    
    const prompt = `
      Tum MelloDr. AI ho. Is medical report image ko read karo aur user ko simple 'Hinglish' mein samjhao.
      Structure:
      - Ek simple summary report kis baare mein hai.
      - Kya cheezein normal hain (Green flags).
      - Kya cheezein abnormal hain ya dhyan dene layak hain (Red flags).
      - Mushkil medical words ka aasaan matlab.
      - Next steps (Doctor consultation ki salah).
      Note: Koi medicine suggest mat karna aur hamesha disclaimer dena.
    `;


    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inlineData: { mimeType: mimeType, data: base64Image } }
            ]
          }]
        })
      });


      const data = await response.json();
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        setAnalysis(data.candidates[0].content.parts[0].text);
        setStep('result');
      } else {
        throw new Error("AI response generate nahi kar paya.");
      }
    } catch (err) {
      setError("AI Analysis mein error aaya. Kripya dobara koshish karein.");
      setStep('home');
    } finally {
      setLoading(false);
    }
  };


  const reset = () => {
    setStep('home');
    setImage(null);
    setAnalysis("");
    setError("");
  };


  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-200">
              <Stethoscope className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-800">Mello<span className="text-sky-500">Dr.</span></span>
          </div>
          <div className="bg-sky-50 text-sky-600 px-4 py-1 rounded-full text-sm font-bold border border-sky-100">
            ₹10 / Analysis
          </div>
        </div>
      </nav>


      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Step: Home */}
        {step === 'home' && (
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
              Medical Report Samjhein <br/> 
              <span className="text-sky-500 underline decoration-sky-200">Aasaan Hinglish Mein.</span>
            </h1>
            <p className="text-slate-500 text-lg mb-10 max-w-xl mx-auto">
              MelloDr. AI complex medical terms ko simple bhasha mein translate karta hai, taaki aap sahi decision le sakein.
            </p>


            <div className="max-w-md mx-auto bg-white p-4 rounded-[2.5rem] shadow-2xl shadow-sky-100 border border-slate-100">
              <label className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 flex flex-col items-center justify-center cursor-pointer hover:border-sky-500 hover:bg-sky-50 transition-all duration-300">
                <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mb-4">
                  <Upload className="text-sky-500" size={30} />
                </div>
                <span className="text-lg font-bold text-slate-700">Report Upload Karein</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>


            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 opacity-70">
              <div className="flex flex-col items-center"><ShieldCheck className="text-green-500 mb-2" size={30} /> <span className="font-bold">Safe & Private</span></div>
              <div className="flex flex-col items-center"><Zap className="text-yellow-500 mb-2" size={30} /> <span className="font-bold">Instant Results</span></div>
              <div className="flex flex-col items-center"><Languages className="text-blue-500 mb-2" size={30} /> <span className="font-bold">Hinglish Support</span></div>
            </div>
          </div>
        )}


        {/* Step: Preview */}
        {step === 'preview' && (
          <div className="max-w-md mx-auto">
            <button onClick={reset} className="flex items-center text-slate-500 mb-6 font-medium hover:text-sky-500">
              <ArrowLeft size={20} className="mr-2" /> Upload Screen
            </button>
            <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-6">
              <img src={image} className="w-full h-64 object-contain rounded-xl bg-slate-50 mb-6 border border-slate-100" />
              <div className="flex items-center justify-between mb-8 px-2">
                <div><h3 className="font-bold text-lg">Total Payable</h3><p className="text-xs text-slate-400">AI Processing Fee</p></div>
                <div className="text-2xl font-black text-sky-600">₹10</div>
              </div>
              <button 
                onClick={handlePaymentAndAnalyze}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-slate-800 transition transform active:scale-95"
              >
                <CreditCard /> Pay ₹10 & Samjhao
              </button>
            </div>
          </div>
        )}


        {/* Step: Processing */}
        {step === 'processing' && (
          <div className="py-20 flex flex-col items-center text-center animate-pulse">
            <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mb-6">
              <FileText className="text-sky-500 animate-bounce" size={36} />
            </div>
            <h2 className="text-2xl font-bold mb-2">MelloDr. Reading...</h2>
            <p className="text-slate-500">Kripya wait karein, AI report scan kar raha hai.</p>
          </div>
        )}


        {/* Step: Result */}
        {step === 'result' && (
          <div className="max-w-3xl mx-auto">
            <button onClick={reset} className="mb-6 text-slate-500 hover:text-sky-500 flex items-center font-medium">
              <ArrowLeft size={18} className="mr-2" /> One More Report
            </button>
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
              <div className="bg-sky-500 p-8 text-white">
                <h2 className="text-2xl font-black">Analysis Results</h2>
                <p className="opacity-80 text-sm">Automated Insight by MelloDr. AI</p>
              </div>
              <div className="p-8 md:p-10 prose prose-slate max-w-none">
                <div dangerouslySetInnerHTML={{ __html: marked.parse(analysis) }} />
                
                <div className="mt-10 bg-amber-50 border border-amber-100 rounded-2xl p-6 flex gap-4">
                  <AlertTriangle className="text-amber-600 shrink-0" size={24} />
                  <p className="text-amber-800 text-xs leading-relaxed">
                    <strong>Disclaimer:</strong> Yeh AI report sirf jaankari ke liye hai. Ise doctor ki salah na maanein. Koi bhi dawa lene se pehle doctor se zaroor milein.
                  </p>
                </div>
              </div>
              <div className="bg-slate-50 p-6 flex flex-col sm:flex-row gap-4 border-t border-slate-100">
                <button onClick={() => window.print()} className="flex-1 bg-white border border-slate-200 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100"><Download size={20} /> Save PDF</button>
                <button className="flex-1 bg-sky-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sky-700"><Share2 size={20} /> Share</button>
              </div>
            </div>
          </div>
        )}
      </main>


      {/* Footer */}
      <footer className="py-10 border-t border-slate-200 text-center text-slate-400 text-xs mt-auto">
        <p>© 2026 MelloDr. AI | Designed for India</p>
        <p className="mt-2 font-bold uppercase tracking-widest text-[10px]">Privacy & Trust Guaranteed</p>
      </footer>


      {error && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-2 z-[100]">
          <AlertTriangle size={20} /> {error}
        </div>
      )}
    </div>
  );
};


export default App;