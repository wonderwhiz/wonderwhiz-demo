import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// API key from environment variable
const groqApiKey = Deno.env.get('GROQ_API_KEY') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query, childProfile, blockCount = 5, specialistTypes = [], quickGeneration = false } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'No query provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Enhanced system prompt for better content quality
    const systemPrompt = `You are an educational assistant creating engaging learning content blocks for children.
    Each block must be unique, educational, and directly relevant to the query "${query}".
    Focus on accuracy and engagement while avoiding repetition.
    Each block MUST provide new information or perspective not covered in other blocks.
    Make answers clear, direct, and age-appropriate for a ${childProfile.age} year old.
    NEVER use generic placeholder content or repeat information.
    IMPORTANT: Each rabbitHole question must extend learning in a new direction.`;

    // Create a user prompt with the query and child profile
    const userPrompt = `Generate ${blockCount} diverse educational content blocks about "${query}" for a child age ${childProfile.age || 10}.
    
    You MUST use ALL of these content block types in a balanced distribution:
    - fact: Educational facts with a title and explanation
    - funFact: Interesting, memorable trivia with clear text
    - quiz: Multiple-choice questions with 4 options, a correctIndex (0-3), and explanation
    - flashcard: Flashcards with front and back content for memorization
    - creative: Creative activities with clear instructions
    - mindfulness: Reflection exercises related to the topic
    
    Each block should be associated with a specialist from: ${specialistTypes.join(', ') || "nova (science), spark (creativity), prism (curiosity)"}
    
    Format your response as a JSON array:
    [
      {
        "type": "fact",
        "specialist_id": "nova",
        "content": {
          "fact": "The educational content goes here...",
          "title": "Interesting Title",
          "rabbitHoles": ["What is the history of X?", "How does X relate to Y?"]
        }
      },
      {
        "type": "quiz",
        "specialist_id": "prism",
        "content": {
          "question": "What is X?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctIndex": 2,
          "explanation": "Explanation of the correct answer"
        }
      },
      {
        "type": "flashcard",
        "specialist_id": "nova",
        "content": {
          "front": "Question or concept on front of card",
          "back": "Answer or explanation on back of card",
          "hint": "Optional hint to help remember"
        }
      },
      {
        "type": "mindfulness",
        "specialist_id": "lotus",
        "content": {
          "title": "Mindful Activity Name",
          "instruction": "Detailed, specific instructions for the mindfulness exercise",
          "duration": "3 minutes"
        }
      }
    ]
    
    CRITICAL REQUIREMENTS:
    1. Each block MUST have complete, specific, non-empty content with all required fields.
    2. For quiz blocks, include a specific question about ${query}, an array of 4 options, correctIndex (0-3), and explanation.
    3. For fact blocks, include both fact text and title.
    4. For flashcard blocks, include front and back content.
    5. For mindfulness blocks, include a title, specific instruction, and duration.
    6. Include EXACTLY 2 "rabbitHoles" for each block - these should be SPECIFIC questions about ${query}, not generic placeholders.
    7. NEVER use placeholder text in any field.
    8. Make ALL content specific to ${query} - avoid generic content.
    
    Keep explanations concise but engaging. Use language appropriate for age ${childProfile.age || 10}.`;

    // Call the Groq API to generate content blocks
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error from Groq API:', errorData);
      throw new Error('Failed to generate content blocks from Groq API');
    }

    const data = await response.json();
    
    let contentBlocks;
    try {
      // Try to parse the content as JSON
      contentBlocks = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('Error parsing Groq response as JSON:', parseError);
      
      // Try to extract JSON with regex
      const jsonMatch = data.choices[0].message.content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          contentBlocks = JSON.parse(jsonMatch[0]);
        } catch (nestedParseError) {
          console.error('Error parsing extracted JSON:', nestedParseError);
          throw new Error('Could not parse content block data');
        }
      } else {
        throw new Error('Invalid response format from AI model');
      }
    }

    // Validate and enhance generated blocks
    const validatedBlocks = contentBlocks.map((block: any) => {
      // Ensure unique content per specialist
      if (block.type === 'fact' || block.type === 'funFact') {
        block.content.title = generateUniqueTitle(block, query);
      }
      
      // Enhance rabbitHole questions
      if (block.content.rabbitHoles) {
        block.content.rabbitHoles = generateUniqueRabbitHoles(block, query);
      }
      
      // Add engagement hooks for each block type
      block.content = addEngagementHooks(block.content, block.type, childProfile.age);
      
      // Check for quiz blocks with incomplete data
      if (block.type === 'quiz') {
        // Ensure each quiz has question, options, and correctIndex
        if (!block.content) block.content = {};
        if (!block.content.question || block.content.question === '') {
          block.content.question = `What is an interesting fact about ${query}?`;
        }
        if (!block.content.options || !Array.isArray(block.content.options) || block.content.options.length < 4) {
          block.content.options = [
            `An interesting fact about ${query}`, 
            `A surprising aspect of ${query}`, 
            `A key feature of ${query}`, 
            `A common misconception about ${query}`
          ];
        }
        if (block.content.correctIndex === undefined || block.content.correctIndex === null) {
          block.content.correctIndex = 0;
        }
        if (!block.content.explanation || block.content.explanation === '') {
          block.content.explanation = `This is important to understand about ${query} because it helps us learn more about the topic.`;
        }
        
        // Add rabbit holes if missing
        if (!block.content.rabbitHoles || !Array.isArray(block.content.rabbitHoles) || block.content.rabbitHoles.length < 2) {
          block.content.rabbitHoles = [
            `How does ${query} compare to similar concepts?`,
            `What are the most interesting aspects of ${query}?`
          ];
        }
      }
      
      // Check for fact blocks with incomplete data
      if (block.type === 'fact') {
        if (!block.content) block.content = {};
        if (!block.content.fact || block.content.fact === '') {
          block.content.fact = `${query} is a fascinating topic with many interesting aspects to explore.`;
        }
        if (!block.content.title || block.content.title === '') {
          block.content.title = `Interesting Fact About ${query}`;
        }
        
        // Check for rabbitHoles
        if (!block.content.rabbitHoles || !Array.isArray(block.content.rabbitHoles) || block.content.rabbitHoles.length < 2) {
          block.content.rabbitHoles = [
            `What is the history of ${query}?`,
            `How does ${query} impact our world today?`
          ];
        }
      }
      
      // Check for funFact blocks with incomplete data
      if (block.type === 'funFact') {
        if (!block.content) block.content = {};
        if (!block.content.text && !block.content.fact) {
          block.content.text = `Did you know that ${query} has some surprising properties that many people don't know about?`;
        }
        
        // Check for rabbitHoles
        if (!block.content.rabbitHoles || !Array.isArray(block.content.rabbitHoles) || block.content.rabbitHoles.length < 2) {
          block.content.rabbitHoles = [
            `What other surprising facts exist about ${query}?`,
            `How was ${query} discovered or developed?`
          ];
        }
      }
      
      // Check for flashcard blocks with incomplete data
      if (block.type === 'flashcard') {
        if (!block.content) block.content = {};
        if (!block.content.front || block.content.front === '') {
          block.content.front = `What is the most important thing to know about ${query}?`;
        }
        if (!block.content.back || block.content.back === '') {
          block.content.back = `${query} is important because it helps us understand more about our world.`;
        }
        if (!block.content.hint || block.content.hint === '') {
          block.content.hint = `Think about how ${query} relates to things you already know.`;
        }
        
        // Check for rabbitHoles
        if (!block.content.rabbitHoles || !Array.isArray(block.content.rabbitHoles) || block.content.rabbitHoles.length < 2) {
          block.content.rabbitHoles = [
            `What are the key concepts related to ${query}?`,
            `How can learning about ${query} help us in daily life?`
          ];
        }
      }
      
      // Check for mindfulness blocks with incomplete data
      if (block.type === 'mindfulness') {
        if (!block.content) block.content = {};
        if (!block.content.title || block.content.title === '') {
          block.content.title = `Mindful Reflection on ${query}`;
        }
        if (!block.content.instruction || block.content.instruction === '') {
          block.content.instruction = `Take a few minutes to think about how ${query} relates to your own experiences. What connections can you make?`;
        }
        if (!block.content.duration || block.content.duration === '') {
          block.content.duration = "3 minutes";
        }
        
        // Check for rabbitHoles
        if (!block.content.rabbitHoles || !Array.isArray(block.content.rabbitHoles) || block.content.rabbitHoles.length < 2) {
          block.content.rabbitHoles = [
            `How does ${query} make you feel?`,
            `What questions do you still have about ${query}?`
          ];
        }
      }
      
      // Check for creative blocks with incomplete data
      if (block.type === 'creative') {
        if (!block.content) block.content = {};
        if (!block.content.prompt || block.content.prompt === '') {
          block.content.prompt = `Create something inspired by what you've learned about ${query}.`;
        }
        if (!block.content.description || block.content.description === '') {
          block.content.description = `Use your imagination to explore ${query} in a creative way.`;
        }
        if (!block.content.examples || !Array.isArray(block.content.examples) || block.content.examples.length < 1) {
          block.content.examples = [`Draw a picture`, `Write a story`, `Make a model`];
        }
        
        // Check for rabbitHoles
        if (!block.content.rabbitHoles || !Array.isArray(block.content.rabbitHoles) || block.content.rabbitHoles.length < 2) {
          block.content.rabbitHoles = [
            `How can we represent ${query} through art?`,
            `What creative projects might be inspired by ${query}?`
          ];
        }
      }
      
      // Fix any generic rabbitHoles by making them specific to the topic
      if (block.content && block.content.rabbitHoles) {
        block.content.rabbitHoles = block.content.rabbitHoles.map((question: string) => {
          if (question.includes("most yummy food in the world") || 
              question.includes("What else can we learn about") ||
              question.includes("How does") && question.includes("affect our daily life")) {
            // Replace with more specific question
            return `How does ${query} compare to other similar ${block.type === 'fact' ? 'concepts' : 'topics'}?`;
          }
          return question;
        });
      }
      
      // Ensure we have specialist_id
      if (!block.specialist_id) {
        block.specialist_id = ['nova', 'spark', 'prism'][Math.floor(Math.random() * 3)];
      }
      
      return block;
    });

    // Ensure we have at least one of each required block type
    const blockTypes = ['fact', 'funFact', 'quiz', 'creative', 'mindfulness', 'flashcard'];
    const missingTypes = blockTypes.filter(type => 
      !validatedBlocks.some(block => block.type === type)
    );
    
    // Add missing block types if needed
    missingTypes.forEach(type => {
      const specialists = ['nova', 'spark', 'prism', 'lotus'];
      const specialist = specialists[Math.floor(Math.random() * specialists.length)];
      
      let newBlock: any = {
        type: type,
        specialist_id: specialist,
        content: {
          rabbitHoles: [
            `What's the most interesting aspect of ${query}?`,
            `How has our understanding of ${query} changed over time?`
          ]
        }
      };
      
      switch(type) {
        case 'fact':
          newBlock.content.fact = `${query} is a fascinating topic with many aspects to explore.`;
          newBlock.content.title = `Key Fact About ${query}`;
          break;
        case 'funFact':
          newBlock.content.text = `Did you know that ${query} has been studied by scientists for many years?`;
          break;
        case 'quiz':
          newBlock.content.question = `What is a key characteristic of ${query}?`;
          newBlock.content.options = [
            `It relates to many other topics`,
            `It has a fascinating history`,
            `It helps us understand our world better`,
            `All of the above`
          ];
          newBlock.content.correctIndex = 3;
          newBlock.content.explanation = `${query} has all these characteristics, making it an important topic to study!`;
          break;
        case 'flashcard':
          newBlock.content.front = `What is ${query}?`;
          newBlock.content.back = `${query} is an important concept that helps us understand the world around us.`;
          newBlock.content.hint = `Think about what you already know about this topic.`;
          break;
        case 'mindfulness':
          newBlock.content.title = `Reflect on ${query}`;
          newBlock.content.instruction = `Take a few moments to think about how ${query} connects to your own experiences.`;
          newBlock.content.duration = "2 minutes";
          break;
        case 'creative':
          newBlock.content.prompt = `Create something based on what you've learned about ${query}.`;
          newBlock.content.description = `Use your imagination to explore ${query} in a creative way.`;
          newBlock.content.examples = [`Draw a picture`, `Write a story`, `Create a model`];
          break;
      }
      
      validatedBlocks.push(newBlock);
    });

    // Filter out any duplicate content
    const uniqueBlocks = removeDuplicateContent(validatedBlocks);

    // Generate IDs for each block
    const blocksWithIds = uniqueBlocks.map((block: any, index: number) => ({
      ...block,
      id: `generated-${Date.now()}-${index}`,
      created_at: new Date().toISOString(),
      liked: false,
      bookmarked: false
    }));

    return new Response(
      JSON.stringify(blocksWithIds),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-curiosity-blocks function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Error generating content blocks' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

function generateUniqueTitle(block: any, query: string): string {
  const baseTitle = block.content.title || '';
  if (!baseTitle.toLowerCase().includes(query.toLowerCase())) {
    return `${baseTitle} - Understanding ${query}`;
  }
  return baseTitle;
}

function generateUniqueRabbitHoles(block: any, query: string): string[] {
  const baseQuestions = block.content.rabbitHoles || [];
  const enhancedQuestions = baseQuestions.map((question: string) => {
    if (question.includes("most yummy food") || question.includes("What else can we learn")) {
      return `How does ${query} relate to ${block.type === 'fact' ? 'everyday life' : 'other scientific concepts'}?`;
    }
    return question;
  });
  
  return enhancedQuestions;
}

function addEngagementHooks(content: any, blockType: string, childAge: number): any {
  // Add age-appropriate engagement hooks based on block type
  const newContent = { ...content };
  
  if (blockType === 'fact' && childAge <= 8) {
    // For young children, add a "Did you know" prefix if not already present
    if (newContent.fact && !newContent.fact.startsWith("Did you know")) {
      newContent.fact = `Did you know? ${newContent.fact}`;
    }
  }
  
  if (blockType === 'quiz' && childAge <= 10) {
    // Make quiz questions more engaging for younger children
    if (newContent.question && !newContent.question.includes("?")) {
      newContent.question = `${newContent.question}?`;
    }
  }
  
  return newContent;
}

function removeDuplicateContent(blocks: any[]): any[] {
  const uniqueBlocks: any[] = [];
  const seenContent = new Set();
  
  blocks.forEach(block => {
    const contentKey = `${block.type}-${JSON.stringify(block.content)}`;
    if (!seenContent.has(contentKey)) {
      seenContent.add(contentKey);
      uniqueBlocks.push(block);
    }
  });
  
  return uniqueBlocks;
}
