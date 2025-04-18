// Repository URLs and constants
export const PEACOCK_REPO = process.env.PEACOCK_REPO || "https://github.com/johnpapa/vscode-peacock";
export const PEACOCK_API_URL = PEACOCK_REPO.replace("github.com", "api.github.com/repos");
export const PEACOCK_RAW_CONTENT = PEACOCK_REPO.replace("github.com", "raw.githubusercontent.com") + "/main";

// Documentation cache state
export let docsCache: Record<string, string> = {};
export let codeCache: Record<string, string> = {};
export let docFilesList: string[] = [];
export let codeFilesList: string[] = [];
export let isDocsCacheInitialized = false;

// File extension matchers
const documentationExtensions = [".md"];
const codeExtensions = [".ts", ".js", ".tsx", ".jsx"];

// Fetch repository directory contents
export async function fetchDirectoryContents(
  path: string
): Promise<Array<{ name: string; type: string; path: string }>> {
  try {
    const url = `${PEACOCK_API_URL}/contents/${path}`;
    const response = await fetch(url);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error(`Error fetching directory: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

// Fetch file content
export async function fetchFileContent(path: string): Promise<string | null> {
  try {
    const response = await fetch(`${PEACOCK_RAW_CONTENT}/${path}`);
    return response.ok ? await response.text() : null;
  } catch {
    return null;
  }
}

// Process a documentation file - add to docs cache if valid
export async function processDocumentationFile(filePath: string): Promise<boolean> {
  const content = await fetchFileContent(filePath);
  if (!content) return false;

  docsCache[filePath] = content;
  docFilesList.push(filePath);
  return true;
}

// Process a code file - add to code cache if valid
export async function processCodeFile(filePath: string): Promise<boolean> {
  const content = await fetchFileContent(filePath);
  if (!content) return false;

  codeCache[filePath] = content;
  codeFilesList.push(filePath);
  return true;
}

// Check if file has documentation extension
export function isDocumentationFile(filename: string): boolean {
  return documentationExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
}

// Check if file has code extension
export function isCodeFile(filename: string): boolean {
  return codeExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
}

// Process directory items recursively
export async function processDirectoryItems(items: Array<{ name: string; type: string; path: string }>): Promise<void> {
  for (const item of items) {
    if (item.name.startsWith(".")) continue;

    if (item.type === "file") {
      if (isDocumentationFile(item.name)) {
        await processDocumentationFile(item.path);
      } else if (isCodeFile(item.name)) {
        await processCodeFile(item.path);
      }
    } else if (item.type === "dir") {
      const subItems = await fetchDirectoryContents(item.path);
      await processDirectoryItems(subItems);
    }
  }
}

// Initialize cache
export async function initializeDocsCache(): Promise<boolean> {
  try {
    // Process root README
    await processDocumentationFile("README.md");

    // Process docs directory
    const docsItems = await fetchDirectoryContents("docs");
    await processDirectoryItems(docsItems);

    // Process src directory
    const srcItems = await fetchDirectoryContents("src");
    await processDirectoryItems(srcItems);

    const totalFiles = docFilesList.length + codeFilesList.length;
    console.error(
      `Indexed ${docFilesList.length} documentation files and ${codeFilesList.length} code files from Peacock repository`
    );
    return totalFiles > 0;
  } catch (error) {
    console.error(`Error initializing cache: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

// Extract heading before a matched line
export function findPrecedingHeading(lines: string[], currentIndex: number): string {
  for (let j = currentIndex - 1; j >= 0 && j >= currentIndex - 5; j--) {
    if (lines[j].startsWith("#")) return lines[j];
  }
  return "";
}

// Process a section of markdown content that matches the query
export function processMatchingMarkdownSection(
  lines: string[],
  startIndex: number,
  query: string
): {
  content: string;
  endIndex: number;
} {
  let sectionContent = "";
  const heading = findPrecedingHeading(lines, startIndex);
  if (heading) sectionContent = heading + "\n\n";

  let i = startIndex;
  while (i < lines.length) {
    sectionContent += lines[i] + "\n";
    i++;
    if (i === lines.length || lines[i].trim() === "" || lines[i].startsWith("#")) break;
  }

  return { content: sectionContent.trim(), endIndex: i };
}

// Process a section of code content that matches the query
export function processMatchingCodeSection(
  lines: string[],
  startIndex: number,
  query: string,
  filePath: string
): {
  content: string;
  endIndex: number;
} {
  // For code files, include context around the match (up to 10 lines before and after)
  const startLine = Math.max(0, startIndex - 10);
  const endLine = Math.min(lines.length, startIndex + 11);

  let sectionContent = `Code from ${filePath}:\n\`\`\`typescript\n`;
  for (let i = startLine; i < endLine; i++) {
    // Highlight the matching line
    if (i === startIndex) {
      sectionContent += `${lines[i]} // <-- Match found here\n`;
    } else {
      sectionContent += `${lines[i]}\n`;
    }
  }
  sectionContent += "```";

  return { content: sectionContent, endIndex: endLine };
}

// Search documentation and code for a query
export function searchAll(query: string): { results: string; sources: string[] } {
  const queryLower = query.toLowerCase();
  const relevantContent: string[] = [];
  const sources: string[] = [];

  // Search documentation files
  for (const [filePath, content] of Object.entries(docsCache)) {
    if (!content.toLowerCase().includes(queryLower)) continue;

    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(queryLower)) {
        const { content: sectionContent, endIndex } = processMatchingMarkdownSection(lines, i, queryLower);
        if (sectionContent) {
          relevantContent.push(sectionContent);
          sources.push(filePath);
        }
        i = endIndex;
      }
    }
  }

  // Search code files
  for (const [filePath, content] of Object.entries(codeCache)) {
    if (!content.toLowerCase().includes(queryLower)) continue;

    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(queryLower)) {
        const { content: sectionContent, endIndex } = processMatchingCodeSection(lines, i, queryLower, filePath);
        if (sectionContent) {
          relevantContent.push(sectionContent);
          sources.push(filePath);
        }
        i = endIndex;
      }
    }
  }

  return {
    results: relevantContent.join("\n\n---\n\n"),
    sources: [...new Set(sources)],
  };
}

// Create response for query
export async function handleDocumentationQuery(query: string): Promise<{ text: string }> {
  // Initialize cache if needed
  if (!isDocsCacheInitialized) {
    isDocsCacheInitialized = await initializeDocsCache();
    if (!isDocsCacheInitialized) {
      return { text: "Failed to initialize documentation cache. Please try again later." };
    }
  }

  // Check if cache is empty
  if (Object.keys(docsCache).length === 0 && Object.keys(codeCache).length === 0) {
    return { text: "No files were found in the Peacock repository." };
  }

  // Handle listing available files
  if (query.toLowerCase().includes("available") && query.toLowerCase().includes("files")) {
    return {
      text: `Available documentation files:\n${docFilesList.join("\n")}\n\nAvailable code files:\n${codeFilesList.join(
        "\n"
      )}`,
    };
  }

  // Search documentation and code
  const { results, sources } = searchAll(query);
  if (!results) {
    return { text: `No information related to "${query}" was found in the Peacock documentation or code.` };
  }

  return { text: `Information related to "${query}":\n\n${results}\n\nSources: ${sources.join(", ")}` };
}
