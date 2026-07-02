import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_KEY,
});

function safeParseJSON(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Empty response");
  }

  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }

    throw new Error("Invalid JSON");
  }
}

function normalizeFileTree(tree, prefix = "") {
  const result = {};

  if (!tree || typeof tree !== "object" || Array.isArray(tree)) {
    return result;
  }

  for (const [key, value] of Object.entries(tree)) {
    const currentPath = prefix ? `${prefix}/${key}` : key;

    if (value == null) continue;

    if (typeof value === "string") {
      result[currentPath] = { content: value };
      continue;
    }

    if (typeof value === "object" && typeof value.content === "string") {
      result[currentPath] = { content: value.content };
      continue;
    }

    if (
      typeof value === "object" &&
      value.file &&
      typeof value.file.contents === "string"
    ) {
      result[currentPath] = {
        file: {
          contents: value.file.contents,
        },
      };
      continue;
    }
    if (typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, normalizeFileTree(value, currentPath));
    }
  }

  return result;
}

function hasFiles(fileTree) {
  return !!fileTree && Object.keys(fileTree).length > 0;
}

async function generateWithGemini(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `USER REQUEST:\n\n${prompt}`,
          },
        ],
      },
    ],
    config: {
      temperature: 0.2,
      responseMimeType: "application/json",
      systemInstruction: `
You are an expert in MERN and Development. You have an experience of 10 years in the development. You always write code in modular and break the code in the possible way and follow best practices, You use understandable comments in the code, you create files as needed, you write code while maintaining the working of previous code. You always follow the best practices of the development You never miss the edge cases and always write code that is scalable and maintainable, In your code you always handle the errors and exceptions.

IMPORTANT RULES:

- Return ONLY valid JSON.
- Never return markdown.
- Never return explanations outside the JSON.
- Never return any text before or after the JSON.
- The response MUST follow the specified schema exactly.

Response Types:

1. Chat Response

Use this when the user is:
- Greeting you
- Asking a question
- Requesting an explanation
- Having a conversation
- Asking for debugging help without requesting file generation

Format:

{
  "type": "chat",
  "text": "response message",
  "fileTree": null,
  "buildCommand": null,
  "startCommand": null
}

2. Project Response

Use this only when the user explicitly asks to:
- Create a project
- Build an application
- Generate code files
- Create a website
- Create an API
- Create a component
- Scaffold a codebase

Format:

{
  "type": "project",
  "text": "short summary with short explantion of project",
  "fileTree": {
    "package.json": {
      "file":{
      "contents": "..."
    }
    }    
  },
  "buildCommand": {
    "mainItem": "npm",
    "commands": ["install"]
  },
  "startCommand": {
    "mainItem": "npm",
    "commands": ["run", "dev"]
  }
}


Project Rules:

- Generate actual files.
- fileTree MUST NOT be empty.
- Include all required files.
- Include package.json whenever the project uses Node.js.
- Include buildCommand and startCommand when applicable.
- Store file contents in the contents field.

Chat Rules:

- Never generate files.
- fileTree must be null.
- buildCommand must be null.
- startCommand must be null.

Always determine whether the request is "chat" or "project" before generating the response.
      `,
    },
  });

  if (typeof response.text === "string") {
    return response.text;
  }

  if (typeof response.outputText === "string") {
    return response.outputText;
  }

  throw new Error("Model returned no text output");
}

export async function generateResult(prompt) {
  try {
    let raw = await generateWithGemini(prompt);


    let parsed = safeParseJSON(raw);
    let normalized = normalizeFileTree(parsed.fileTree || {});

    //     if (!hasFiles(normalized)) {
    //       console.log("Retrying because fileTree is empty...");

    //       raw = await generateWithGemini(`Generate ACTUAL FILES.

    // Do not describe the project.

    // The previous response had an empty fileTree.

    // ${prompt}`);

    //       parsed = safeParseJSON(raw);
    //       normalized = normalizeFileTree(parsed.fileTree || {});
    //     }

    //     if (!hasFiles(normalized)) {
    //       throw new Error("Model returned empty fileTree after retry");
    //     }

    return {
      text: parsed.text || "",
      fileTree: normalized,
      buildCommand: parsed.buildCommand || null,
      startCommand: parsed.startCommand || null,
    };
  } catch (error) {
    console.error("AI ERROR:", error);

    return {
      text: "Failed to generate . Please try again.",
      fileTree: {},
      buildCommand: null,
      startCommand: null,
    };
  }
}
