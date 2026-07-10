import { Fragment, useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon, PaperAirplaneIcon, ChevronDownIcon } from "@heroicons/react/outline";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const MAX_PROPERTIES = 4;
const DEFAULT_QUESTION_SINGLE = "Tell me about this property.";
const DEFAULT_QUESTION_MULTI = "Give me an overall comparison of these properties.";

/**
 * Normalizes a user-typed property code so they don't have to match the
 * exact stored format:
 *  - "sp 1024"  -> "SP-1024"
 *  - "SP1024"   -> "SP-1024"
 *  - "1024"     -> "SP-1024"   (bare number, assumes SP- prefix)
 *  - "sp-1024"  -> "SP-1024"
 */
const normalizePropertyCode = (raw) => {
  const cleaned = raw.replace(/\s+/g, "").toUpperCase();
  if (/^\d+$/.test(cleaned)) return `SP-${cleaned}`;
  const noDash = cleaned.replace(/^SP-?/, "");
  if (/^\d+$/.test(noDash)) return `SP-${noDash}`;
  return cleaned;
};

// Since /compare-ai currently only returns { summary }, this builds a
// lightweight, generic "thinking" blurb client-side so the toggle has
// something meaningful to show. Swap this out once the backend returns
// real reasoning under a `thinking` key.
const buildThinkingSummary = (properties, askedQuestion) => {
  const codes = properties.map((p) => p.property_code).join(", ");
  const subject = properties.length === 1
    ? `Reviewing ${codes} across location, price per sqft, size, and amenities`
    : `Comparing ${properties.length} properties (${codes}) across location, price per sqft, size, and amenities`;
  return `${subject} to answer: "${askedQuestion}"`;
};

// Reveals `text` progressively, like the model is typing it live.
// Runs once per unique `text` value passed in.
const useTypewriter = (text, onComplete, speed = 14) => {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!text) {
      setDisplayed("");
      return;
    }
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i += 2; // reveal a couple chars per tick, feels closer to real token speed
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(id);
  }, [text]);
  return displayed;
};

// Three bouncing dots — used while waiting on a response.
const ThinkingDots = () => (
  <div className="flex items-center gap-1 py-1">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="h-1.5 w-1.5 rounded-full bg-[#0F172A]/40 animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </div>
);

