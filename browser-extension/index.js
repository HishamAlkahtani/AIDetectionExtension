// returns the text content of the element WITHOUT the children's content
function getHumanReadableTextContent(element) {
  let text = "";
  for (let node of element.childNodes) {
    if (node.nodeType === 3) text += node.nodeValue;
  }
  return text;
}

async function getAiScore(text) {
  let url /* = Link to API Proxy */;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ body: { text: text } }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const jsonResponse = await response.json();
    const responseBody = JSON.parse(jsonResponse.body);
    if (!responseBody.score) throw JSON.stringify(responseBody);
    return responseBody.score;
  } catch (e) {
    console.error(`Could not reach AI detection API: ${e}`);
  }
}

// Only text visible to the user should be checekd
function shouldBeChecked(element) {
  if (element.getAttribute("checkedForAi")) return false;

  const nonVisibleTags = [
    "SCRIPT",
    "STYLE",
    "NOSCRIPT",
    "TEMPLATE",
    "META",
    "LINK",
  ];

  if (nonVisibleTags.includes(element.tagName)) return false;

  if (element.hidden) return false;

  const style = window.getComputedStyle(element);
  if (
    style.display === "none" ||
    style.visibility === "hidden" ||
    style.opacity === "0"
  )
    return false;

  let textContent = getHumanReadableTextContent(element);
  let withoutWhitespace = textContent.replaceAll(/\s/g, "");

  if (!withoutWhitespace) return false;
  if (withoutWhitespace.length < 25) return false;
  return true;
}

async function checkElementAndFlag(element) {
  if (!shouldBeChecked(element)) return;
  const text = getHumanReadableTextContent(element);

  const score = await getAiScore(text);

  if (score && score > 0.5) element.style = "border: 2px solid red;";

  console.log(`${text} got AI score: ${score}`);
  element.setAttribute("checkedForAi", true);
}

// BFS traversal of dom tree
async function traverseAndCheckDocument(node) {
  var elementQueue = [];
  elementQueue.push(node);
  checkElementAndFlag(node);

  while (elementQueue.length > 0) {
    let current = elementQueue.shift();

    await checkElementAndFlag(current);

    for (let child of current.children) {
      elementQueue.push(child);
    }
  }
}

function checkDocument() {
  const body = document.querySelector("body");
  traverseAndCheckDocument(body);
}

setInterval(checkDocument, 3000);
