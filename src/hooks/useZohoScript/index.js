import { useEffect } from 'react';

const useZohoScript = ({ scriptUrl, formNode, scriptNode }) => {
  useEffect(() => {
    const fieldRootNode = formNode ?? document.forms[0];
    const scriptRootNode = scriptNode ?? document.body;

    const zohoHiddenField = createDomElement({
      typeElement: 'input',
      rootNode: fieldRootNode,
      attributes: {
        type: 'hidden',
        id: 'zc_gad',
        name: 'zc_gad',
        value: '',
      },
    });
    const script = createDomElement({
      typeElement: 'script',
      rootNode: scriptRootNode,
      attributes: {
        src: scriptUrl,
        defer: true,
      },
    });

    return () => {
      scriptRootNode.removeChild(script);
      fieldRootNode.removeChild(zohoHiddenField);
    };
  }, [scriptUrl, formNode, scriptNode]);
};

export const createDomElement = ({ typeElement, rootNode, attributes = {} }) => {
  let domElement = document.createElement(typeElement);
  for (const key in attributes) {
    domElement[key] = attributes[key];
  }
  rootNode.appendChild(domElement);
  return domElement;
};

export default useZohoScript;
