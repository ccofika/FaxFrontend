import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';

export default function FAQs() {
    const faqData = [
        {
            id: "item-1",
            question: "Da li je FAXit besplatan za studente?",
            answer: "FAXit nudi besplatnu verziju sa osnovnim funkcijama. Premium verzija sa naprednim mogućnostima je dostupna po studentskim cenama, sa posebnim popustima za studente iz Srbije."
        },
        {
            id: "item-2", 
            question: "Koje fakultete FAXit podržava?",
            answer: "FAXit trenutno podržava više od 50 fakulteta u Srbiji, uključujući sve glavne univerzitete u Beogradu, Novom Sadu, Nišu i Kragujevcu. Kontinuirano dodajemo nove fakultete i smerove."
        },
        {
            id: "item-3",
            question: "Kako FAXit štiti privatnost mojih podataka?", 
            answer: "Vaša privatnost nam je izuzetno važna. Svi podaci su šifrovani i čuvaju se u skladu sa GDPR propisima. Ne delimo vaše lične informacije sa trećim stranama bez vaše eksplicitne dozvole."
        },
        {
            id: "item-4",
            question: "Mogu li da koristim FAXit offline?",
            answer: "Trenutno FAXit zahteva internet konekciju za potpunu funkcionalnost. Međutim, radimo na offline mogućnostima koje će biti dostupne uskoro, omogućavajući vam da učite i kada nemate pristup internetu."
        },
        {
            id: "item-5", 
            question: "Kako mogu da dobijem podršku ako imam problema?",
            answer: "Naš support tim je dostupan 24/7 preko live chat-a, emaila ili telefona. Takođe imamo opsežnu bazu znanja i video tutorijale koji pokrivaju sve aspekte korišćenja FAXit-a."
        }
    ];

    return (
        <div className="w-full space-y-4">
            <Accordion type="single" collapsible className="w-full space-y-4">
                {faqData.map((faq) => (
                    <AccordionItem 
                        key={faq.id} 
                        value={faq.id}
                        className="border border-zinc-800/50 bg-zinc-900/50 rounded-xl px-6 backdrop-blur-sm hover:bg-zinc-800/30 transition-all duration-300"
                    >
                        <AccordionTrigger className="text-white font-semibold text-left hover:text-zinc-200 py-6">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-zinc-300 pb-6 leading-relaxed">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}