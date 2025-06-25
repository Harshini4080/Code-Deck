import { createContext, useState, useEffect } from "react";
import { v4 as uuid } from 'uuid';

export const PlaygroundContext = createContext();

/**
 * Map of supported languages with Judge0 API IDs and default code templates
 */
export const languageMap = {
  cpp: {
    id: 54,
    defaultCode:
      `#include <iostream>\n` +
      `using namespace std;\n\n` +
      `int main() {\n` +
      `\tcout << "Hello World!";\n` +
      `\treturn 0;\n` +
      `}`
  },
  java: {
    id: 62,
    defaultCode:
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        System.out.println("Hello World!");\n` +
      `    }\n}`
  },
  python: {
    id: 71,
    defaultCode: `print("Hello World!")`
  },
  javascript: {
    id: 63,
    defaultCode: `console.log("Hello World!");`
  }
};

/**
 * PlaygroundProvider - stores and manages all folders and playgrounds
 */
const PlaygroundProvider = ({ children }) => {
  // Default structure with one folder and two playgrounds
  const initialItems = {
    [uuid()]: {
      title: "DSA",
      playgrounds: {
        [uuid()]: {
          title: "Stack Implementation",
          language: "cpp",
          code: languageMap["cpp"].defaultCode
        },
        [uuid()]: {
          name: "Array",
          language: "javascript",
          code: languageMap["javascript"].defaultCode
        }
      }
    }
  };

  // Load saved data from localStorage, else use default
  const [folders, setFolders] = useState(() => {
    const localData = localStorage.getItem("playgrounds-data");
    return localData ? JSON.parse(localData) : initialItems;
  });

  // Sync data with localStorage on any folder change
  useEffect(() => {
    localStorage.setItem("playgrounds-data", JSON.stringify(folders));
  }, [folders]);

  // Delete a card (playground) from a folder
  const deleteCard = (folderId, cardId) => {
    setFolders(prev => {
      const updated = { ...prev };
      delete updated[folderId].playgrounds[cardId];
      return updated;
    });
  };

  //  Delete entire folder
  const deleteFolder = (folderId) => {
    setFolders(prev => {
      const updated = { ...prev };
      delete updated[folderId];
      return updated;
    });
  };

  //  Create a new folder
  const addFolder = (folderName) => {
    setFolders(prev => ({
      ...prev,
      [uuid()]: {
        title: folderName,
        playgrounds: {}
      }
    }));
  };

  //  Add a playground inside existing folder
  const addPlayground = (folderId, playgroundName, language) => {
    setFolders(prev => {
      const updated = { ...prev };
      updated[folderId].playgrounds[uuid()] = {
        title: playgroundName,
        language,
        code: languageMap[language].defaultCode
      };
      return updated;
    });
  };

  // Add a new folder and playground in one action
  const addPlaygroundAndFolder = (folderName, playgroundName, cardLanguage) => {
    setFolders(prev => ({
      ...prev,
      [uuid()]: {
        title: folderName,
        playgrounds: {
          [uuid()]: {
            title: playgroundName,
            language: cardLanguage,
            code: languageMap[cardLanguage].defaultCode
          }
        }
      }
    }));
  };

  //  Edit folder name
  const editFolderTitle = (folderId, folderName) => {
    setFolders(prev => {
      const updated = { ...prev };
      updated[folderId].title = folderName;
      return updated;
    });
  };

  //  Edit playground (card) title
  const editPlaygroundTitle = (folderId, cardId, PlaygroundTitle) => {
    setFolders(prev => {
      const updated = { ...prev };
      updated[folderId].playgrounds[cardId].title = PlaygroundTitle;
      return updated;
    });
  };

  // Save updated code and language in a playground
  const savePlayground = (folderId, cardId, newCode, newLanguage) => {
    setFolders(prev => {
      const updated = { ...prev };
      updated[folderId].playgrounds[cardId].code = newCode;
      updated[folderId].playgrounds[cardId].language = newLanguage;
      return updated;
    });
  };

  /* Bundle all features and expose through context*/
  const PlayGroundFeatures = {
    folders,
    deleteCard,
    deleteFolder,
    addFolder,
    addPlayground,
    addPlaygroundAndFolder,
    editFolderTitle,
    editPlaygroundTitle,
    savePlayground
  };

  return (
    <PlaygroundContext.Provider value={PlayGroundFeatures}>
      {children}
    </PlaygroundContext.Provider>
  );
};

export default PlaygroundProvider;
