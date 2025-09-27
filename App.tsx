import React, { useState, useCallback, useRef } from 'react';
import { ConsoleLog, DebateTurn, PaperSource, LogStatus } from './types';
import * as geminiService from './services/geminiService';
import { BrainCircuitIcon } from './components/icons/Icons';
import TopicInput from './components/TopicInput';
import DebateView from './components/DebateView';
import ResearchPaperView from './components/ResearchPaperView';
import ConsoleView from './components/ConsoleView';

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [sources, setSources] = useState<PaperSource[]>([]);
  const [debateHistory, setDebateHistory] = useState<DebateTurn[]>([]);
  const [paperHtml, setPaperHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // FIX: Changed initial state from [] to null to match the type definition <string | null>.
  const [error, setError] = useState<string | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);

  const finalSummaryRef = useRef<string>('');
  
  const log = (message: string, status: LogStatus) => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleLogs(prev => {
        // If the new status is WORKING, remove any previous WORKING message
        const filtered = status === LogStatus.WORKING 
            ? prev.filter(p => p.status !== LogStatus.WORKING) 
            : prev;
        return [...filtered, { message, status, timestamp }];
    });
  };

  const handleStartResearch = useCallback(async (researchTopic: string) => {
    if (!researchTopic.trim()) {
      setError("Please enter a research topic.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setTopic(researchTopic);
    
    // Reset state
    setSources([]);
    setDebateHistory([]);
    setPaperHtml('');
    finalSummaryRef.current = '';
    setConsoleLogs([]);

    try {
      log('Research process initiated.', LogStatus.INFO);
      log('Generating diversified research angles...', LogStatus.WORKING);
      const queries = await geminiService.generateSubQueries(researchTopic);
      log(`Generated ${queries.length} unique research angles.`, LogStatus.SUCCESS);

      log('Synthesizing information from web search...', LogStatus.WORKING);
      const { summary: initialSummary, sources: fetchedSources } = await geminiService.getInitialSummary(researchTopic, queries);
      setSources(fetchedSources);
      finalSummaryRef.current = initialSummary;
      log(`Initial data synthesis complete from ${fetchedSources.length} sources.`, LogStatus.SUCCESS);

      log('Starting multi-agent debate for insight generation...', LogStatus.INFO);
      let tempSummary = initialSummary;
      let previousTurns = '';

      for (let i = 0; i < 3; i++) {
        log(`Debate Round ${i + 1}: Critic agent is analyzing...`, LogStatus.WORKING);
        const { critique, refinement } = await geminiService.runDebateRound(tempSummary, previousTurns);
        log(`Debate Round ${i + 1}: Refiner agent is synthesizing new insights...`, LogStatus.WORKING);
        setDebateHistory(prev => [...prev, { agent: 'Critic', text: critique }, { agent: 'Refiner', text: refinement }]);
        tempSummary = refinement;
        finalSummaryRef.current = refinement;
        previousTurns += `Critique: ${critique}\nRefinement: ${refinement}\n\n`;
        log(`Debate Round ${i + 1} complete.`, LogStatus.SUCCESS);
      }
      log('Agentic debate concluded. Final summary refined.', LogStatus.SUCCESS);

      log('Generating final academic paper structure...', LogStatus.WORKING);
      let generatedPaper = await geminiService.generatePaperContent(finalSummaryRef.current, researchTopic, fetchedSources);
      log('Paper content generated.', LogStatus.SUCCESS);
      
      log('Generating conceptual images...', LogStatus.WORKING);
      const imagePrompts = await geminiService.generateImagePrompts(generatedPaper);
      log(`Identified ${imagePrompts.length} opportunities for visual aids.`, LogStatus.INFO);
      
      for(let i=0; i < imagePrompts.length; i++) {
        log(`Generating image ${i+1}/${imagePrompts.length}: "${imagePrompts[i].substring(0, 40)}..."`, LogStatus.WORKING);
        const imageBase64 = await geminiService.generateImage(imagePrompts[i]);
        const imageUrl = `data:image/jpeg;base64,${imageBase64}`;
        const imageHtml = `<img src="${imageUrl}" alt="${imagePrompts[i]}" class="my-6 rounded-lg shadow-lg mx-auto max-w-full h-auto" />`;
        generatedPaper = generatedPaper.replace(`[IMAGE_PLACEHOLDER_${i + 1}]`, imageHtml);
      }
      generatedPaper = generatedPaper.replace(/\[IMAGE_PLACEHOLDER_\d+\]/g, '');
      log('All images generated and embedded.', LogStatus.SUCCESS);

      setPaperHtml(generatedPaper);
      log('Research paper is complete and ready for review.', LogStatus.SUCCESS);

    } catch (e) {
      const err = e as Error;
      console.error(err);
      const errorMessage = err.message || 'An unknown error occurred.';
      setError(errorMessage);
      log(errorMessage, LogStatus.ERROR);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const showMainContent = !isLoading && !paperHtml;

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <BrainCircuitIcon className="h-9 w-9 text-blue-600" />
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
              NexusAI Deep Research
            </h1>
          </div>
          <p className="text-gray-500 max-w-2xl mx-auto">
            From a single topic to a comprehensive, AI-generated research paper with novel insights.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <aside className="lg:col-span-1">
                <ConsoleView logs={consoleLogs} />
            </aside>

            <main className="lg:col-span-2 space-y-8">
              {showMainContent && (
                <>
                  <TopicInput onSubmit={handleStartResearch} isLoading={isLoading} />
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                      <strong className="font-bold">Error: </strong>
                      <span className="block sm:inline">{error}</span>
                    </div>
                  )}
                </>
              )}
              
              {debateHistory.length > 0 && (
                <DebateView turns={debateHistory} />
              )}

              {paperHtml && (
                <ResearchPaperView htmlContent={paperHtml} />
              )}
            </main>
        </div>
      </div>
    </div>
  );
};

export default App;