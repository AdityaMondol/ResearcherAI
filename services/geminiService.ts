import { GoogleGenAI, Type } from "@google/genai";
import { PaperSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateSubQueries = async (topic: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a world-class research strategist. For the topic "${topic}", generate 7 diverse and insightful sub-search queries designed to uncover unique, uncommon, and foundational information from the web. Your queries must cover multiple angles: historical context, contrarian viewpoints, technological underpinnings, societal/ethical implications, future projections, and key academic debates.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            queries: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    const result = JSON.parse(response.text);
    return result.queries || [];
  } catch (error) {
    console.error("Error generating sub-queries:", error);
    throw new Error("Failed to generate research queries.");
  }
};

export const getInitialSummary = async (topic: string, queries: string[]): Promise<{ summary: string, sources: PaperSource[] }> => {
  const fullPrompt = `Using comprehensive web search, synthesize a detailed, multi-faceted summary for the topic "${topic}", guided by these key research angles: ${queries.join(', ')}. For every key insight or data point, cite the source URL. Structure the output as well-organized markdown. Prioritize novel findings and the synthesis of information from disparate sources into a cohesive narrative.`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const summary = response.text;
    const rawSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const sources = rawSources
      .map(chunk => chunk.web)
      .filter((web): web is { uri: string; title: string } => !!web && !!web.uri && !!web.title);
      
    const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());

    return { summary, sources: uniqueSources };
  } catch (error) {
    console.error("Error getting initial summary:", error);
    throw new Error("Failed to synthesize initial data.");
  }
};

export const runDebateRound = async (summary: string, previousTurns: string): Promise<{ critique: string; refinement: string }> => {
  try {
    // Critic Agent
    const criticResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a ruthless, world-class academic peer reviewer. Your purpose is to find weaknesses. Analyze this research summary for gaps, logical fallacies, unsubstantiated claims, weak arguments, and unexplored avenues. Provide specific, sharp, constructive criticism. Propose specific counter-arguments and alternative hypotheses that must be addressed. Do not be easily satisfied.
      ${previousTurns ? `Previous debate turns for context:\n${previousTurns}` : ''}
      Research Summary:
      ---
      ${summary}
      ---`,
    });
    const critique = criticResponse.text;

    // Refiner Agent
    const refinerResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a pioneering researcher and innovator whose goal is to create world-changing knowledge. Your task is to transcend the original summary by addressing the following critique. Synthesize the critique with the existing data to forge *new, original insights and hypotheses*. Propose a novel framework or perspective that was not present in the source material. Your output should be a significantly more profound and robust version of the research.
      Original Summary:
      ---
      ${summary}
      ---
      Critique to address:
      ---
      ${critique}
      ---`,
    });
    const refinement = refinerResponse.text;

    return { critique, refinement };
  } catch (error) {
    console.error("Error in debate round:", error);
    throw new Error("An error occurred during the agentic debate.");
  }
};

export const generatePaperContent = async (finalSummary: string, topic: string, sources: PaperSource[]): Promise<string> => {
    const sourceList = sources.map(s => `<li><a href="${s.uri}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${s.title || s.uri}</a></li>`).join('');

    const prompt = `You are an expert academic writer and web developer tasked with creating a production-ready research paper. Transform the following refined research notes into a complete, professional-grade paper in rich HTML format.
    Topic: "${topic}"
    The paper must have a formal, objective, and analytical tone and include:
    1.  A compelling and descriptive Title (<h1>).
    2.  A concise Abstract (<section> with <h2>Abstract</h2>) summarizing the key findings and novel contributions.
    3.  An engaging Introduction (<section> with <h2>Introduction</h2>) that sets the stage and states the paper's thesis.
    4.  At least three well-titled body sections (<section> with <h2>...</h2> for each), presenting the core arguments, analysis, and evidence.
    5.  A forward-looking Conclusion (<section> with <h2>Conclusion</h2>) that discusses the implications of the findings and suggests future research directions.
    6.  A comprehensive References section containing the provided sources.
    
    Use semantic HTML tags (<h2>, <h3>, <p>, <ul>, <li>, <blockquote>, <strong>, <em>).
    Do NOT use Tailwind CSS classes in the response. The entire response should be a single HTML string, starting with the <h1> title.
    Strategically insert three image placeholders in the format [IMAGE_PLACEHOLDER_1], [IMAGE_PLACEHOLDER_2], and [IMAGE_PLACEHOLDER_3] in locations where a visual would be most impactful to illustrate a complex concept or finding.
    
    Refined Research Notes:
    ---
    ${finalSummary}
    ---
    
    References HTML to be included at the very end:
    <section>
      <h2>References</h2>
      <ul>
        ${sourceList}
      </ul>
    </section>
    `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    return response.text;
  } catch (error)
  {
    console.error("Error generating paper content:", error);
    throw new Error("Failed to generate the final research paper.");
  }
};

export const generateImagePrompts = async (paperText: string): Promise<string[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Based on the following research paper text, generate 3 distinct, highly descriptive prompts for an AI image generator. The prompts should create images that are metaphorical or conceptual representations of the core ideas, suitable for a serious academic paper. Think abstractly.
            
            Paper Text:
            ---
            ${paperText.substring(0, 3000)}...
            ---`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    prompts: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                },
            },
        });
        const result = JSON.parse(response.text);
        return result.prompts || [];
    } catch (error) {
        console.error('Error generating image prompts:', error);
        return [
            "An abstract representation of interconnected data nodes, glowing with blue and purple light in a dark void.",
            "A hyper-realistic image of a futuristic library where books are holograms.",
            "A symbolic image of a human brain merging with a digital circuit board."
        ];
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `Concept art for a scientific journal: ${prompt}, minimalist, conceptual, high-resolution, professional lighting`,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '16:9',
            },
        });
        return response.generatedImages[0].image.imageBytes;
    } catch (error) {
        console.error(`Error generating image for prompt "${prompt}":`, error);
        // Return a more descriptive placeholder
        return "iVBORw0KGgoAAAANSUhEUgAAARwAAACxCAMAAAAh3/JWAAAAA1BMVEX///+nxBvIAAAASElEQVR4nO3BMQEAAADCoPVPbQ0PoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+BsFAAAGeADeIAAAAAElFTkSuQmCC";
    }
};