// Collapsible "thinking" toggle shown above the answer bubble.
// Renders nothing if the turn has no thinking content.
const ThinkingToggle = ({ thinking, isOpen, onToggle }) => {
  if (!thinking) return null;
  return (
    <div className="mr-auto max-w-[92%] mb-1">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1 text-[11px] text-[#0F172A]/45 hover:text-[#0F172A]/70 transition-colors"
      >
        <ChevronDownIcon className={`h-3 w-3 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`} />
        {isOpen ? "Hide thinking" : "Show thinking"}
      </button>
      {isOpen && (
        <div className="mt-1 border-l-2 border-[#0F172A]/15 pl-2 text-[11px] text-[#0F172A]/50 italic whitespace-pre-line">
          {thinking}
        </div>
      )}
    </div>
  );
};

const ChatTurn = ({ turn, shouldAnimate, onAnimationComplete, isThinkingOpen, onToggleThinking }) => {
  const typed = useTypewriter(shouldAnimate ? turn.answer : "", onAnimationComplete);
  const shown = shouldAnimate ? typed : turn.answer;
  return (
    <div className="mb-3">
      {turn.question && (
        <div className="ml-auto mb-1.5 max-w-[85%] bg-[#0F172A] text-white text-[13px] px-3 py-1.5 w-fit">
          {turn.question}
        </div>
      )}
      <ThinkingToggle thinking={turn.thinking} isOpen={isThinkingOpen} onToggle={onToggleThinking} />
      <div className="mr-auto max-w-[92%] bg-[#F5F6F8] border-l-2 border-[#E02424] text-[#0F172A] text-[13px] leading-relaxed px-3 py-2 whitespace-pre-line">
        {shown}
        {shouldAnimate && shown.length < turn.answer.length && (
          <span className="inline-block w-1 h-3.5 bg-[#0F172A]/50 ml-0.5 align-middle animate-pulse" />
        )}
      </div>
    </div>
  );
};

const AskAiModal = ({ open, setOpen, currentProperty }) => {
  const [properties, setProperties] = useState([]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]); // [{ id, question, answer, thinking }]
  const [aiLoading, setAiLoading] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState("");
  const [openThinkingIds, setOpenThinkingIds] = useState(() => new Set());
  const [animatedIds, setAnimatedIds] = useState(() => new Set());
  const inputRef = useRef(null);
  const chatEndRef = useRef(null);

  // Only re-seed the panel (fresh property list + cleared chat) when the
  // underlying property actually changes — e.g. the user navigates to a
  // different listing's page. Opening/closing the panel on the SAME
  // property page must not wipe the conversation.
  const seededIdRef = useRef(null);
  useEffect(() => {
    if (currentProperty?.id && seededIdRef.current !== currentProperty.id) {
      setProperties([currentProperty]);
      setCode("");
      setChat([]);
      setQuestion("");
      setOpenThinkingIds(new Set());
      setAnimatedIds(new Set());
      seededIdRef.current = currentProperty.id;
    }
  }, [currentProperty]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, aiLoading]);

  const toggleThinking = (id) => {
    setOpenThinkingIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const markAnimated = (id) => {
    setAnimatedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const askAi = async () => {
    if (properties.length < 1) {
      toast.error("Add a property to ask about it.");
      return;
    }
    const defaultQuestion = properties.length === 1 ? DEFAULT_QUESTION_SINGLE : DEFAULT_QUESTION_MULTI;
    const askedQuestion = question.trim() || defaultQuestion;
    setPendingQuestion(askedQuestion); // holds the real question for the loading bubble
    setQuestion("");
    setAiLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_LINK}/ask-ai`, {
        property_codes: properties.map((p) => p.property_code),
        question: askedQuestion,
      });
      setChat((prev) => [
        ...prev,
        {
          id: Date.now(),
          question: askedQuestion,
          answer: res.data?.summary || "",
          // Backend currently only returns { summary }. Fall back to a
          // generated blurb so the toggle has something to show; swap
          // in res.data?.thinking directly once the backend supports it.
          thinking: res.data?.thinking || buildThinkingSummary(properties, askedQuestion),
        },
      ]);
    } catch (err) {
      toast.error("Couldn't get an AI comparison right now. Try again shortly.");
    }
    setAiLoading(false);
  };

  const addByCode = async () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    if (properties.length >= MAX_PROPERTIES) {
      toast.error(`You can compare up to ${MAX_PROPERTIES} properties at a time.`);
      return;
    }
    const normalized = normalizePropertyCode(trimmed);
    if (properties.some((p) => p.property_code === normalized)) {
      toast.error("That property is already in the comparison.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_LINK}/property-by-code/${normalized}`);
      if (res.data?.status === 200) {
        setProperties((prev) => [...prev, res.data.data]);
        setCode("");
        inputRef.current?.focus();
      } else {
        toast.error(`No property found with code "${normalized}".`);
      }
    } catch (err) {
      toast.error(`No property found with code "${normalized}".`);
    }
    setLoading(false);
  };

  const removeProperty = (id) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-[99999]" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-[#0F172A]/25" />
        </Transition.Child>

        <div className="fixed inset-y-0 right-0 flex max-w-full">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-out duration-300"
            enterFrom="translate-x-full" enterTo="translate-x-0"
            leave="transform transition ease-in duration-200"
            leaveFrom="translate-x-0" leaveTo="translate-x-full"
          >
            <Dialog.Panel className="w-screen max-w-md h-full bg-white shadow-xl flex flex-col">

              {/* Add by code — optional, only needed if the user wants to bring in more properties */}
              <div className="px-4 pt-4 pb-3 border-b border-[#0F172A]/10 shrink-0">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    className="border border-[#0F172A]/15 w-full px-3 py-2 text-sm outline-none focus:border-[#E02424] transition-colors"
                    placeholder="Add another property (optional), e.g. 1024 or SP-1024"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addByCode()}
                    disabled={properties.length >= MAX_PROPERTIES}
                  />
                  <button
                    onClick={addByCode}
                    disabled={loading || properties.length >= MAX_PROPERTIES}
                    className="bg-[#E02424] text-white px-4 text-sm font-medium whitespace-nowrap disabled:opacity-40 flex items-center gap-2 hover:bg-[#c41f1f] transition-colors shrink-0"
                  >
                    {loading ? <FaSpinner className="animate-spin" /> : "Add"}
                  </button>
                </div>
                <p className="text-[#0F172A]/40 text-[11px] mt-1.5">This property is already added — bring in more only if you want to compare.</p>
              </div>

              {/* Property strip: photo, title, code, location. First item is auto-added from the page you're on. */}
              <div className="flex gap-2 px-4 pt-3 pb-1 overflow-x-auto shrink-0">
                {properties.map((p) => (
                  <div key={p.id} className="relative w-28 shrink-0 border border-[#0F172A]/10">
                    <button
                      onClick={() => removeProperty(p.id)}
                      className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center bg-white/90 text-[#0F172A]/50 hover:text-[#E02424] text-[10px] z-10"
                      aria-label="Remove from comparison"
                    >
                      ✕
                    </button>
                    <img src={p.feature_image} alt={p.name} className="w-full h-16 object-cover" />
                    <div className="p-1.5">
                      <div className="text-[11px] font-semibold text-[#0F172A] leading-tight line-clamp-2">{p.name}</div>
                      <div className="text-[10px] text-[#0F172A]/40 mt-0.5">{p.property_code}</div>
                      <div className="text-[10px] text-[#0F172A]/50 truncate">{p.property_location}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat area */}
              <div className="flex-1 overflow-y-auto px-4 pt-3">
                {chat.length === 0 && !aiLoading && (
                  <p className="text-[#0F172A]/35 text-xs italic pt-2">
                    {properties.length < 2
                      ? 'Ask me anything — "what\'s the resale outlook?", "is this good for a family?", or just say hi. Add another property above if you want a comparison.'
                      : 'Ask me anything about these properties — "which is better for a family?", "which has stronger resale value?"'}
                  </p>
                )}
                {chat.map((turn, i) => (
                  <ChatTurn
                    key={turn.id}
                    turn={turn}
                    shouldAnimate={i === chat.length - 1 && !animatedIds.has(turn.id)}
                    onAnimationComplete={() => markAnimated(turn.id)}
                    isThinkingOpen={openThinkingIds.has(turn.id)}
                    onToggleThinking={() => toggleThinking(turn.id)}
                  />
                ))}
                {aiLoading && (
                  <div className="mb-3">
                    <div className="ml-auto mb-1.5 max-w-[85%] bg-[#0F172A] text-white text-[13px] px-3 py-1.5 w-fit">
                      {pendingQuestion}
                    </div>
                    <div className="mr-auto max-w-[92%] bg-[#F5F6F8] border-l-2 border-[#E02424] px-3 py-2 w-fit flex items-center gap-2">
                      <span className="text-[11px] text-[#0F172A]/40">Thinking</span>
                      <ThinkingDots />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Open question input */}
              <div className="px-4 pt-3 pb-4 border-t border-[#0F172A]/10 shrink-0">
                <div className="flex gap-2 items-end">
                  <textarea
                    rows={1}
                    className="border border-[#0F172A]/15 w-full px-3 py-2 text-sm outline-none focus:border-[#E02424] transition-colors resize-none"
                    placeholder={properties.length < 1 ? "Loading property…" : "Ask anything, or just say hi…"}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        askAi();
                      }
                    }}
                    disabled={aiLoading || properties.length < 1}
                  />
                  <button
                    onClick={askAi}
                    disabled={aiLoading || properties.length < 1}
                    className="bg-[#0F172A] text-white h-[38px] w-[38px] flex items-center justify-center shrink-0 disabled:opacity-40 hover:bg-[#0F172A]/90 transition-colors"
                    aria-label="Ask AI"
                  >
                    <PaperAirplaneIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AskAiModal;